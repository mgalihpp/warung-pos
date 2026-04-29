import { NextResponse, type NextRequest } from "next/server"

import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/server/auth-guards"
import {
  TZ,
  addDays,
  jakartaDateKey,
  mapPaymentLabel,
  startOfDayJakarta,
} from "@/lib/server/jakarta-time"

export async function GET(req: NextRequest) {
  const user = await requireAdmin()
  if (!user) {
    return NextResponse.json({ error: "Tidak memiliki akses" }, { status: 403 })
  }

  const url = new URL(req.url)
  const dateParam = url.searchParams.get("date")
  const now = new Date()
  const today = startOfDayJakarta(now)

  let target = today
  if (dateParam && /^\d{4}-\d{2}-\d{2}$/.test(dateParam)) {
    target = new Date(`${dateParam}T00:00:00+07:00`)
  }
  const dayStart = target
  const dayEnd = addDays(target, 1)

  const [paymentRows, dayTransactions, riwayatTx] = await Promise.all([
    prisma.transaction.groupBy({
      by: ["paymentMethod"],
      where: {
        status: "COMPLETED",
        createdAt: { gte: dayStart, lt: dayEnd },
      },
      _sum: { total: true },
      _count: true,
    }),
    prisma.transaction.findMany({
      where: { createdAt: { gte: dayStart, lt: dayEnd } },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        transactionNumber: true,
        cashierName: true,
        paymentMethod: true,
        status: true,
        total: true,
        createdAt: true,
      },
    }),
    prisma.transaction.findMany({
      where: {
        status: "COMPLETED",
        createdAt: {
          gte: addDays(dayStart, -29),
          lt: dayEnd,
        },
      },
      select: { total: true, paymentMethod: true, createdAt: true },
    }),
  ])

  const totalOmzet = paymentRows.reduce((s, r) => s + (r._sum.total ?? 0), 0)
  const totalCount = paymentRows.reduce((s, r) => s + r._count, 0)

  const breakdown = (["CASH", "QRIS_MANUAL", "MANUAL_TRANSFER"] as const).map(
    (method) => {
      const row = paymentRows.find((r) => r.paymentMethod === method)
      const amount = row?._sum.total ?? 0
      return {
        name: mapPaymentLabel(method),
        method,
        amount,
        count: row?._count ?? 0,
        percentage: totalOmzet > 0 ? Math.round((amount / totalOmzet) * 100) : 0,
      }
    },
  )

  const tunaiMasuk = breakdown.find((b) => b.method === "CASH")?.amount ?? 0

  // Riwayat 30 hari ke belakang termasuk hari ini
  const riwayatMap = new Map<
    string,
    { tanggal: string; transaksi: number; tunai: number; nontunai: number; total: number }
  >()
  for (let i = 29; i >= 0; i--) {
    const d = addDays(dayStart, -i)
    const key = jakartaDateKey(d)
    riwayatMap.set(key, { tanggal: key, transaksi: 0, tunai: 0, nontunai: 0, total: 0 })
  }
  for (const tx of riwayatTx) {
    const key = jakartaDateKey(tx.createdAt)
    const slot = riwayatMap.get(key)
    if (!slot) continue
    slot.transaksi += 1
    slot.total += tx.total
    if (tx.paymentMethod === "CASH") slot.tunai += tx.total
    else slot.nontunai += tx.total
  }
  const dateLabel = new Intl.DateTimeFormat("id-ID", {
    timeZone: TZ,
    day: "numeric",
    month: "short",
    year: "numeric",
  })
  const riwayat = Array.from(riwayatMap.values())
    .reverse()
    .map((r) => ({
      ...r,
      label: dateLabel.format(new Date(`${r.tanggal}T00:00:00+07:00`)),
    }))

  const transactions = dayTransactions.map((t) => ({
    id: t.id,
    transactionNumber: t.transactionNumber,
    cashierName: t.cashierName,
    paymentMethod: mapPaymentLabel(t.paymentMethod),
    status: t.status,
    total: t.total,
    waktu: new Intl.DateTimeFormat("id-ID", {
      timeZone: TZ,
      hour: "2-digit",
      minute: "2-digit",
    }).format(t.createdAt),
  }))

  return NextResponse.json({
    date: jakartaDateKey(target),
    dateLabel: dateLabel.format(target),
    isToday: jakartaDateKey(target) === jakartaDateKey(today),
    summary: {
      totalOmzet,
      totalCount,
      tunaiMasuk,
      nonTunai: totalOmzet - tunaiMasuk,
    },
    breakdown,
    transactions,
    riwayat,
  })
}
