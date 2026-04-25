"use client"

import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { formatRupiah } from "@/lib/format"

const salesData = [
  { date: "18 Mei", penjualan: 1800000 },
  { date: "19 Mei", penjualan: 1650000 },
  { date: "20 Mei", penjualan: 1400000 },
  { date: "21 Mei", penjualan: 1950000 },
  { date: "22 Mei", penjualan: 1700000 },
  { date: "23 Mei", penjualan: 2100000 },
  { date: "24 Mei", penjualan: 2450000 },
]

const chartConfig = {
  penjualan: {
    label: "Penjualan",
    color: "var(--color-chart-4)",
  },
} satisfies ChartConfig

export function SalesChart() {
  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold">Grafik Penjualan</h3>
        <span className="rounded-md border px-2.5 py-1 text-xs text-muted-foreground">
          7 Hari Terakhir ▾
        </span>
      </div>
      <ChartContainer config={chartConfig} className="aspect-auto h-[220px] w-full">
        <BarChart data={salesData} maxBarSize={40}>
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            fontSize={11}
            tickMargin={8}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            fontSize={11}
            tickMargin={4}
            tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`}
          />
          <ChartTooltip
            content={
              <ChartTooltipContent
                formatter={(value) => formatRupiah(Number(value))}
              />
            }
          />
          <Bar
            dataKey="penjualan"
            fill="var(--color-penjualan)"
            radius={[6, 6, 0, 0]}
          />
        </BarChart>
      </ChartContainer>
    </div>
  )
}
