"use client"

import { useSearchParam } from "@/hooks/use-search-param"
import { Bar, BarChart, Line, LineChart, ResponsiveContainer } from "recharts"
import { BestSellersPanel } from "@/features/dashboard/components/best-sellers-panel"
import { CategoryChart } from "@/features/dashboard/components/category-chart"
import { LowStockPanel } from "@/features/dashboard/components/low-stock-panel"
import { PaymentMethods } from "@/features/dashboard/components/payment-methods"
import { RecentTransactions } from "@/features/dashboard/components/recent-transactions"
import { SalesChart } from "@/features/dashboard/components/sales-chart"
import { StatCards } from "@/features/dashboard/components/stat-cards"
import { formatRupiah } from "@/lib/format-currency"
import {
  useDashboard,
  type DashboardData,
  type SalesRange,
} from "@/features/dashboard/hooks/use-dashboard-queries"

type AdminDashboardContentProps = {
  initialData: DashboardData
}

export function AdminDashboardContent({
  initialData,
}: AdminDashboardContentProps) {
  const [rangeParam, setRange] = useSearchParam("range", initialData.range)
  const range = rangeParam as SalesRange
  const { data = initialData } = useDashboard(range, initialData)
  const totalPenjualan = data.salesChart.reduce(
    (sum, item) => sum + item.penjualan,
    0
  )
  const totalLaba = data.salesChart.reduce((sum, item) => sum + item.laba, 0)
  const marginLaba = totalPenjualan > 0 ? (totalLaba / totalPenjualan) * 100 : 0

  return (
    <div className="flex min-w-0 flex-col gap-6 p-4 lg:p-6">
      <DashboardGreeting range={range} onRangeChange={setRange} />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <PerformanceCard
          label="Total Penjualan"
          value={formatRupiah(totalPenjualan)}
          caption="Tren penjualan"
          data={data.salesChart}
          dataKey="penjualan"
          change={data.performanceChanges.sales}
          color="#2563eb"
          statusLabel="Penjualan periode"
          chartType="bar"
        />
        <PerformanceCard
          label="Total Keuntungan"
          value={formatRupiah(totalLaba)}
          caption="Tren laba"
          data={data.salesChart}
          dataKey="laba"
          change={data.performanceChanges.profit}
          color="#059669"
          statusLabel="Laba periode"
          chartType="line"
        />
        <PerformanceCard
          label="Margin Keuntungan"
          value={`${marginLaba.toLocaleString("id-ID", {
            maximumFractionDigits: 1,
          })}%`}
          caption="Laba dari total penjualan"
          data={data.salesChart}
          dataKey="laba"
          color="#d97706"
          margin={marginLaba}
          change={data.performanceChanges.profit}
          statusLabel="Margin periode"
          chartType="progress"
        />
        <StatCards stats={data.stats} className="contents" />
      </div>

      <div className="flex min-w-0 flex-col gap-6 xl:flex-row">
        <div className="flex min-w-0 flex-1 flex-col gap-6 overflow-hidden">
          <div className="flex flex-col gap-6">
            <SalesChart
              data={data.salesChart}
              range={range}
              onRangeChange={setRange}
            />
            <CategoryChart data={data.categoryChart} />
          </div>

          <div className="flex min-w-0 flex-col gap-6 2xl:flex-row">
            <div className="flex flex-col gap-6 2xl:w-[300px] 2xl:shrink-0">
              <PaymentMethods methods={data.paymentMethods} />
            </div>

            <div className="min-w-0 flex-1">
              <RecentTransactions transactions={data.recentTransactions} />
            </div>
          </div>
        </div>

        <div className="flex w-full flex-col gap-6 lg:grid lg:grid-cols-2 xl:flex xl:w-[320px] xl:shrink-0 2xl:w-[350px]">
          <LowStockPanel
            items={data.lowStock}
            total={data.stats.lowStockCount.value}
          />
          <BestSellersPanel items={data.bestSellers} />
        </div>
      </div>
    </div>
  )
}

function DashboardGreeting({
  range,
  onRangeChange,
}: {
  range: SalesRange
  onRangeChange: (value: string) => void
}) {
  const periods: { value: SalesRange; label: string }[] = [
    { value: "today", label: "Hari ini" },
    { value: "week", label: "Minggu ini" },
    { value: "month", label: "Bulan ini" },
    { value: "year", label: "Tahun ini" },
  ]

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-2xl font-bold tracking-tight">Selamat pagi, Admin</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Pantau performa toko hari ini.
        </p>
      </div>
      <div
        className="flex flex-wrap gap-1 rounded-lg bg-muted p-1"
        aria-label="Periode dashboard"
      >
        {periods.map((period) => (
          <button
            key={period.value}
            type="button"
            onClick={() => onRangeChange(period.value)}
            className={`rounded-md px-3 py-2 text-xs font-semibold transition-colors ${
              range === period.value
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {period.label}
          </button>
        ))}
      </div>
    </div>
  )
}

function PerformanceCard({
  label,
  value,
  caption,
  data,
  dataKey,
  color,
  margin,
  statusLabel,
  chartType,
  change,
}: {
  label: string
  value: string
  caption: string
  data: DashboardData["salesChart"]
  dataKey: "penjualan" | "laba"
  color: string
  margin?: number
  statusLabel: string
  chartType: "bar" | "line" | "progress"
  change: number | null
}) {
  const isPositive = (change ?? 0) >= 0
  const statusColor = isPositive
    ? "text-emerald-700 dark:text-emerald-400"
    : "text-red-700 dark:text-red-400"
  const statusBg = isPositive
    ? "bg-emerald-500/10 dark:bg-emerald-500/15"
    : "bg-red-500/10 dark:bg-red-500/15"

  return (
    <div className="relative overflow-hidden rounded-xl border bg-card p-5 shadow-sm">
      <div
        className="absolute inset-x-0 top-0 h-1"
        style={{ backgroundColor: color }}
      />
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-medium text-muted-foreground">{label}</p>
          <p className="mt-2 text-xl font-bold tracking-tight sm:text-2xl 2xl:text-3xl">
            {margin !== undefined ? value.replace("%", "") : value}
            {margin !== undefined && <span className="ml-1">%</span>}
          </p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1">
          <span
            className={`rounded-md px-2 py-1 text-[11px] font-bold ${statusBg} ${statusColor}`}
          >
            {change === null ? "-" : `${change > 0 ? "+" : ""}${change}%`}
          </span>
        </div>
      </div>
      <div className="mt-4 flex items-end gap-3">
        <div className="h-12 min-w-0 flex-1">
          {chartType === "progress" ? (
            <div className="flex h-full items-center">
              <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-amber-600"
                  style={{ width: `${Math.min(margin ?? 0, 100)}%` }}
                />
              </div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              {chartType === "line" ? (
                <LineChart data={data}>
                  <Line
                    dataKey={dataKey}
                    type="monotone"
                    stroke={color}
                    strokeWidth={2}
                    dot={false}
                    isAnimationActive={false}
                  />
                </LineChart>
              ) : (
                <BarChart data={data} barCategoryGap="28%">
                  <Bar
                    dataKey={dataKey}
                    fill={color}
                    radius={[3, 3, 0, 0]}
                    isAnimationActive={false}
                  />
                </BarChart>
              )}
            </ResponsiveContainer>
          )}
        </div>
        <div className="max-w-[125px] text-right">
          <p className={`text-[11px] font-semibold ${statusColor}`}>
            {statusLabel}
          </p>
          <p className="mt-0.5 text-[11px] leading-4 text-muted-foreground">
            {caption}
          </p>
        </div>
      </div>
    </div>
  )
}
