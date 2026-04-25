"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import {
  InvoiceIcon,
  MoneyReceiveSquareIcon,
  TimeQuarterPassIcon,
  ChartAverageIcon,
  ArrowUp01Icon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons"
import { formatRupiah } from "@/lib/format"

const stats = [
  {
    title: "Total Transaksi Hari Ini",
    value: "86",
    description: "Naik 8,7% dari kemarin",
    trend: "up" as const,
    icon: InvoiceIcon,
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
  },
  {
    title: "Total Penjualan Hari Ini",
    value: formatRupiah(2450000),
    description: "Omzet transaksi hari ini",
    icon: MoneyReceiveSquareIcon,
    iconBg: "bg-emerald-500/10",
    iconColor: "text-emerald-600",
  },
  {
    title: "Transaksi Pending",
    value: "7",
    description: "Menunggu pembayaran / penyelesaian",
    icon: TimeQuarterPassIcon,
    iconBg: "bg-amber-500/10",
    iconColor: "text-amber-600",
  },
  {
    title: "Rata-rata Nilai Transaksi",
    value: formatRupiah(28500),
    description: "Per transaksi",
    icon: ChartAverageIcon,
    iconBg: "bg-blue-500/10",
    iconColor: "text-blue-600",
  },
]

export function TransaksiStatCards() {
  return (
    <>
      {/* Mobile: horizontal scroll compact cards */}
      <div className="flex gap-3 overflow-x-auto pb-1 lg:hidden -mx-4 px-4 scrollbar-none">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="group relative flex min-w-[160px] shrink-0 cursor-pointer items-center gap-3 rounded-xl border bg-card p-3 shadow-sm transition-shadow hover:shadow-md"
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
              <p className="text-[10px] font-medium text-muted-foreground truncate">
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
        {stats.map((stat) => (
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
