"use client"

import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { formatCompact, formatRupiah } from "@/lib/format-currency"
import type {
  SalesChartPoint,
  SalesRange,
} from "@/features/dashboard/hooks/use-dashboard-queries"

const chartConfig = {
  penjualan: {
    label: "Penjualan",
    color: "var(--color-chart-4)",
  },
  laba: {
    label: "Laba",
    color: "var(--color-chart-2)",
  },
} satisfies ChartConfig

type SalesChartProps = {
  data: SalesChartPoint[]
  range: SalesRange
  onRangeChange: (range: SalesRange) => void
}

export function SalesChart({ data, range, onRangeChange }: SalesChartProps) {
  return (
    <div className="grid min-w-0 grid-cols-1 gap-6 lg:col-span-2 lg:grid-cols-2">
      <ChartPanel
        title="Total Penjualan"
        dataKey="penjualan"
        data={data}
        range={range}
        onRangeChange={onRangeChange}
        type="line"
      />
      <ChartPanel
        title="Keuntungan Bersih"
        dataKey="laba"
        data={data}
        range={range}
        onRangeChange={onRangeChange}
        type="bar"
      />
    </div>
  )
}

function ChartPanel({
  title,
  dataKey,
  data,
  range,
  onRangeChange,
  type,
}: SalesChartProps & {
  title: string
  dataKey: "penjualan" | "laba"
  type: "line" | "bar"
}) {
  const max = Math.max(0, ...data.map((d) => d[dataKey]))
  const tickFormatter = (v: number) => formatCompact(v, max)
  return (
    <div className="flex h-full min-w-0 flex-col overflow-hidden rounded-xl border bg-card p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold">{title}</h3>
        <Select
          value={range}
          onValueChange={(v) => onRangeChange(v as SalesRange)}
        >
          <SelectTrigger className="h-7 w-[92px] text-xs">
            <SelectValue placeholder="Per Hari" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">Per Hari</SelectItem>
            <SelectItem value="month">Per Minggu</SelectItem>
            <SelectItem value="year">Per Bulan</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="min-h-[220px] min-w-0 flex-1">
        <ChartContainer config={chartConfig} className="h-full w-full">
          {type === "line" ? (
            <LineChart data={data}>
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
                tickFormatter={tickFormatter}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value) => formatRupiah(Number(value))}
                  />
                }
              />
              <Line
                dataKey={dataKey}
                type="monotone"
                stroke="var(--color-penjualan)"
                strokeWidth={2.5}
                dot={{ r: 3 }}
                isAnimationActive={false}
              />
            </LineChart>
          ) : (
            <BarChart data={data} maxBarSize={40}>
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
                tickFormatter={tickFormatter}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value) => formatRupiah(Number(value))}
                  />
                }
              />
              <Bar
                dataKey={dataKey}
                fill="var(--color-laba)"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          )}
        </ChartContainer>
      </div>
    </div>
  )
}
