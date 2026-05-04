"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowDataTransferHorizontalIcon,
  CalendarIcon,
  DollarCircleIcon,
  InvoiceIcon,
  Money01Icon,
  QrCodeIcon,
  Wallet03Icon,
} from "@hugeicons/core-free-icons"

import { Skeleton } from "@/components/ui/skeleton"
import { formatNumber, formatRupiah } from "@/lib/format-currency"
import {
  useLaporanKas,
  type KasBreakdownItem,
  type KasData,
} from "@/features/laporan/hooks/use-laporan-queries"

export function LaporanKasContent() {
  const [date, setDate] = React.useState<string | null>(null)
  const { data, isLoading, error } = useLaporanKas(date)

  if (error) {
    return (
      <div className="rounded-xl border bg-card p-6 text-center text-sm text-destructive">
        Gagal memuat laporan kas.
      </div>
    )
  }

  if (isLoading || !data) return <KasSkeleton />

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 rounded-xl border bg-card p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold">
            Tutup Kas — {data.dateLabel}
          </h2>
          <p className="text-xs text-muted-foreground">
            {data.isToday
              ? "Menampilkan rekap untuk hari ini"
              : "Menampilkan rekap pada tanggal terpilih"}
          </p>
        </div>
        <label className="inline-flex items-center gap-2 rounded-lg border bg-background px-3 py-2 text-sm shadow-sm">
          <HugeiconsIcon
            icon={CalendarIcon}
            size={16}
            className="text-muted-foreground"
          />
          <input
            type="date"
            value={date ?? data.date}
            max={new Date().toISOString().slice(0, 10)}
            onChange={(e) => setDate(e.target.value || null)}
            className="bg-transparent text-sm outline-none"
          />
        </label>
      </div>

      <SummaryCards summary={data.summary} />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(320px,1fr)]">
        <BreakdownCard breakdown={data.breakdown} totalOmzet={data.summary.totalOmzet} />
        <DayTransactionsCard transactions={data.transactions} />
      </div>

      <RiwayatCard rows={data.riwayat} />
    </div>
  )
}

function SummaryCards({ summary }: { summary: KasData["summary"] }) {
  const cards = [
    {
      title: "Total Omzet Hari Ini",
      value: formatRupiah(summary.totalOmzet),
      icon: DollarCircleIcon,
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
    },
    {
      title: "Tunai Masuk",
      value: formatRupiah(summary.tunaiMasuk),
      icon: Wallet03Icon,
      iconBg: "bg-emerald-500/10",
      iconColor: "text-emerald-600",
    },
    {
      title: "Non-Tunai",
      value: formatRupiah(summary.nonTunai),
      icon: ArrowDataTransferHorizontalIcon,
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-600",
    },
    {
      title: "Jumlah Transaksi",
      value: formatNumber(summary.totalCount),
      icon: InvoiceIcon,
      iconBg: "bg-violet-500/10",
      iconColor: "text-violet-600",
    },
  ]
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
      {cards.map((c) => (
        <div
          key={c.title}
          className="flex items-center gap-3 rounded-xl border bg-card p-3 shadow-sm lg:p-4"
        >
          <div
            className={`flex size-10 shrink-0 items-center justify-center rounded-xl lg:size-12 ${c.iconBg}`}
          >
            <HugeiconsIcon icon={c.icon} size={20} className={c.iconColor} />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-medium text-muted-foreground">
              {c.title}
            </p>
            <p className="truncate text-base font-bold tracking-tight lg:text-lg">
              {c.value}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}

function BreakdownCard({
  breakdown,
  totalOmzet,
}: {
  breakdown: KasBreakdownItem[]
  totalOmzet: number
}) {
  const iconMap = {
    Tunai: { icon: Money01Icon, tone: "bg-emerald-500/10 text-emerald-600" },
    QRIS: { icon: QrCodeIcon, tone: "bg-blue-500/10 text-blue-600" },
    Transfer: {
      icon: ArrowDataTransferHorizontalIcon,
      tone: "bg-violet-500/10 text-violet-600",
    },
  } as const

  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm">
      <h2 className="mb-4 text-sm font-semibold">Rincian Metode Pembayaran</h2>
      {totalOmzet === 0 ? (
        <div className="py-8 text-center text-xs text-muted-foreground">
          Belum ada penjualan tercatat pada tanggal ini
        </div>
      ) : (
        <div className="space-y-3">
          {breakdown.map((b) => {
            const meta = iconMap[b.name]
            return (
              <div
                key={b.name}
                className="flex items-center gap-3 rounded-lg border bg-background p-3"
              >
                <div
                  className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${meta.tone}`}
                >
                  <HugeiconsIcon icon={meta.icon} size={18} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold">{b.name}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {b.count} transaksi · {b.percentage}%
                  </p>
                </div>
                <p className="text-sm font-bold whitespace-nowrap">
                  {formatRupiah(b.amount)}
                </p>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function DayTransactionsCard({
  transactions,
}: {
  transactions: KasData["transactions"]
}) {
  return (
    <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
      <div className="border-b p-4">
        <h2 className="text-sm font-semibold">Transaksi Hari Ini</h2>
        <p className="text-xs text-muted-foreground">
          {transactions.length} transaksi tercatat
        </p>
      </div>
      <div className="max-h-[360px] overflow-y-auto">
        {transactions.length === 0 ? (
          <div className="py-10 text-center text-xs text-muted-foreground">
            Belum ada transaksi.
          </div>
        ) : (
          <ul className="divide-y">
            {transactions.map((t) => (
              <li
                key={t.id}
                className="flex items-center gap-3 px-4 py-3 text-xs"
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-[11px] font-bold text-primary">
                  {t.waktu}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-bold">{t.transactionNumber}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {t.cashierName} · {t.paymentMethod}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold">{formatRupiah(t.total)}</p>
                  <p
                    className={`text-[10px] font-semibold ${
                      t.status === "COMPLETED"
                        ? "text-emerald-600"
                        : t.status === "PENDING"
                          ? "text-amber-600"
                          : "text-rose-600"
                    }`}
                  >
                    {t.status === "COMPLETED"
                      ? "Selesai"
                      : t.status === "PENDING"
                        ? "Pending"
                        : "Dibatalkan"}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

function RiwayatCard({ rows }: { rows: KasData["riwayat"] }) {
  return (
    <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
      <div className="border-b p-4">
        <h2 className="text-sm font-semibold">Riwayat Tutup Kas (30 Hari)</h2>
      </div>
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[640px] text-left text-xs">
          <thead className="bg-muted/50 text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-semibold">Tanggal</th>
              <th className="px-4 py-3 text-center font-semibold">Transaksi</th>
              <th className="px-4 py-3 text-right font-semibold">Tunai</th>
              <th className="px-4 py-3 text-right font-semibold">Non-Tunai</th>
              <th className="px-4 py-3 text-right font-semibold">Total</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr
                key={r.tanggal}
                className="border-t transition-colors hover:bg-muted/30"
              >
                <td className="px-4 py-2.5 font-medium">{r.label}</td>
                <td className="px-4 py-2.5 text-center">{r.transaksi}</td>
                <td className="px-4 py-2.5 text-right">
                  {formatRupiah(r.tunai)}
                </td>
                <td className="px-4 py-2.5 text-right">
                  {formatRupiah(r.nontunai)}
                </td>
                <td className="px-4 py-2.5 text-right font-bold">
                  {formatRupiah(r.total)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Mobile/Tablet Card List (<md) ── */}
      <div className="flex flex-col gap-2 p-4 pt-0 md:hidden">
        {rows.length === 0 ? (
          <div className="py-6 text-center text-xs text-muted-foreground">
            Belum ada riwayat tutup kas.
          </div>
        ) : (
          rows.map((r) => (
            <div
              key={r.tanggal}
              className="flex items-center justify-between gap-3 rounded-lg border border-border/50 bg-background px-3 py-2.5"
            >
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold">{r.label}</p>
                <p className="text-[11px] text-muted-foreground">
                  {r.transaksi} transaksi
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold">{formatRupiah(r.total)}</p>
                <p className="text-[10px] text-muted-foreground">
                  Tunai {formatRupiah(r.tunai)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

function KasSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <Skeleton className="h-20 rounded-xl" />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-20 rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-[280px] rounded-xl" />
      <Skeleton className="h-[300px] rounded-xl" />
    </div>
  )
}
