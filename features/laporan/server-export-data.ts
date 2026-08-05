import "server-only"

import { prisma } from "@/lib/prisma"
import {
  resolveRange,
  mapPaymentLabel,
  type LaporanRange,
} from "@/lib/server/jakarta-time"

export type RawExportRow = {
  transactionId: string
  transactionNumber: string
  cashierName: string
  paymentMethod: string
  status: string
  subtotal: number
  total: number
  amountPaid: number
  change: number
  notes: string | null
  createdAt: string
  itemId: string
  productId: string
  productName: string
  unitPrice: number
  costPrice: number
  quantity: number
  itemSubtotal: number
  grossProfit: number
  categoryName: string
  productUnit: string
}

export async function getRawExportData(
  range: LaporanRange
): Promise<RawExportRow[]> {
  const now = new Date()
  const { start, end } = resolveRange(now, range)

  const transactions = await prisma.transaction.findMany({
    where: { createdAt: { gte: start, lt: end } },
    include: {
      items: {
        include: {
          product: {
            include: { category: true },
          },
        },
      },
    },
    orderBy: { createdAt: "asc" },
  })

  const rows: RawExportRow[] = []

  for (const tx of transactions) {
    for (const item of tx.items) {
      rows.push({
        transactionId: tx.id,
        transactionNumber: tx.transactionNumber,
        cashierName: tx.cashierName,
        paymentMethod: mapPaymentLabel(tx.paymentMethod),
        status: tx.status,
        subtotal: tx.subtotal,
        total: tx.total,
        amountPaid: tx.amountPaid,
        change: tx.change,
        notes: tx.notes,
        createdAt: tx.createdAt.toISOString(),
        itemId: item.id,
        productId: item.productId,
        productName: item.product.name,
        unitPrice: item.unitPrice,
        costPrice: item.costPrice,
        quantity: item.quantity,
        itemSubtotal: item.subtotal,
        grossProfit: item.grossProfit,
        categoryName: item.product.category?.name ?? "",
        productUnit: item.product.unit,
      })
    }
  }

  return rows
}
