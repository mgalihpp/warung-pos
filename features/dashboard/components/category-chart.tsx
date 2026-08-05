"use client"

import { Cell, Label, Pie, PieChart } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import type { CategoryChartItem } from "@/features/dashboard/hooks/use-dashboard-queries"

const chartConfig = {} satisfies ChartConfig

export function CategoryChart({ data }: { data: CategoryChartItem[] }) {
  const categoryData = data
  if (categoryData.length === 0) {
    return (
      <div className="overflow-hidden rounded-xl border bg-card p-4 shadow-sm">
        <h3 className="mb-4 text-sm font-semibold">Kategori Terlaris</h3>
        <div className="flex h-[200px] items-center justify-center text-xs text-muted-foreground">
          Belum ada data penjualan bulan ini
        </div>
      </div>
    )
  }
  return (
    <div className="overflow-hidden rounded-xl border bg-card p-4 shadow-sm">
      <h3 className="mb-4 text-sm font-semibold">Kategori Terlaris</h3>
      <div className="flex flex-col items-center justify-center gap-6 sm:flex-row xl:flex-col 2xl:flex-row">
        {/* Donut Chart */}
        <ChartContainer
          config={chartConfig}
          className="aspect-square h-[200px]"
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent />} />
            <Pie
              data={categoryData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={85}
              strokeWidth={2}
              stroke="var(--color-background)"
            >
              {categoryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) - 6}
                          className="fill-muted-foreground text-[10px]"
                        >
                          Total
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 10}
                          className="fill-foreground text-[10px] font-medium"
                        >
                          Penjualan
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>

        {/* Legend */}
        <div className="flex w-full flex-col gap-2.5 sm:w-auto xl:w-full 2xl:w-auto">
          {categoryData.map((item) => (
            <div key={item.name} className="flex items-center gap-2">
              <div
                className="size-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: item.fill }}
              />
              <span className="text-xs text-muted-foreground">{item.name}</span>
              <span className="ml-auto text-xs font-semibold">
                {item.value}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
