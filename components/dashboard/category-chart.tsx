"use client"

import { Cell, Label, Pie, PieChart } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

const categoryData = [
  { name: "Sembako", value: 45, fill: "#3b82f6" }, // blue-500
  { name: "Minuman", value: 20, fill: "#10b981" }, // emerald-500
  { name: "Mie Instan", value: 15, fill: "#f59e0b" }, // amber-500
  { name: "Bumbu & Dapur", value: 10, fill: "#f43f5e" }, // rose-500
  { name: "Lainnya", value: 10, fill: "#8b5cf6" }, // violet-500
]

const chartConfig = {
  sembako: { label: "Sembako", color: "#3b82f6" },
  minuman: { label: "Minuman", color: "#10b981" },
  mieInstan: { label: "Mie Instan", color: "#f59e0b" },
  bumbuDapur: { label: "Bumbu & Dapur", color: "#f43f5e" },
  lainnya: { label: "Lainnya", color: "#8b5cf6" },
} satisfies ChartConfig

export function CategoryChart() {
  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm">
      <h3 className="mb-4 text-sm font-semibold">Kategori Terlaris</h3>
      <div className="flex flex-col items-center gap-4 sm:flex-row">
        {/* Donut Chart */}
        <ChartContainer config={chartConfig} className="aspect-square h-[200px]">
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
        <div className="flex flex-col gap-2.5">
          {categoryData.map((item) => (
            <div key={item.name} className="flex items-center gap-2">
              <div
                className="size-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: item.fill }}
              />
              <span className="text-xs text-muted-foreground">{item.name}</span>
              <span className="ml-auto text-xs font-semibold">{item.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
