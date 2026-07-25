"use client"

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  ResponsiveContainer,
  YAxis,
} from "recharts"
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
      accent: "hsl(var(--primary))",
      chartData: stats.todaySales.spark,
      chartType: "area" as const,
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
      accent: "hsl(221, 83%, 53%)",
      chartData: stats.todayCount.spark,
      chartType: "area" as const,
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
      accent: "hsl(160, 84%, 39%)",
      chartData: stats.monthSales.spark,
      chartType: "area" as const,
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
      accent: "hsl(0, 72%, 50%)",
      chartData: stats.lowStockCount.spark,
      chartType: "bar" as const,
    },
  ]
}

let chartIdCounter = 0

function ChartCard({
  data,
  accent,
  type = "area",
}: {
  data: number[]
  accent: string
  type?: "area" | "bar"
}) {
  if (!data || data.length === 0) return null
  const chartData = data.map((value, index) => ({ i: index, v: value }))
  const gradientId = `chart-grad-${++chartIdCounter}`

  return (
    <div className="h-16 w-full">
      <ResponsiveContainer width="100%" height="100%">
        {type === "bar" ? (
          <BarChart data={chartData} margin={{ top: 4, bottom: 0, left: 0, right: 0 }}>
            <YAxis hide domain={["dataMin - 1", "dataMax + 1"]} />
            <Bar dataKey="v" fill={accent} radius={[3, 3, 0, 0]} isAnimationActive={false} />
          </BarChart>
        ) : (
          <AreaChart data={chartData} margin={{ top: 2, bottom: 0, left: 0, right: 0 }}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={accent} stopOpacity={0.35} />
                <stop offset="100%" stopColor={accent} stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <YAxis hide domain={["dataMin - 5", "dataMax + 5"]} />
            <Area
              type="monotone"
              dataKey="v"
              stroke={accent}
              strokeWidth={2}
              fill={`url(#${gradientId})`}
              dot={false}
              isAnimationActive={false}
            />
          </AreaChart>
        )}
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
          className="group relative flex cursor-pointer flex-col overflow-hidden rounded-xl border bg-card shadow-sm transition-shadow hover:shadow-md"
        >
          <div className="flex items-start justify-between gap-2 p-4 pb-0">
            <div className="flex items-center gap-3">
              <div
                className={`flex size-12 shrink-0 items-center justify-center rounded-xl ${stat.iconBg}`}
              >
                <HugeiconsIcon
                  icon={stat.icon}
                  size={22}
                  className={stat.iconColor}
                />
              </div>
              <div>
                <p className="text-[11px] font-medium text-muted-foreground sm:text-xs">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold tracking-tight">
                  {stat.formatted
                    ? formatRupiah(stat.value)
                    : stat.value.toLocaleString("id-ID")}
                </p>
              </div>
            </div>
            {stat.change && (
              <span
                className={`inline-flex shrink-0 items-center gap-0.5 rounded-full px-2 py-0.5 text-[11px] font-bold ${
                  stat.positive
                    ? "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20"
                    : "bg-destructive/10 text-destructive dark:bg-destructive/20"
                }`}
              >
                <HugeiconsIcon
                  icon={stat.positive ? ArrowUp01Icon : ArrowDown01Icon}
                  size={11}
                />
                {stat.change}
              </span>
            )}
          </div>

          <div className="px-4 mt-3 flex items-center gap-1.5">
            {stat.change ? (
              <span className="text-[10px] font-medium text-muted-foreground sm:text-[11px]">
                {stat.changeLabel}
              </span>
            ) : (
              <span
                className={`text-[11px] font-semibold rounded-full px-2 py-0.5 ${
                  stat.positive === false && !stat.change
                    ? "bg-destructive/10 text-destructive"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {stat.changeLabel}
              </span>
            )}
          </div>

          <div className="mt-2">
            <ChartCard data={stat.chartData} accent={stat.accent} type={stat.chartType} />
          </div>
        </div>
      ))}
    </div>
  )
}
