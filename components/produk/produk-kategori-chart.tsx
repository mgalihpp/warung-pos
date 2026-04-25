"use client"

import { Cell, Label, Pie, PieChart } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

const categoryData = [
  { name: "Sembako", value: 40, fill: "#16a34a" },
  { name: "Minuman", value: 18, fill: "#3b82f6" },
  { name: "Snack", value: 15, fill: "#f59e0b" },
  { name: "Bumbu", value: 12, fill: "#f43f5e" },
  { name: "Kebutuhan Rumah", value: 10, fill: "#8b5cf6" },
  { name: "Lainnya", value: 5, fill: "#94a3b8" },
]

const chartConfig = {
  sembako: { label: "Sembako", color: "#16a34a" },
  minuman: { label: "Minuman", color: "#3b82f6" },
  snack: { label: "Snack", color: "#f59e0b" },
  bumbu: { label: "Bumbu", color: "#f43f5e" },
  kebutuhanRumah: { label: "Kebutuhan Rumah", color: "#8b5cf6" },
  lainnya: { label: "Lainnya", color: "#94a3b8" },
} satisfies ChartConfig

export function ProdukKategoriChart() {
  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm">
      <h3 className="mb-4 text-sm font-semibold">Kategori Produk</h3>

      <div className="flex flex-col items-center gap-5">
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
                          y={(viewBox.cy || 0) - 10}
                          className="fill-foreground text-2xl font-bold"
                        >
                          248
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 8}
                          className="fill-muted-foreground text-[10px]"
                        >
                          Total
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 20}
                          className="fill-muted-foreground text-[10px]"
                        >
                          Produk
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
        <div className="flex w-full flex-col gap-2.5">
          {categoryData.map((item) => (
            <div key={item.name} className="flex items-center gap-2">
              <div
                className="size-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: item.fill }}
              />
              <span className="flex-1 text-xs text-muted-foreground">
                {item.name}
              </span>
              <span className="text-xs font-semibold">{item.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
