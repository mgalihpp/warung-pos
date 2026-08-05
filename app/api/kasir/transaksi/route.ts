import { NextResponse } from "next/server"
import { format } from "date-fns"

import { prisma } from "@/lib/prisma"
import { createTransactionSchema } from "@/lib/schemas/pos"
import { requireCashierOrAdmin } from "@/lib/server/auth-guards"

async function generateTransactionNumber(): Promise<string> {
  const today = format(new Date(), "yyyyMMdd")
  const prefix = `TRX-${today}-`

  const lastTransaction = await prisma.transaction.findFirst({
    where: { transactionNumber: { startsWith: prefix } },
    orderBy: { transactionNumber: "desc" },
    select: { transactionNumber: true },
  })

  let nextSeq = 1
  if (lastTransaction) {
    const lastSeq = parseInt(
      lastTransaction.transactionNumber.replace(prefix, ""),
      10
    )
    if (!isNaN(lastSeq)) nextSeq = lastSeq + 1
  }

  return `${prefix}${String(nextSeq).padStart(4, "0")}`
}

// POST — Buat transaksi baru
export async function POST(request: Request) {
  const user = await requireCashierOrAdmin()
  if (!user) {
    return NextResponse.json({ error: "Tidak memiliki akses" }, { status: 403 })
  }

  const body = await request.json()
  const result = createTransactionSchema.safeParse(body)

  if (!result.success) {
    const errors: Record<string, string[]> = {}
    for (const err of result.error.issues) {
      const field = err.path.join(".") as string
      if (!errors[field]) errors[field] = []
      errors[field].push(err.message)
    }
    return NextResponse.json({ success: false, errors }, { status: 400 })
  }

  const { items, paymentMethod, amountPaid, notes } = result.data

  // Fetch all products involved
  const productIds = items.map((item) => item.productId)
  const products = await prisma.product.findMany({
    where: { id: { in: productIds }, isActive: true },
  })

  // Validate all products exist and have sufficient stock
  const validationErrors: string[] = []
  const productMap = new Map(products.map((p) => [p.id, p]))

  for (const item of items) {
    const product = productMap.get(item.productId)
    if (!product) {
      validationErrors.push(
        `Barang "${item.productId}" tidak ditemukan atau tidak aktif`
      )
      continue
    }
    if (product.stock < item.quantity) {
      validationErrors.push(
        `Stok "${product.name}" tidak mencukupi (tersedia: ${product.stock}, diminta: ${item.quantity})`
      )
    }
  }

  if (validationErrors.length > 0) {
    return NextResponse.json(
      { success: false, errors: { items: validationErrors } },
      { status: 400 }
    )
  }

  // Calculate totals
  const transactionItems = items.map((item) => {
    const product = productMap.get(item.productId)!
    const subtotal = product.sellPrice * item.quantity
    const grossProfit = (product.sellPrice - product.buyPrice) * item.quantity
    return {
      productId: item.productId,
      productName: product.name,
      unitPrice: product.sellPrice,
      costPrice: product.buyPrice,
      quantity: item.quantity,
      subtotal,
      grossProfit,
    }
  })

  const subtotal = transactionItems.reduce(
    (sum, item) => sum + item.subtotal,
    0
  )
  const total = subtotal
  const change = amountPaid - total

  if (change < 0 && paymentMethod === "CASH") {
    return NextResponse.json(
      {
        success: false,
        errors: { amountPaid: ["Uang yang dibayarkan kurang dari total"] },
      },
      { status: 400 }
    )
  }

  // Create transaction in a database transaction
  const transactionNumber = await generateTransactionNumber()

  const transaction = await prisma.$transaction(async (tx) => {
    // 1. Create the transaction
    const trx = await tx.transaction.create({
      data: {
        transactionNumber,
        cashierId: user.id,
        cashierName: user.name,
        paymentMethod,
        status: "COMPLETED",
        subtotal,
        total,
        amountPaid,
        change: Math.max(0, change),
        notes: notes || null,
        items: {
          create: transactionItems,
        },
      },
      include: { items: true },
    })

    // 2. Decrement stock for each product & create StockAdjustment
    for (const item of items) {
      const product = productMap.get(item.productId)!
      const stockBefore = product.stock
      const stockAfter = stockBefore - item.quantity

      await tx.product.update({
        where: { id: item.productId },
        data: { stock: stockAfter },
      })

      await tx.stockAdjustment.create({
        data: {
          productId: item.productId,
          userId: user.id,
          type: "OUT",
          quantity: item.quantity,
          stockBefore,
          stockAfter,
          reason: `Penjualan - ${transactionNumber}`,
          referenceId: trx.id,
        },
      })
    }

    return trx
  })

  return NextResponse.json({
    success: true,
    transaction: {
      id: transaction.id,
      transactionNumber: transaction.transactionNumber,
      cashierName: transaction.cashierName,
      paymentMethod: transaction.paymentMethod,
      status: transaction.status,
      subtotal: transaction.subtotal,
      total: transaction.total,
      amountPaid: transaction.amountPaid,
      change: transaction.change,
      notes: transaction.notes,
      createdAt: transaction.createdAt.toISOString(),
      items: transaction.items.map((item) => ({
        productName: item.productName,
        unitPrice: item.unitPrice,
        quantity: item.quantity,
        subtotal: item.subtotal,
      })),
    },
  })
}

// GET — Riwayat transaksi kasir
export async function GET(request: Request) {
  const user = await requireCashierOrAdmin()
  if (!user) {
    return NextResponse.json({ error: "Tidak memiliki akses" }, { status: 403 })
  }

  const { searchParams } = new URL(request.url)
  const limit = parseInt(searchParams.get("limit") || "20", 10)
  const offset = parseInt(searchParams.get("offset") || "0", 10)

  const [transactions, total] = await Promise.all([
    prisma.transaction.findMany({
      where: { cashierId: user.id },
      include: {
        items: {
          select: {
            productName: true,
            unitPrice: true,
            quantity: true,
            subtotal: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
    }),
    prisma.transaction.count({
      where: { cashierId: user.id },
    }),
  ])

  const transactionItems = transactions.map((trx) => ({
    id: trx.id,
    transactionNumber: trx.transactionNumber,
    cashierName: trx.cashierName,
    paymentMethod: trx.paymentMethod,
    status: trx.status,
    subtotal: trx.subtotal,
    total: trx.total,
    amountPaid: trx.amountPaid,
    change: trx.change,
    notes: trx.notes,
    itemCount: trx.items.length,
    items: trx.items,
    createdAt: trx.createdAt.toISOString(),
  }))

  return NextResponse.json({
    transactions: transactionItems,
    total,
    limit,
    offset,
  })
}
