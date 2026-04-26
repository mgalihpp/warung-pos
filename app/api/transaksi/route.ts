import { NextResponse } from "next/server"

import { requireCashierOrAdmin } from "@/lib/server/auth-guards"
import { prisma } from "@/lib/prisma"

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

function mapActivityIcon(status: string) {
  switch (status) {
    case "COMPLETED":
      return "completed"
    case "PENDING":
      return "pending"
    case "CANCELLED":
      return "cancelled"
    default:
      return "completed"
  }
}

function mapActivityLabel(status: string) {
  switch (status) {
    case "COMPLETED":
      return "Transaksi selesai"
    case "PENDING":
      return "Transaksi pending"
    case "CANCELLED":
      return "Transaksi dibatalkan"
    default:
      return "Transaksi"
  }
}

export async function GET() {
  const user = await requireCashierOrAdmin()
  if (!user) {
    return NextResponse.json({ error: "Tidak memiliki akses" }, { status: 403 })
  }

  // Both admin and cashier see all transactions
  const cashierWhere = {}

  // Date boundaries for "today" stats
  const now = new Date()
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const startOfYesterday = new Date(startOfToday)
  startOfYesterday.setDate(startOfYesterday.getDate() - 1)

  const [
    allTransactions,
    todayCount,
    yesterdayCount,
    todayCompletedAgg,
    yesterdayCompletedAgg,
    todaySoldProducts,
    recentActivities,
    cashiers,
  ] = await Promise.all([
    // All transactions with items for the table
    prisma.transaction.findMany({
      where: cashierWhere,
      include: {
        items: { select: { productName: true } },
        cashier: { select: { image: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    // Today transaction count
    prisma.transaction.count({
      where: { ...cashierWhere, createdAt: { gte: startOfToday } },
    }),
    // Yesterday transaction count
    prisma.transaction.count({
      where: {
        ...cashierWhere,
        createdAt: { gte: startOfYesterday, lt: startOfToday },
      },
    }),
    // Today completed aggregate
    prisma.transaction.aggregate({
      where: {
        ...cashierWhere,
        createdAt: { gte: startOfToday },
        status: "COMPLETED",
      },
      _sum: { total: true },
      _count: true,
    }),
    // Yesterday completed aggregate
    prisma.transaction.aggregate({
      where: {
        ...cashierWhere,
        createdAt: { gte: startOfYesterday, lt: startOfToday },
        status: "COMPLETED",
      },
      _sum: { total: true },
      _count: true,
    }),
    // Total sold products today from completed transactions
    prisma.transactionItem.aggregate({
      where: {
        transaction: {
          ...cashierWhere,
          createdAt: { gte: startOfToday },
          status: "COMPLETED",
        },
      },
      _sum: { quantity: true },
    }),
    // Recent 4 transactions for activity feed
    prisma.transaction.findMany({
      where: cashierWhere,
      select: {
        transactionNumber: true,
        status: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
      take: 4,
    }),
    // Distinct cashier names for filter dropdown
    prisma.transaction.findMany({
      distinct: ["cashierName"],
      select: { cashierName: true },
      orderBy: { cashierName: "asc" },
    }),
  ])

  // --- Stats ---
  const todaySales = todayCompletedAgg._sum.total ?? 0
  const todayCompletedCount = todayCompletedAgg._count
  const yesterdaySales = yesterdayCompletedAgg._sum.total ?? 0
  const soldProductsCount = todaySoldProducts._sum.quantity ?? 0

  // Trend: percentage change compared to yesterday
  let todayTrend: number | null = null
  if (yesterdayCount > 0) {
    todayTrend = Math.round(((todayCount - yesterdayCount) / yesterdayCount) * 100 * 10) / 10
  }

  let salesTrend: number | null = null
  if (yesterdaySales > 0) {
    salesTrend = Math.round(((todaySales - yesterdaySales) / yesterdaySales) * 100 * 10) / 10
  }

  const avgTransaction = todayCompletedCount > 0 ? Math.round(todaySales / todayCompletedCount) : 0

  const stats = {
    todayCount,
    todayTrend,
    todaySales,
    salesTrend,
    soldProductsCount,
    avgTransaction,
  }

  // --- Transactions for table ---
  const dateFormatter = new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Jakarta",
  })

  const timeFormatter = new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Jakarta",
  })

  const transactions = allTransactions.map((t) => ({
    id: t.id,
    transactionNumber: t.transactionNumber,
    waktu: dateFormatter.format(t.createdAt),
    kasir: t.cashierName,
    kasirImage: t.cashier?.image ?? null,
    item: t.items.map((i) => i.productName).join(", "),
    metode: mapPaymentMethod(t.paymentMethod),
    total: t.total,
    status: mapStatus(t.status),
  }))

  // --- Activities ---
  const activities = recentActivities.map((a) => ({
    type: mapActivityIcon(a.status),
    label: mapActivityLabel(a.status),
    transactionNumber: a.transactionNumber,
    time: timeFormatter.format(a.createdAt),
  }))

  // --- Cashier list for filter ---
  const cashierList = cashiers.map((c) => c.cashierName)

  return NextResponse.json({
    stats,
    transactions,
    activities,
    cashierList,
  })
}
