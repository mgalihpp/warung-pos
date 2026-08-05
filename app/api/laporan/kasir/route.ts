import { NextResponse, type NextRequest } from "next/server"

import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/server/auth-guards"
import {
  pctChange,
  resolveRange,
  type LaporanRange,
} from "@/lib/server/jakarta-time"

export async function GET(req: NextRequest) {
  const user = await requireAdmin()
  if (!user) {
    return NextResponse.json({ error: "Tidak memiliki akses" }, { status: 403 })
  }

  const url = new URL(req.url)
  const rangeParam = (url.searchParams.get("range") ?? "30d") as LaporanRange
  const range: LaporanRange = ["7d", "30d", "ytd"].includes(rangeParam)
    ? rangeParam
    : "30d"

  const now = new Date()
  const { start, end, prevStart, prevEnd } = resolveRange(now, range)

  const [groupCurrent, groupPrev, totalAgg, profitAgg, lastTxRows, userRows] =
    await Promise.all([
      prisma.transaction.groupBy({
        by: ["cashierId", "cashierName"],
        where: { status: "COMPLETED", createdAt: { gte: start, lt: end } },
        _sum: { total: true },
        _count: true,
      }),
      prisma.transaction.groupBy({
        by: ["cashierId"],
        where: {
          status: "COMPLETED",
          createdAt: { gte: prevStart, lt: prevEnd },
        },
        _sum: { total: true },
        _count: true,
      }),
      prisma.transaction.aggregate({
        where: { status: "COMPLETED", createdAt: { gte: start, lt: end } },
        _sum: { total: true },
        _count: true,
      }),
      prisma.transactionItem.aggregate({
        where: {
          transaction: {
            status: "COMPLETED",
            createdAt: { gte: start, lt: end },
          },
        },
        _sum: { grossProfit: true },
      }),
      prisma.$queryRaw<{ cashierId: string; profit: number }[]>`
        SELECT t."cashierId" AS "cashierId",
               COALESCE(SUM(ti."grossProfit"), 0)::float AS "profit"
        FROM "transaction_item" ti
        JOIN "transaction" t ON t."id" = ti."transactionId"
        WHERE t."status" = 'COMPLETED'
          AND t."createdAt" >= ${start}
          AND t."createdAt" < ${end}
        GROUP BY t."cashierId"
      `,
      prisma.user.findMany({
        where: { role: "cashier" },
        select: { id: true, name: true, image: true },
      }),
    ])

  const lastTxByCashier = await prisma.transaction.groupBy({
    by: ["cashierId"],
    where: { status: "COMPLETED", createdAt: { gte: start, lt: end } },
    _max: { createdAt: true },
  })
  const lastByCashier = new Map(
    lastTxByCashier.map((r) => [r.cashierId, r._max.createdAt])
  )

  const profitMap = new Map(
    lastTxRows.map((r) => [r.cashierId, Number(r.profit)])
  )
  const prevMap = new Map(
    groupPrev.map((r) => [
      r.cashierId,
      { revenue: r._sum.total ?? 0, count: r._count },
    ])
  )
  const userMap = new Map(userRows.map((u) => [u.id, u]))

  const cashiers = groupCurrent
    .map((r) => {
      const prev = prevMap.get(r.cashierId)
      const revenue = r._sum.total ?? 0
      const count = r._count
      const profit = profitMap.get(r.cashierId) ?? 0
      const last = lastByCashier.get(r.cashierId) ?? null
      const userMeta = userMap.get(r.cashierId)
      return {
        id: r.cashierId,
        name: r.cashierName,
        image: userMeta?.image ?? null,
        revenue,
        count,
        profit,
        avgTicket: count > 0 ? Math.round(revenue / count) : 0,
        revenueChange: pctChange(revenue, prev?.revenue ?? 0),
        countChange: pctChange(count, prev?.count ?? 0),
        lastActiveAt: last ? last.toISOString() : null,
      }
    })
    .sort((a, b) => b.revenue - a.revenue)

  const totalRevenue = totalAgg._sum.total ?? 0
  const totalCount = totalAgg._count
  const totalProfit = profitAgg._sum.grossProfit ?? 0

  return NextResponse.json({
    range,
    summary: {
      totalRevenue,
      totalCount,
      totalProfit,
      activeCashiers: cashiers.length,
    },
    cashiers,
  })
}
