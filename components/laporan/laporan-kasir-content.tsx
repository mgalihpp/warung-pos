"use client"

import * as React from "react"
import Image from "next/image"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowDown01Icon,
  ArrowUp01Icon,
  CashierIcon,
  ChartLineData01Icon,
  DollarCircleIcon,
  InvoiceIcon,
} from "@hugeicons/core-free-icons"

import { Skeleton } from "@/components/ui/skeleton"
import { formatNumber, formatRupiah } from "@/lib/format-currency"
import {
  useLaporanKasir,
  type KasirData,
  type KasirRow,
  type LaporanRange,
} from "@/features/laporan/hooks/use-laporan-queries"

const RANGE_OPTIONS: { value: LaporanRange; label: string }[] = [
  { value: "7d", label: "7 Hari" },
  { value: "30d", label: "30 Hari" },
  { value: "ytd", label: "Tahun Ini" },
]

export function LaporanKasirContent() {
  const [range, setRange] = React.useState<LaporanRange>("30d")
  const { data, isLoading, error } = useLaporanKasir(range)

  if (error) {
    return (
      <div className="rounded-xl border bg-card p-6 text-center text-sm text-destructive">
        Gagal memuat laporan kasir.
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          Performa kasir berdasarkan transaksi yang berhasil
        </p>
        <div className="inline-flex w-fit items-center gap-1 rounded-lg border bg-card p-1 shadow-sm">
          {RANGE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setRange(opt.value)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                range === opt.value
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading || !data ? (
        <KasirSkeleton />
      ) : (
        <>
          <SummaryRow summary={data.summary} />
          <CashierTable rows={data.cashiers} />
        </>
      )}
    </div>
  )
}

function SummaryRow({ summary }: { summary: KasirData["summary"] }) {
  const cards = [
    {
      title: "Total Omzet",
      value: formatRupiah(summary.totalRevenue),
      icon: DollarCircleIcon,
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
    },
    {
      title: "Total Laba Kotor",
      value: formatRupiah(summary.totalProfit),
      icon: ChartLineData01Icon,
      iconBg: "bg-emerald-500/10",
      iconColor: "text-emerald-600",
    },
    {
      title: "Total Transaksi",
      value: formatNumber(summary.totalCount),
      icon: InvoiceIcon,
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-600",
    },
    {
      title: "Kasir Aktif",
      value: formatNumber(summary.activeCashiers),
      icon: CashierIcon,
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

function CashierTable({ rows }: { rows: KasirRow[] }) {
  return (
    <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
      <div className="border-b p-4">
        <h2 className="text-sm font-semibold">Daftar Kasir</h2>
        <p className="text-xs text-muted-foreground">
          {rows.length} kasir aktif pada periode ini
        </p>
      </div>
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[820px] text-left text-xs">
          <thead className="bg-muted/50 text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-semibold">Kasir</th>
              <th className="px-4 py-3 text-right font-semibold">Transaksi</th>
              <th className="px-4 py-3 text-right font-semibold">Omzet</th>
              <th className="px-4 py-3 text-right font-semibold">Laba</th>
              <th className="px-4 py-3 text-right font-semibold">Rata-rata</th>
              <th className="px-4 py-3 text-right font-semibold">Δ Omzet</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-10 text-center text-muted-foreground"
                >
                  Belum ada aktivitas kasir pada periode ini.
                </td>
              </tr>
            ) : (
              rows.map((row) => <CashierTableRow key={row.id} row={row} />)
            )}
          </tbody>
        </table>
      </div>

      {/* ── Mobile/Tablet Card List (<md) ── */}
      <div className="flex flex-col gap-2.5 p-4 pt-0 md:hidden">
        {rows.length === 0 ? (
          <div className="py-6 text-center text-xs text-muted-foreground">
            Belum ada aktivitas kasir pada periode ini.
          </div>
        ) : (
          rows.map((row) => {
            const change = row.revenueChange
            const positive = change !== null && change >= 0
            return (
              <div
                key={row.id}
                className="rounded-lg border border-border/50 bg-background p-3"
              >
                <div className="flex items-center gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-sky-500/10 text-[11px] font-bold text-sky-600">
                    {row.image ? (
                      <Image
                        src={row.image}
                        alt={row.name}
                        width={40}
                        height={40}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      row.name.slice(0, 1).toUpperCase()
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-semibold">{row.name}</p>
                    <p className="text-[11px] text-muted-foreground">
                      {row.count} transaksi
                      {row.lastActiveAt
                        ? ` · Aktif ${new Date(row.lastActiveAt).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}`
                        : ""}
                    </p>
                  </div>
                  {change !== null ? (
                    <span
                      className={`inline-flex shrink-0 items-center gap-0.5 rounded-full px-2 py-0.5 text-[10px] font-bold ${positive ? "bg-emerald-500/10 text-emerald-600" : "bg-rose-500/10 text-rose-600"}`}
                    >
                      <HugeiconsIcon
                        icon={positive ? ArrowUp01Icon : ArrowDown01Icon}
                        size={10}
                      />
                      {Math.abs(change)}%
                    </span>
                  ) : null}
                </div>
                <div className="mt-2.5 grid grid-cols-3 gap-2 rounded-md bg-muted/40 px-2.5 py-2">
                  <div>
                    <p className="text-[10px] font-medium text-muted-foreground">Omzet</p>
                    <p className="text-xs font-bold text-primary">{formatRupiah(row.revenue)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-medium text-muted-foreground">Laba</p>
                    <p className="text-xs font-semibold">{formatRupiah(row.profit)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-medium text-muted-foreground">Rata-rata</p>
                    <p className="text-xs font-semibold">{formatRupiah(row.avgTicket)}</p>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

function CashierTableRow({ row }: { row: KasirRow }) {
  const change = row.revenueChange
  const positive = change !== null && change >= 0
  return (
    <tr className="border-t transition-colors hover:bg-muted/30">
      <td className="px-4 py-2.5">
        <div className="flex items-center gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-sky-500/10 text-[11px] font-bold text-sky-600">
            {row.image ? (
              <Image
                src={row.image}
                alt={row.name}
                width={36}
                height={36}
                className="h-full w-full object-cover"
              />
            ) : (
              row.name.slice(0, 1).toUpperCase()
            )}
          </div>
          <div className="min-w-0">
            <p className="truncate font-semibold">{row.name}</p>
            <p className="text-[11px] text-muted-foreground">
              {row.lastActiveAt
                ? `Aktif terakhir ${new Date(row.lastActiveAt).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}`
                : "Belum aktif"}
            </p>
          </div>
        </div>
      </td>
      <td className="px-4 py-2.5 text-right font-semibold">{row.count}</td>
      <td className="px-4 py-2.5 text-right font-semibold">
        {formatRupiah(row.revenue)}
      </td>
      <td className="px-4 py-2.5 text-right">{formatRupiah(row.profit)}</td>
      <td className="px-4 py-2.5 text-right text-muted-foreground">
        {formatRupiah(row.avgTicket)}
      </td>
      <td className="px-4 py-2.5 text-right">
        {change === null ? (
          <span className="text-muted-foreground">—</span>
        ) : (
          <span
            className={`inline-flex items-center gap-1 font-semibold ${positive ? "text-emerald-600" : "text-rose-600"}`}
          >
            <HugeiconsIcon
              icon={positive ? ArrowUp01Icon : ArrowDown01Icon}
              size={12}
            />
            {Math.abs(change)}%
          </span>
        )}
      </td>
    </tr>
  )
}

function KasirSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-20 rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-[360px] rounded-xl" />
    </div>
  )
}
