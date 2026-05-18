import { NextResponse } from "next/server"
import { z } from "zod"

import { requireAdmin, requireCashierOrAdmin } from "@/lib/server/auth-guards"
import { prisma } from "@/lib/prisma"

type RouteParams = { params: Promise<{ id: string }> }

// Map Prisma enum → UI label
function mapStatus(status: string) {
  switch (status) {
    case "COMPLETED":
      return "Selesai"
    case "PENDING":
      return "Pending"
    case "CANCELLED":
      return "Dibatalkan"
    default:
      return status
  }
}

function mapPaymentMethod(method: string) {
  switch (method) {
    case "CASH":
      return "Tunai"
    case "QRIS_MANUAL":
      return "QRIS"
    case "MANUAL_TRANSFER":
      return "Transfer"
    default:
      return method
  }
}

// ── GET — Detail transaksi ──

export async function GET(_request: Request, { params }: RouteParams) {
  const user = await requireCashierOrAdmin()
  if (!user) {
    return NextResponse.json({ error: "Tidak memiliki akses" }, { status: 403 })
  }

  const { id } = await params

  const transaction = await prisma.transaction.findUnique({
    where: { id },
    include: {
      items: {
        select: {
          id: true,
          productId: true,
          productName: true,
          unitPrice: true,
          costPrice: true,
          quantity: true,
          subtotal: true,
          grossProfit: true,
          product: {
            select: { image: true },
          },
        },
        orderBy: { createdAt: "asc" },
      },
      cashier: {
        select: { image: true },
      },
    },
  })

  if (!transaction) {
    return NextResponse.json(
      { error: "Transaksi tidak ditemukan" },
      { status: 404 },
    )
  }

  const dateFormatter = new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Jakarta",
  })

  return NextResponse.json({
    id: transaction.id,
    transactionNumber: transaction.transactionNumber,
    waktu: dateFormatter.format(transaction.createdAt),
    kasir: transaction.cashierName,
    kasirImage: transaction.cashier?.image ?? null,
    metode: mapPaymentMethod(transaction.paymentMethod),
    status: mapStatus(transaction.status),
    subtotal: transaction.subtotal,
    total: transaction.total,
    amountPaid: transaction.amountPaid,
    change: transaction.change,
    notes: transaction.notes,
    items: transaction.items.map((item) => ({
      id: item.id,
      productId: item.productId,
      productName: item.productName,
      productImage: item.product?.image ?? null,
      unitPrice: item.unitPrice,
      quantity: item.quantity,
      subtotal: item.subtotal,
      grossProfit: item.grossProfit,
    })),
  })
}

// ── PATCH — Update status transaksi ──

const VALID_STATUSES = ["COMPLETED", "PENDING", "CANCELLED"] as const

export async function PATCH(request: Request, { params }: RouteParams) {
  const user = await requireCashierOrAdmin()
  if (!user) {
    return NextResponse.json({ error: "Tidak memiliki akses" }, { status: 403 })
  }

  const { id } = await params
  const body = await request.json()
  const { status } = body as { status?: string }

  if (!status || !VALID_STATUSES.includes(status as typeof VALID_STATUSES[number])) {
    return NextResponse.json(
      { success: false, error: "Status tidak valid" },
      { status: 400 },
    )
  }

  const transaction = await prisma.transaction.findUnique({
    where: { id },
    include: { items: true },
  })

  if (!transaction) {
    return NextResponse.json(
      { success: false, error: "Transaksi tidak ditemukan" },
      { status: 404 },
    )
  }

  if (transaction.status === status) {
    return NextResponse.json({ success: true })
  }

  const oldStatus = transaction.status
  const newStatus = status as typeof VALID_STATUSES[number]

  await prisma.$transaction(async (tx) => {
    // If changing FROM COMPLETED to something else → restore stock
    if (oldStatus === "COMPLETED" && newStatus !== "COMPLETED") {
      for (const item of transaction.items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
          select: { stock: true },
        })
        if (!product) continue

        const stockBefore = product.stock
        const stockAfter = stockBefore + item.quantity

        await tx.product.update({
          where: { id: item.productId },
          data: { stock: stockAfter },
        })

        await tx.stockAdjustment.create({
          data: {
            productId: item.productId,
            userId: user.id,
            type: "IN",
            quantity: item.quantity,
            stockBefore,
            stockAfter,
            reason: `Pembatalan transaksi - ${transaction.transactionNumber}`,
            referenceId: transaction.id,
          },
        })
      }
    }

    // If changing TO COMPLETED from something else → deduct stock
    if (newStatus === "COMPLETED" && oldStatus !== "COMPLETED") {
      for (const item of transaction.items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
          select: { stock: true },
        })
        if (!product) continue

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
            reason: `Penyelesaian transaksi - ${transaction.transactionNumber}`,
            referenceId: transaction.id,
          },
        })
      }
    }

    await tx.transaction.update({
      where: { id },
      data: { status: newStatus },
    })
  })

  return NextResponse.json({ success: true })
}

// ── DELETE — Hapus transaksi (admin only) ──

export async function DELETE(_request: Request, { params }: RouteParams) {
  const user = await requireAdmin()
  if (!user) {
    return NextResponse.json({ error: "Hanya admin yang dapat menghapus transaksi" }, { status: 403 })
  }

  const { id } = await params

  const transaction = await prisma.transaction.findUnique({
    where: { id },
    include: { items: true },
  })

  if (!transaction) {
    return NextResponse.json(
      { success: false, error: "Transaksi tidak ditemukan" },
      { status: 404 },
    )
  }

  await prisma.$transaction(async (tx) => {
    // If the transaction was COMPLETED, restore stock
    if (transaction.status === "COMPLETED") {
      for (const item of transaction.items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
          select: { stock: true },
        })
        if (!product) continue

        const stockBefore = product.stock
        const stockAfter = stockBefore + item.quantity

        await tx.product.update({
          where: { id: item.productId },
          data: { stock: stockAfter },
        })

        await tx.stockAdjustment.create({
          data: {
            productId: item.productId,
            userId: user.id,
            type: "IN",
            quantity: item.quantity,
            stockBefore,
            stockAfter,
            reason: `Penghapusan transaksi - ${transaction.transactionNumber}`,
            referenceId: transaction.id,
          },
        })
      }
    }

    // Delete related stock adjustments that reference this transaction
    await tx.stockAdjustment.deleteMany({
      where: { referenceId: id },
    })

    // Delete the transaction (cascade deletes items)
    await tx.transaction.delete({ where: { id } })
  })

  return NextResponse.json({ success: true })
}

// ── PUT — Edit transaksi (item quantities, payment, notes) ──

const updateTransactionSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        quantity: z.number().int().min(1),
      }),
    )
    .min(1, "Minimal 1 item"),
  paymentMethod: z.enum(["CASH", "QRIS_MANUAL", "MANUAL_TRANSFER"]),
  amountPaid: z.number().min(0),
  notes: z.string().optional(),
})

export async function PUT(request: Request, { params }: RouteParams) {
  const user = await requireCashierOrAdmin()
  if (!user) {
    return NextResponse.json({ error: "Tidak memiliki akses" }, { status: 403 })
  }

  const { id } = await params
  const body = await request.json()
  const parsed = updateTransactionSchema.safeParse(body)

  if (!parsed.success) {
    const errors: Record<string, string[]> = {}
    for (const err of parsed.error.issues) {
      const field = err.path.join(".") as string
      if (!errors[field]) errors[field] = []
      errors[field].push(err.message)
    }
    return NextResponse.json({ success: false, errors }, { status: 400 })
  }

  const { items: newItems, paymentMethod, amountPaid, notes } = parsed.data

  // Fetch existing transaction
  const existing = await prisma.transaction.findUnique({
    where: { id },
    include: { items: true },
  })

  if (!existing) {
    return NextResponse.json(
      { success: false, error: "Transaksi tidak ditemukan" },
      { status: 404 },
    )
  }

  // Fetch all products involved (old + new)
  const allProductIds = [
    ...new Set([
      ...existing.items.map((i) => i.productId),
      ...newItems.map((i) => i.productId),
    ]),
  ]

  const products = await prisma.product.findMany({
    where: { id: { in: allProductIds } },
  })
  const productMap = new Map(products.map((p) => [p.id, p]))

  // Validate new products exist
  const validationErrors: string[] = []
  for (const item of newItems) {
    const product = productMap.get(item.productId)
    if (!product) {
      validationErrors.push(`Barang "${item.productId}" tidak ditemukan`)
    }
  }
  if (validationErrors.length > 0) {
    return NextResponse.json(
      { success: false, errors: { items: validationErrors } },
      { status: 400 },
    )
  }

  // Calculate new totals
  const newTransactionItems = newItems.map((item) => {
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

  const newSubtotal = newTransactionItems.reduce((sum, i) => sum + i.subtotal, 0)
  const newTotal = newSubtotal
  const newChange = Math.max(0, amountPaid - newTotal)

  // Validate payment for cash
  if (paymentMethod === "CASH" && amountPaid < newTotal) {
    return NextResponse.json(
      { success: false, errors: { amountPaid: ["Uang yang dibayarkan kurang dari total"] } },
      { status: 400 },
    )
  }

  await prisma.$transaction(async (tx) => {
    // If transaction was COMPLETED, reverse old stock first
    if (existing.status === "COMPLETED") {
      for (const oldItem of existing.items) {
        const product = await tx.product.findUnique({
          where: { id: oldItem.productId },
          select: { stock: true },
        })
        if (!product) continue

        await tx.product.update({
          where: { id: oldItem.productId },
          data: { stock: product.stock + oldItem.quantity },
        })

        await tx.stockAdjustment.create({
          data: {
            productId: oldItem.productId,
            userId: user.id,
            type: "IN",
            quantity: oldItem.quantity,
            stockBefore: product.stock,
            stockAfter: product.stock + oldItem.quantity,
            reason: `Reversi edit transaksi - ${existing.transactionNumber}`,
            referenceId: existing.id,
          },
        })
      }
    }

    // Delete old items
    await tx.transactionItem.deleteMany({ where: { transactionId: id } })

    // Create new items
    await tx.transactionItem.createMany({
      data: newTransactionItems.map((item) => ({
        transactionId: id,
        ...item,
      })),
    })

    // Update transaction
    await tx.transaction.update({
      where: { id },
      data: {
        paymentMethod,
        amountPaid,
        change: newChange,
        subtotal: newSubtotal,
        total: newTotal,
        notes: notes || null,
      },
    })

    // If transaction is COMPLETED, apply new stock deductions
    if (existing.status === "COMPLETED") {
      for (const newItem of newTransactionItems) {
        const product = await tx.product.findUnique({
          where: { id: newItem.productId },
          select: { stock: true },
        })
        if (!product) continue

        await tx.product.update({
          where: { id: newItem.productId },
          data: { stock: product.stock - newItem.quantity },
        })

        await tx.stockAdjustment.create({
          data: {
            productId: newItem.productId,
            userId: user.id,
            type: "OUT",
            quantity: newItem.quantity,
            stockBefore: product.stock,
            stockAfter: product.stock - newItem.quantity,
            reason: `Edit transaksi - ${existing.transactionNumber}`,
            referenceId: existing.id,
          },
        })
      }
    }
  })

  return NextResponse.json({ success: true })
}
