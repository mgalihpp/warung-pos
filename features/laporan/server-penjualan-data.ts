import "server-only"

import { prisma } from "@/lib/prisma"
import {
  TZ,
  addDays,
  addMonths,
  jakartaDateKey,
  mapPaymentLabel,
  pctChange,
  resolveRange,
  startOfYearJakarta,
  type LaporanRange,
} from "@/lib/server/jakarta-time"

const CATEGORY_PALETTE = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#f43f5e",
  "#8b5cf6",
  "#94a3b8",
]

export function parseLaporanRange(value: string | null, fallback: LaporanRange = "30d") {
  const rangeParam = (value ?? fallback) as LaporanRange
  return ["7d", "30d", "ytd"].includes(rangeParam)
    ? rangeParam
    : fallback
}

export async function getLaporanPenjualanData(range: LaporanRange = "30d") {

  const now = new Date()
  const { start, end, prevStart, prevEnd } = resolveRange(now, range)

  const [
    currentAgg,
    prevAgg,
    currentItemsAgg,
    prevItemsAgg,
    txCurrent,
    paymentRows,
    topProductsRaw,
    topProductsMeta,
    topCashiersRaw,
    categoryRows,
  ] = await Promise.all([
    prisma.transaction.aggregate({
      where: { status: "COMPLETED", createdAt: { gte: start, lt: end } },
      _sum: { total: true },
      _count: true,
    }),
    prisma.transaction.aggregate({
      where: { status: "COMPLETED", createdAt: { gte: prevStart, lt: prevEnd } },
      _sum: { total: true },
      _count: true,
    }),
    prisma.transactionItem.aggregate({
      where: {
        transaction: { status: "COMPLETED", createdAt: { gte: start, lt: end } },
      },
      _sum: { grossProfit: true },
    }),
    prisma.transactionItem.aggregate({
      where: {
        transaction: {
          status: "COMPLETED",
          createdAt: { gte: prevStart, lt: prevEnd },
        },
      },
      _sum: { grossProfit: true },
    }),
    prisma.transaction.findMany({
      where: { status: "COMPLETED", createdAt: { gte: start, lt: end } },
      select: { id: true, total: true, createdAt: true, paymentMethod: true },
    }),
    prisma.transaction.groupBy({
      by: ["paymentMethod"],
      where: { status: "COMPLETED", createdAt: { gte: start, lt: end } },
      _sum: { total: true },
    }),
    prisma.transactionItem.groupBy({
      by: ["productId"],
      where: {
        transaction: { status: "COMPLETED", createdAt: { gte: start, lt: end } },
      },
      _sum: { quantity: true, subtotal: true },
      orderBy: { _sum: { quantity: "desc" } },
      take: 5,
    }),
    prisma.product.findMany({
      select: { id: true, name: true, unit: true, image: true },
    }),
    prisma.transaction.groupBy({
      by: ["cashierId", "cashierName"],
      where: { status: "COMPLETED", createdAt: { gte: start, lt: end } },
      _sum: { total: true },
      _count: true,
      orderBy: { _sum: { total: "desc" } },
      take: 5,
    }),
    prisma.$queryRaw<{ name: string; total: number }[]>`
      SELECT c."name" AS "name", COALESCE(SUM(ti."subtotal"), 0)::float AS "total"
      FROM "transaction_item" ti
      JOIN "transaction" t ON t."id" = ti."transactionId"
      JOIN "product" p ON p."id" = ti."productId"
      JOIN "category" c ON c."id" = p."categoryId"
      WHERE t."status" = 'COMPLETED'
        AND t."createdAt" >= ${start}
        AND t."createdAt" < ${end}
      GROUP BY c."name"
      ORDER BY "total" DESC
    `,
  ])

  const productMap = new Map(topProductsMeta.map((p) => [p.id, p]))
  const labaItemRows = await prisma.$queryRaw<
    { date: string; laba: number }[]
  >`
    SELECT to_char(t."createdAt" AT TIME ZONE ${TZ}, 'YYYY-MM-DD') AS "date",
           COALESCE(SUM(ti."grossProfit"), 0)::float AS "laba"
    FROM "transaction_item" ti
    JOIN "transaction" t ON t."id" = ti."transactionId"
    WHERE t."status" = 'COMPLETED'
      AND t."createdAt" >= ${start}
      AND t."createdAt" < ${end}
    GROUP BY 1
  `

  const penjualan = currentAgg._sum.total ?? 0
  const penjualanPrev = prevAgg._sum.total ?? 0
  const labaKotor = currentItemsAgg._sum.grossProfit ?? 0
  const labaKotorPrev = prevItemsAgg._sum.grossProfit ?? 0
  const totalTransaksi = currentAgg._count
  const totalTransaksiPrev = prevAgg._count
  const rataBelanja = totalTransaksi > 0 ? penjualan / totalTransaksi : 0
  const rataBelanjaPrev =
    totalTransaksiPrev > 0 ? penjualanPrev / totalTransaksiPrev : 0

  const stats = {
    penjualan: { value: penjualan, change: pctChange(penjualan, penjualanPrev) },
    labaKotor: { value: labaKotor, change: pctChange(labaKotor, labaKotorPrev) },
    totalTransaksi: {
      value: totalTransaksi,
      change: pctChange(totalTransaksi, totalTransaksiPrev),
    },
    rataBelanja: {
      value: Math.round(rataBelanja),
      change: pctChange(rataBelanja, rataBelanjaPrev),
    },
  }

  // Build per-day buckets
  const dayKeys: string[] = []
  if (range === "7d" || range === "30d") {
    const days = range === "7d" ? 7 : 30
    for (let i = 0; i < days; i++) {
      dayKeys.push(jakartaDateKey(addDays(start, i)))
    }
  } else {
    // ytd: build per-month buckets but reuse date string YYYY-MM-01
    const startYear = startOfYearJakarta(now)
    const monthsCount = parseInt(
      new Intl.DateTimeFormat("en-CA", { timeZone: TZ, month: "2-digit" })
        .formatToParts(now)
        .find((p) => p.type === "month")!.value,
      10,
    )
    for (let i = 0; i < monthsCount; i++) {
      const d = addMonths(startYear, i)
      dayKeys.push(jakartaDateKey(d).slice(0, 7) + "-01")
    }
  }

  const penjualanByDay = new Map<string, number>()
  const countByDay = new Map<string, number>()
  for (const k of dayKeys) {
    penjualanByDay.set(k, 0)
    countByDay.set(k, 0)
  }
  for (const t of txCurrent) {
    const fullKey = jakartaDateKey(t.createdAt)
    const k = range === "ytd" ? `${fullKey.slice(0, 7)}-01` : fullKey
    if (penjualanByDay.has(k)) {
      penjualanByDay.set(k, (penjualanByDay.get(k) ?? 0) + t.total)
      countByDay.set(k, (countByDay.get(k) ?? 0) + 1)
    }
  }
  const labaByDay = new Map<string, number>()
  for (const k of dayKeys) labaByDay.set(k, 0)
  for (const r of labaItemRows) {
    const k = range === "ytd" ? `${r.date.slice(0, 7)}-01` : r.date
    if (labaByDay.has(k)) labaByDay.set(k, (labaByDay.get(k) ?? 0) + Number(r.laba))
  }

  const labelDayFmt = new Intl.DateTimeFormat("id-ID", {
    timeZone: TZ,
    day: "numeric",
    month: "short",
  })
  const labelMonthFmt = new Intl.DateTimeFormat("id-ID", {
    timeZone: TZ,
    month: "short",
  })

  const salesTrend = dayKeys.map((k) => ({
    date:
      range === "ytd"
        ? labelMonthFmt.format(new Date(`${k}T00:00:00+07:00`))
        : labelDayFmt.format(new Date(`${k}T00:00:00+07:00`)),
    penjualan: penjualanByDay.get(k) ?? 0,
    laba: labaByDay.get(k) ?? 0,
  }))

  // Daily summary table — last up to 30 days descending
  const dailySummary = [...dayKeys]
    .reverse()
    .slice(0, 30)
    .map((k) => {
      const penjualanVal = penjualanByDay.get(k) ?? 0
      const trxVal = countByDay.get(k) ?? 0
      return {
        dateKey: k,
        date:
          range === "ytd"
            ? labelMonthFmt.format(new Date(`${k}T00:00:00+07:00`))
            : labelDayFmt.format(new Date(`${k}T00:00:00+07:00`)),
        transaksi: trxVal,
        penjualan: penjualanVal,
        laba: labaByDay.get(k) ?? 0,
        rataBelanja: trxVal > 0 ? Math.round(penjualanVal / trxVal) : 0,
      }
    })

  // Category breakdown
  const totalCategory = categoryRows.reduce((s, r) => s + Number(r.total), 0)
  const top = categoryRows.slice(0, 5)
  const others = categoryRows.slice(5)
  const othersTotal = others.reduce((s, r) => s + Number(r.total), 0)
  const categoryBreakdown = [
    ...top.map((r, i) => ({
      name: r.name,
      value: Number(r.total),
      pct:
        totalCategory > 0
          ? Math.round((Number(r.total) / totalCategory) * 100)
          : 0,
      fill: CATEGORY_PALETTE[i] ?? CATEGORY_PALETTE[CATEGORY_PALETTE.length - 1],
    })),
    ...(othersTotal > 0
      ? [
          {
            name: "Lainnya",
            value: othersTotal,
            pct:
              totalCategory > 0
                ? Math.round((othersTotal / totalCategory) * 100)
                : 0,
            fill: CATEGORY_PALETTE[CATEGORY_PALETTE.length - 1],
          },
        ]
      : []),
  ]

  // Payment methods
  const totalPay = paymentRows.reduce((s, r) => s + (r._sum.total ?? 0), 0)
  const paymentMethods = (
    ["CASH", "QRIS_MANUAL", "MANUAL_TRANSFER"] as const
  ).map((method) => {
    const row = paymentRows.find((r) => r.paymentMethod === method)
    const amount = row?._sum.total ?? 0
    return {
      name: mapPaymentLabel(method),
      amount,
      percentage: totalPay > 0 ? Math.round((amount / totalPay) * 100) : 0,
    }
  })

  // Top products
  const topProducts = topProductsRaw.map((r) => {
    const meta = productMap.get(r.productId)
    return {
      id: r.productId,
      name: meta?.name ?? "Produk",
      unit: meta?.unit ?? "",
      image: meta?.image ?? null,
      sold: r._sum.quantity ?? 0,
      revenue: r._sum.subtotal ?? 0,
    }
  })

  // Top cashiers
  const topCashiers = topCashiersRaw.map((r) => ({
    id: r.cashierId,
    name: r.cashierName,
    count: r._count,
    revenue: r._sum.total ?? 0,
  }))

  return {
    range,
    stats,
    salesTrend,
    dailySummary,
    categoryBreakdown,
    paymentMethods,
    topProducts,
    topCashiers,
  }
}
