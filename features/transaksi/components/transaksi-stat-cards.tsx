"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import {
  InvoiceIcon,
  MoneyReceiveSquareIcon,
  PackageIcon,
  ChartAverageIcon,
  ArrowUp01Icon,
  ArrowDown01Icon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons"
import { formatRupiah } from "@/lib/format-currency"
import type { TransactionStats } from "../hooks/use-transaksi-queries"

type StatItem = {
  title: string
  value: string
  description: string
  trend?: "up" | "down" | null
  icon: typeof InvoiceIcon
  iconBg: string
  iconColor: string
}

function buildStats(stats: TransactionStats): StatItem[] {
  const trendDir = (val: number | null) =>
    val === null ? null : val >= 0 ? "up" : "down"

  const trendLabel = (val: number | null, suffix = "dari kemarin") => {
    if (val === null) return suffix
    const abs = Math.abs(val)
    return `${val >= 0 ? "Naik" : "Turun"} ${abs}% ${suffix}`
  }

  return [
    {
      title: "Total Transaksi Hari Ini",
      value: String(stats.todayCount),
      description: trendLabel(stats.todayTrend),
      trend: trendDir(stats.todayTrend),
      icon: InvoiceIcon,
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
    },
    {
      title: "Total Penjualan Hari Ini",
      value: formatRupiah(stats.todaySales),
      description: trendLabel(stats.salesTrend, "dari kemarin"),
      trend: trendDir(stats.salesTrend),
      icon: MoneyReceiveSquareIcon,
      iconBg: "bg-emerald-500/10",
      iconColor: "text-emerald-600",
    },
    {
      title: "Barang Terjual Hari Ini",
      value: String(stats.soldProductsCount),
      description: "Total item dari transaksi selesai",
      icon: PackageIcon,
      iconBg: "bg-amber-500/10",
      iconColor: "text-amber-600",
    },
    {
      title: "Rata-rata Nilai Transaksi",
      value: formatRupiah(stats.avgTransaction),
      description: "Per transaksi hari ini",
      icon: ChartAverageIcon,
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-600",
    },
  ]
}

export function TransaksiStatCards({ stats }: { stats: TransactionStats }) {
  const items = buildStats(stats)

  return (
    <>
      {/* Mobile: horizontal scroll compact cards */}
      <div className="scrollbar-none -mx-4 flex gap-3 overflow-x-auto px-4 pb-1 lg:hidden">
        {items.map((stat) => (
          <div
            key={stat.title}
            className="group relative flex min-w-[180px] shrink-0 cursor-pointer items-center gap-3 rounded-xl border bg-card p-3 shadow-sm transition-shadow hover:shadow-md"
          >
            <div
              className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${stat.iconBg}`}
            >
              <HugeiconsIcon
                icon={stat.icon}
                size={18}
                className={stat.iconColor}
              />
            </div>
            <div className="min-w-0">
              <p className="truncate text-[10px] font-medium text-muted-foreground">
                {stat.title}
              </p>
              <p className="text-xl font-bold tracking-tight">{stat.value}</p>
            </div>
            <HugeiconsIcon
              icon={ArrowRight01Icon}
              size={14}
              className="ml-auto shrink-0 text-muted-foreground"
            />
          </div>
        ))}
      </div>

      {/* Desktop: full grid */}
      <div className="hidden lg:grid lg:grid-cols-2 lg:gap-4 2xl:grid-cols-4">
        {items.map((stat) => (
          <div
            key={stat.title}
            className="group relative flex cursor-pointer items-center gap-4 overflow-hidden rounded-xl border bg-card p-4 shadow-sm transition-shadow hover:shadow-md"
          >
            <div
              className={`flex size-12 shrink-0 items-center justify-center rounded-xl ${stat.iconBg}`}
            >
              <HugeiconsIcon
                icon={stat.icon}
                size={22}
                className={stat.iconColor}
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-medium text-muted-foreground sm:text-xs">
                {stat.title}
              </p>
              <p className="text-2xl font-bold tracking-tight">{stat.value}</p>
              <p className="text-[10px] text-muted-foreground sm:text-[11px] flex items-center gap-1">
                {stat.trend === "up" && (
                  <span className="inline-flex items-center gap-0.5 text-emerald-600">
                    <HugeiconsIcon icon={ArrowUp01Icon} size={10} />
                  </span>
                )}
                {stat.trend === "down" && (
                  <span className="inline-flex items-center gap-0.5 text-red-500">
                    <HugeiconsIcon icon={ArrowDown01Icon} size={10} />
                  </span>
                )}
                {stat.description}
              </p>
            </div>
            <HugeiconsIcon
              icon={ArrowRight01Icon}
              size={16}
              className="shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/[0.02] to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
          </div>
        ))}
      </div>
    </>
  )
}
