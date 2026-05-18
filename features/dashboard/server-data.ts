import "server-only"

import { prisma } from "@/lib/prisma"

// ── Types ──

type Range = "7d" | "30d" | "ytd"

// ── Helpers ──

const TZ = "Asia/Jakarta"

function startOfDayJakarta(d: Date) {
  // Convert to Jakarta date string (yyyy-mm-dd) then back to UTC midnight.
  // Simpler: compute offset by formatting day/month/year in Asia/Jakarta.
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(d)
  const y = parts.find((p) => p.type === "year")!.value
  const m = parts.find((p) => p.type === "month")!.value
  const day = parts.find((p) => p.type === "day")!.value
  // 00:00 Asia/Jakarta == 17:00 UTC previous day. Use ISO with +07:00 offset.
  return new Date(`${y}-${m}-${day}T00:00:00+07:00`)
}

function addDays(d: Date, n: number) {
  const r = new Date(d)
  r.setDate(r.getDate() + n)
  return r
}

function addMonths(d: Date, n: number) {
  const r = new Date(d)
  r.setMonth(r.getMonth() + n)
  return r
}

function startOfMonthJakarta(d: Date) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
  }).formatToParts(d)
  const y = parts.find((p) => p.type === "year")!.value
  const m = parts.find((p) => p.type === "month")!.value
  return new Date(`${y}-${m}-01T00:00:00+07:00`)
}

function startOfYearJakarta(d: Date) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ,
    year: "numeric",
  }).formatToParts(d)
  const y = parts.find((p) => p.type === "year")!.value
  return new Date(`${y}-01-01T00:00:00+07:00`)
}

function jakartaDateKey(d: Date) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d)
}

function jakartaMonthKey(d: Date) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
  }).format(d)
}

function mapPaymentMethodLabel(method: string): "Tunai" | "QRIS" | "Transfer" {
  switch (method) {
    case "CASH":
      return "Tunai"
    case "QRIS_MANUAL":
      return "QRIS"
    case "MANUAL_TRANSFER":
      return "Transfer"
    default:
      return "Tunai"
  }
}

function mapStatusLabel(status: string): "Selesai" | "Pending" | "Dibatalkan" {
  switch (status) {
    case "COMPLETED":
      return "Selesai"
    case "PENDING":
      return "Pending"
    case "CANCELLED":
      return "Dibatalkan"
    default:
      return "Selesai"
  }
}

function pctChange(current: number, previous: number): number | null {
  if (previous <= 0) return null
  return Math.round(((current - previous) / previous) * 100 * 10) / 10
}

const CATEGORY_PALETTE = [
  "#3b82f6", // blue-500
  "#10b981", // emerald-500
  "#f59e0b", // amber-500
  "#f43f5e", // rose-500
  "#8b5cf6", // violet-500
  "#94a3b8", // slate-400 (Lainnya)
]

// ── Handler ──

export function parseDashboardRange(value: string | null): Range {
  const rangeParam = (value ?? "7d") as Range
  return ["7d", "30d", "ytd"].includes(rangeParam) ? rangeParam : "7d"
}

export async function getDashboardData(range: Range = "7d") {
  const now = new Date()
  const startToday = startOfDayJakarta(now)
  const startTomorrow = addDays(startToday, 1)
  const startYesterday = addDays(startToday, -1)
  const startMonth = startOfMonthJakarta(now)
  const startLastMonth = addMonths(startMonth, -1)
  const startNextMonth = addMonths(startMonth, 1)
  const start7d = addDays(startToday, -6) // inclusive of today = 7 days
  const startYear = startOfYearJakarta(now)

  // --- Parallel queries ---
  const [
    todayCompletedAgg,
    yesterdayCompletedAgg,
    todayCount,
    yesterdayCount,
    monthCompletedAgg,
    lastMonthCompletedAgg,
    sales7dRows,
    last7dCountRows,
    lowStockProducts,
    lowStockTotalCount,
    paymentTodayAgg,
    recentTx,
    bestSellersRaw,
    monthCategoryRows,
    salesChartTx,
  ] = await Promise.all([
    prisma.transaction.aggregate({
      where: { status: "COMPLETED", createdAt: { gte: startToday, lt: startTomorrow } },
      _sum: { total: true },
      _count: true,
    }),
    prisma.transaction.aggregate({
      where: { status: "COMPLETED", createdAt: { gte: startYesterday, lt: startToday } },
      _sum: { total: true },
      _count: true,
    }),
    prisma.transaction.count({
      where: { createdAt: { gte: startToday, lt: startTomorrow } },
    }),
    prisma.transaction.count({
      where: { createdAt: { gte: startYesterday, lt: startToday } },
    }),
    prisma.transaction.aggregate({
      where: { status: "COMPLETED", createdAt: { gte: startMonth, lt: startNextMonth } },
      _sum: { total: true },
    }),
    prisma.transaction.aggregate({
      where: { status: "COMPLETED", createdAt: { gte: startLastMonth, lt: startMonth } },
      _sum: { total: true },
    }),
    // Sales last 7 days (per day, COMPLETED)
    prisma.transaction.findMany({
      where: { status: "COMPLETED", createdAt: { gte: start7d, lt: startTomorrow } },
      select: { total: true, createdAt: true, items: { select: { grossProfit: true } } },
    }),
    // Tx count last 7 days (all status) for sparkline of jumlah transaksi
    prisma.transaction.findMany({
      where: { createdAt: { gte: start7d, lt: startTomorrow } },
      select: { createdAt: true },
    }),
    // Low stock products (active, stock <= minStock) — top 5 lowest
    prisma.product.findMany({
      where: { isActive: true, stock: { lte: prisma.product.fields.minStock } },
      orderBy: { stock: "asc" },
      select: { id: true, name: true, stock: true, minStock: true, unit: true, image: true },
      take: 5,
    }),
    prisma.product.count({
      where: { isActive: true, stock: { lte: prisma.product.fields.minStock } },
    }),
    // Payment methods today
    prisma.transaction.groupBy({
      by: ["paymentMethod"],
      where: { status: "COMPLETED", createdAt: { gte: startToday, lt: startTomorrow } },
      _sum: { total: true },
    }),
    // Recent transactions (5 latest, any status)
    prisma.transaction.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        items: { select: { productName: true } },
        cashier: { select: { image: true } },
      },
    }),
    // Best sellers this month
    prisma.transactionItem.groupBy({
      by: ["productId"],
      where: {
        transaction: { status: "COMPLETED", createdAt: { gte: startMonth, lt: startNextMonth } },
      },
      _sum: { quantity: true, subtotal: true },
      orderBy: { _sum: { quantity: "desc" } },
      take: 5,
    }),
    // Category breakdown (this month)
    prisma.$queryRaw<{ categoryId: string; name: string; total: number }[]>`
      SELECT c."id" AS "categoryId", c."name" AS "name", COALESCE(SUM(ti."subtotal"), 0)::float AS "total"
      FROM "transaction_item" ti
      JOIN "transaction" t ON t."id" = ti."transactionId"
      JOIN "product" p ON p."id" = ti."productId"
      JOIN "category" c ON c."id" = p."categoryId"
      WHERE t."status" = 'COMPLETED'
        AND t."createdAt" >= ${startMonth}
        AND t."createdAt" < ${startNextMonth}
      GROUP BY c."id", c."name"
      ORDER BY "total" DESC
    `,
    // Sales chart range
    prisma.transaction.findMany({
      where: {
        status: "COMPLETED",
        createdAt: {
          gte:
            range === "7d"
              ? start7d
              : range === "30d"
                ? addDays(startToday, -29)
                : startYear,
          lt: startTomorrow,
        },
      },
      select: { total: true, createdAt: true, items: { select: { grossProfit: true } } },
    }),
  ])

  // --- Stats: today's sales sparkline + spark sums ---
  const dayTotals = new Map<string, number>()
  const dayProfits = new Map<string, number>()
  for (let i = 0; i < 7; i++) {
    const d = addDays(start7d, i)
    dayTotals.set(jakartaDateKey(d), 0)
    dayProfits.set(jakartaDateKey(d), 0)
  }
  for (const r of sales7dRows) {
    const k = jakartaDateKey(r.createdAt)
    if (dayTotals.has(k)) {
      dayTotals.set(k, (dayTotals.get(k) ?? 0) + r.total)
      dayProfits.set(
        k,
        (dayProfits.get(k) ?? 0) + r.items.reduce((sum, item) => sum + item.grossProfit, 0),
      )
    }
  }
  const sparkSales = Array.from(dayTotals.values())

  const dayCounts = new Map<string, number>()
  for (let i = 0; i < 7; i++) {
    const d = addDays(start7d, i)
    dayCounts.set(jakartaDateKey(d), 0)
  }
  for (const r of last7dCountRows) {
    const k = jakartaDateKey(r.createdAt)
    if (dayCounts.has(k)) dayCounts.set(k, (dayCounts.get(k) ?? 0) + 1)
  }
  const sparkCount = Array.from(dayCounts.values())

  // Penjualan bulanan sparkline: per-day totals last 7 days within current month
  const sparkMonth = sparkSales

  // Low stock sparkline: stock values of top 5 lowest (or pad if <5)
  const sparkLowStock = lowStockProducts.map((p) => p.stock)
  while (sparkLowStock.length < 7) sparkLowStock.unshift(0)

  const todaySales = todayCompletedAgg._sum.total ?? 0
  const yesterdaySales = yesterdayCompletedAgg._sum.total ?? 0
  const monthSales = monthCompletedAgg._sum.total ?? 0
  const lastMonthSales = lastMonthCompletedAgg._sum.total ?? 0

  const stats = {
    todaySales: {
      value: todaySales,
      change: pctChange(todaySales, yesterdaySales),
      spark: sparkSales,
    },
    todayCount: {
      value: todayCount,
      change: pctChange(todayCount, yesterdayCount),
      spark: sparkCount,
    },
    monthSales: {
      value: monthSales,
      change: pctChange(monthSales, lastMonthSales),
      spark: sparkMonth,
    },
    lowStockCount: {
      value: lowStockTotalCount,
      spark: sparkLowStock,
    },
  }

  // --- Sales chart series ---
  type SeriesPoint = { date: string; penjualan: number; laba: number }
  let salesChart: SeriesPoint[] = []
  if (range === "7d" || range === "30d") {
    const days = range === "7d" ? 7 : 30
    const start = range === "7d" ? start7d : addDays(startToday, -29)
    const buckets = new Map<string, number>()
    const profitBuckets = new Map<string, number>()
    for (let i = 0; i < days; i++) {
      const d = addDays(start, i)
      buckets.set(jakartaDateKey(d), 0)
      profitBuckets.set(jakartaDateKey(d), 0)
    }
    for (const r of salesChartTx) {
      const k = jakartaDateKey(r.createdAt)
      if (buckets.has(k)) {
        buckets.set(k, (buckets.get(k) ?? 0) + r.total)
        profitBuckets.set(
          k,
          (profitBuckets.get(k) ?? 0) + r.items.reduce((sum, item) => sum + item.grossProfit, 0),
        )
      }
    }
    const labelFmt = new Intl.DateTimeFormat("id-ID", {
      timeZone: TZ,
      day: "numeric",
      month: "short",
    })
    salesChart = Array.from(buckets.entries()).map(([key, total]) => ({
      // key is yyyy-mm-dd in Jakarta; produce label
      date: labelFmt.format(new Date(`${key}T00:00:00+07:00`)),
      penjualan: total,
      laba: profitBuckets.get(key) ?? 0,
    }))
  } else {
    // ytd → per month
    const buckets = new Map<string, number>()
    const profitBuckets = new Map<string, number>()
    const monthsCount = (() => {
      const parts = new Intl.DateTimeFormat("en-CA", {
        timeZone: TZ,
        month: "2-digit",
      }).formatToParts(now)
      return parseInt(parts.find((p) => p.type === "month")!.value, 10)
    })()
    for (let i = 0; i < monthsCount; i++) {
      const d = addMonths(startYear, i)
      buckets.set(jakartaMonthKey(d), 0)
      profitBuckets.set(jakartaMonthKey(d), 0)
    }
    for (const r of salesChartTx) {
      const k = jakartaMonthKey(r.createdAt)
      if (buckets.has(k)) {
        buckets.set(k, (buckets.get(k) ?? 0) + r.total)
        profitBuckets.set(
          k,
          (profitBuckets.get(k) ?? 0) + r.items.reduce((sum, item) => sum + item.grossProfit, 0),
        )
      }
    }
    const labelFmt = new Intl.DateTimeFormat("id-ID", {
      timeZone: TZ,
      month: "short",
    })
    salesChart = Array.from(buckets.entries()).map(([key, total]) => ({
      date: labelFmt.format(new Date(`${key}-01T00:00:00+07:00`)),
      penjualan: total,
      laba: profitBuckets.get(key) ?? 0,
    }))
  }

  // --- Category chart ---
  const totalCategory = monthCategoryRows.reduce((s, r) => s + Number(r.total), 0)
  const top = monthCategoryRows.slice(0, 5)
  const others = monthCategoryRows.slice(5)
  const othersTotal = others.reduce((s, r) => s + Number(r.total), 0)
  const categoryChart = [
    ...top.map((r, i) => ({
      name: r.name,
      value: totalCategory > 0 ? Math.round((Number(r.total) / totalCategory) * 100) : 0,
      fill: CATEGORY_PALETTE[i] ?? CATEGORY_PALETTE[CATEGORY_PALETTE.length - 1],
    })),
    ...(othersTotal > 0
      ? [
          {
            name: "Lainnya",
            value: totalCategory > 0 ? Math.round((othersTotal / totalCategory) * 100) : 0,
            fill: CATEGORY_PALETTE[5],
          },
        ]
      : []),
  ]

  // --- Payment methods (today) ---
  const totalPayToday = paymentTodayAgg.reduce((s, p) => s + (p._sum.total ?? 0), 0)
  const wantedMethods: ("CASH" | "QRIS_MANUAL" | "MANUAL_TRANSFER")[] = [
    "CASH",
    "QRIS_MANUAL",
    "MANUAL_TRANSFER",
  ]
  const paymentMethods = wantedMethods.map((m) => {
    const found = paymentTodayAgg.find((p) => p.paymentMethod === m)
    const amount = found?._sum.total ?? 0
    return {
      name: mapPaymentMethodLabel(m),
      amount,
      percentage: totalPayToday > 0 ? Math.round((amount / totalPayToday) * 100) : 0,
    }
  })

  // --- Recent transactions ---
  const dateFmt = new Intl.DateTimeFormat("id-ID", {
    timeZone: TZ,
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })
  const recentTransactions = recentTx.map((t, i) => {
    const initials = (t.cashierName || "?")
      .split(/\s+/)
      .map((p) => p.charAt(0))
      .join("")
      .slice(0, 2)
      .toUpperCase()
    return {
      no: i + 1,
      id: t.id,
      waktu: dateFmt.format(t.createdAt),
      kasir: t.cashierName,
      kasirImage: t.cashier?.image ?? null,
      initials,
      items: t.items.map((it) => it.productName).join(", "),
      total: t.total,
      status: mapStatusLabel(t.status),
    }
  })

  // --- Low stock list ---
  const lowStock = lowStockProducts.map((p) => ({
    id: p.id,
    name: p.name,
    stock: p.stock,
    unit: p.unit,
    image: p.image,
    status: (p.stock <= 0 ? "OUT" : "LOW") as "OUT" | "LOW",
    urgency: (p.stock <= 0 || p.stock <= Math.max(1, Math.floor(p.minStock / 2))
      ? "danger"
      : "warning") as "danger" | "warning",
  }))

  // --- Best sellers ---
  const productIds = bestSellersRaw.map((b) => b.productId)
  const productInfos = productIds.length
    ? await prisma.product.findMany({
        where: { id: { in: productIds } },
        select: { id: true, name: true, unit: true, image: true },
      })
    : []
  const productMap = new Map(productInfos.map((p) => [p.id, p]))
  const bestSellers = bestSellersRaw.map((b, i) => {
    const info = productMap.get(b.productId)
    return {
      rank: i + 1,
      id: b.productId,
      name: info?.name ?? "(Barang dihapus)",
      unit: info?.unit ?? "pcs",
      image: info?.image ?? null,
      sold: b._sum.quantity ?? 0,
      revenue: b._sum.subtotal ?? 0,
    }
  })

  return {
    range,
    stats,
    salesChart,
    categoryChart,
    paymentMethods,
    recentTransactions,
    lowStock,
    bestSellers,
  }
}
