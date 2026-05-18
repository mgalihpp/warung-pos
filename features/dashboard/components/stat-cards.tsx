"use client"

import { Line, LineChart, ResponsiveContainer, YAxis } from "recharts"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  MoneyBag02Icon,
  ShoppingCart01Icon,
  ChartHistogramIcon,
  Alert02Icon,
  ArrowUp01Icon,
  ArrowDown01Icon,
} from "@hugeicons/core-free-icons"
import { formatRupiah } from "@/lib/format-currency"
import type { DashboardStats } from "@/features/dashboard/hooks/use-dashboard-queries"

function formatChange(value: number | null | undefined) {
  if (value === null || value === undefined) return null
  const positive = value >= 0
  const abs = Math.abs(value).toString().replace(".", ",")
  return { text: `${positive ? "+" : "-"}${abs}%`, positive }
}

function buildStats(stats: DashboardStats) {
  const todayChange = formatChange(stats.todaySales.change)
  const countChange = formatChange(stats.todayCount.change)
  const monthChange = formatChange(stats.monthSales.change)
  return [
    {
      title: "Penjualan Hari Ini",
      value: stats.todaySales.value,
      formatted: true,
      change: todayChange?.text ?? null,
      changeLabel: todayChange ? "dibanding kemarin" : "Belum ada pembanding",
      positive: todayChange?.positive ?? true,
      icon: MoneyBag02Icon,
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
      chartColor: "text-primary",
      chartData: stats.todaySales.spark,
    },
    {
      title: "Jumlah Transaksi",
      value: stats.todayCount.value,
      formatted: false,
      change: countChange?.text ?? null,
      changeLabel: countChange ? "dibanding kemarin" : "Belum ada pembanding",
      positive: countChange?.positive ?? true,
      icon: ShoppingCart01Icon,
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-600",
      chartColor: "text-blue-600",
      chartData: stats.todayCount.spark,
    },
    {
      title: "Penjualan Bulanan",
      value: stats.monthSales.value,
      formatted: true,
      change: monthChange?.text ?? null,
      changeLabel: monthChange ? "dibanding bulan lalu" : "Belum ada pembanding",
      positive: monthChange?.positive ?? true,
      icon: ChartHistogramIcon,
      iconBg: "bg-emerald-500/10",
      iconColor: "text-emerald-600",
      chartColor: "text-emerald-600",
      chartData: stats.monthSales.spark,
    },
    {
      title: "Barang Hampir Habis",
      value: stats.lowStockCount.value,
      formatted: false,
      change: null,
      changeLabel: "Perlu restok segera",
      positive: false,
      icon: Alert02Icon,
      iconBg: "bg-destructive/10",
      iconColor: "text-destructive",
      chartColor: "text-destructive",
      chartData: stats.lowStockCount.spark,
    },
  ]
}

function Sparkline({
  data,
  className,
}: {
  data: number[]
  className?: string
}) {
  if (!data || data.length === 0) {
    return <div className={className} />
  }
  const chartData = data.map((value, index) => ({ index, value }))
  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 2, bottom: 2, left: 0, right: 0 }}
        >
          <YAxis hide domain={["dataMin", "dataMax"]} />
          <Line
            type="monotone"
            dataKey="value"
            stroke="currentColor"
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export function StatCards({ stats }: { stats: DashboardStats }) {
  const items = buildStats(stats)
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4">
      {items.map((stat) => (
        <div
          key={stat.title}
          className="group relative overflow-hidden rounded-xl border bg-card p-4 shadow-sm transition-shadow hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${stat.iconBg}`}
              >
                <HugeiconsIcon
                  icon={stat.icon}
                  size={20}
                  className={stat.iconColor}
                />
              </div>
              <div className="space-y-0.5">
                <p className="text-[11px] font-medium text-muted-foreground sm:text-xs">
                  {stat.title}
                </p>
                <p className="text-lg font-bold tracking-tight sm:text-xl">
                  {stat.formatted
                    ? formatRupiah(stat.value)
                    : stat.value.toLocaleString("id-ID")}
                </p>
              </div>
            </div>
            <div className={`h-8 w-14 shrink-0 opacity-70 ${stat.chartColor}`}>
              <Sparkline data={stat.chartData} className="size-full" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1.5 pl-[3.25rem]">
            {stat.change !== null ? (
              <>
                <span
                  className={`inline-flex items-center gap-0.5 text-[11px] font-semibold ${stat.positive ? "text-emerald-600" : "text-destructive"}`}
                >
                  <HugeiconsIcon
                    icon={stat.positive ? ArrowUp01Icon : ArrowDown01Icon}
                    size={12}
                  />
                  {stat.change}
                </span>
                <span className="min-w-0 truncate text-[10px] text-muted-foreground sm:text-[11px]">
                  {stat.changeLabel}
                </span>
              </>
            ) : (
              <span
                className={`text-[11px] font-medium ${stat.positive === false && !stat.change ? "text-destructive" : "text-muted-foreground"}`}
              >
                {stat.changeLabel}
              </span>
            )}
          </div>
          {/* Subtle gradient overlay on hover */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/[0.02] to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
        </div>
      ))}
    </div>
  )
}
