import "server-only"

import { prisma } from "@/lib/prisma"

export type BarangDetailData = Awaited<ReturnType<typeof getBarangDetailData>>

export async function getBarangDetailData(productId: string) {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: { category: true },
  })

  if (!product) return null

  const now = new Date()
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const thirtyDaysAgo = new Date(startOfToday)
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29)
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  const [
    transactionItems,
    stockAdjustments,
    totalSoldAgg,
    totalRevenueAgg,
    soldThisMonthAgg,
  ] = await Promise.all([
    prisma.transactionItem.findMany({
      where: {
        productId,
        createdAt: { gte: thirtyDaysAgo },
      },
      select: { quantity: true, subtotal: true, createdAt: true },
      orderBy: { createdAt: "asc" },
    }),
    prisma.stockAdjustment.findMany({
      where: { productId },
      include: { user: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
      take: 8,
    }),
    prisma.transactionItem.aggregate({
      where: { productId },
      _sum: { quantity: true },
    }),
    prisma.transactionItem.aggregate({
      where: { productId },
      _sum: { subtotal: true },
    }),
    prisma.transactionItem.aggregate({
      where: { productId, createdAt: { gte: startOfMonth } },
      _sum: { quantity: true },
    }),
  ])

  // Daily trend (30 days)
  const dailyMap = new Map<string, number>()
  for (let i = 0; i < 30; i += 1) {
    const d = new Date(thirtyDaysAgo)
    d.setDate(d.getDate() + i)
    const key = d.toISOString().slice(0, 10)
    dailyMap.set(key, 0)
  }
  for (const item of transactionItems) {
    const key = item.createdAt.toISOString().slice(0, 10)
    if (dailyMap.has(key)) {
      dailyMap.set(key, (dailyMap.get(key) ?? 0) + item.quantity)
    }
  }
  const salesTrend = Array.from(dailyMap.entries()).map(([date, quantity]) => ({
    date,
    quantity,
  }))

  const movements = stockAdjustments.map((adj) => ({
    id: adj.id,
    createdAt: adj.createdAt.toISOString(),
    type: adj.type, // IN | OUT | CORRECTION
    quantity: adj.quantity,
    stockBefore: adj.stockBefore,
    stockAfter: adj.stockAfter,
    reason: adj.reason,
    referenceId: adj.referenceId,
    userName: adj.user?.name ?? "-",
  }))

  const activities = movements.slice(0, 4).map((m) => ({
    id: m.id,
    type: m.type,
    quantity: m.quantity,
    reason: m.reason,
    createdAt: m.createdAt,
  }))

  const margin =
    product.sellPrice > 0
      ? ((product.sellPrice - product.buyPrice) / product.sellPrice) * 100
      : 0

  const stockValue = product.stock * product.buyPrice

  return {
    product: {
      id: product.id,
      name: product.name,
      categoryId: product.categoryId,
      category: product.category.name,
      image: product.image,
      unit: product.unit,
      stock: product.stock,
      minStock: product.minStock,
      buyPrice: product.buyPrice,
      sellPrice: product.sellPrice,
      description: product.description,
      isActive: product.isActive,
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString(),
    },
    stats: {
      soldThisMonth: soldThisMonthAgg._sum.quantity ?? 0,
      totalSold: totalSoldAgg._sum.quantity ?? 0,
      totalRevenue: totalRevenueAgg._sum.subtotal ?? 0,
      margin,
      stockValue,
    },
    salesTrend,
    movements,
    activities,
  }
}
