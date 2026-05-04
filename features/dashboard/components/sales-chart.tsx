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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { formatRupiah } from "@/lib/format-currency"
import type { SalesChartPoint, SalesRange } from "@/features/dashboard/hooks/use-dashboard-queries"

const chartConfig = {
  penjualan: {
    label: "Omzet",
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
    <div className="flex h-full flex-col rounded-xl border bg-card p-4 shadow-sm overflow-hidden">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold">Grafik Omzet & Laba</h3>
        <Select value={range} onValueChange={(v) => onRangeChange(v as SalesRange)}>
          <SelectTrigger className="h-7 w-[130px] text-xs">
            <SelectValue placeholder="Pilih rentang" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">7 Hari Terakhir</SelectItem>
            <SelectItem value="30d">30 Hari Terakhir</SelectItem>
            <SelectItem value="ytd">Tahun Ini</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex-1 min-h-[220px] min-w-0 min-h-0">
        <ChartContainer config={chartConfig} className="h-full w-full">
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
              tickFormatter={(v) => `${(v / 1000000).toFixed(1).replace('.', ',')} jt`}
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
            <Bar
              dataKey="laba"
              fill="var(--color-laba)"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </div>
    </div>
  )
}
