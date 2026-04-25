"use client"

import { Cell, Label, Pie, PieChart } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import type { ProdukCategoryChartItem } from "./types"

type ProdukKategoriChartProps = {
  data: ProdukCategoryChartItem[]
  total: number
}

const chartConfig = {} satisfies ChartConfig

export function ProdukKategoriChart({ data, total }: ProdukKategoriChartProps) {
  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm">
      <h3 className="mb-4 text-sm font-semibold">Kategori Produk</h3>

      <div className="flex flex-col items-center gap-5">
        {data.length === 0 ? (
          <div className="flex h-[200px] items-center justify-center text-center text-xs text-muted-foreground">
            Belum ada produk aktif untuk ditampilkan.
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="aspect-square h-[200px]">
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent />} />
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                strokeWidth={data.length > 1 ? 2 : 0}
                stroke="var(--color-background)"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                          <tspan x={viewBox.cx} y={(viewBox.cy || 0) - 10} className="fill-foreground text-2xl font-bold">
                            {total}
                          </tspan>
                          <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 8} className="fill-muted-foreground text-[10px]">
                            Total
                          </tspan>
                          <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 20} className="fill-muted-foreground text-[10px]">
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
        )}

        {/* Legend */}
        <div className="flex w-full flex-col gap-2.5">
          {data.map((item) => (
            <div key={item.name} className="flex items-center gap-2">
              <div
                className="size-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: item.fill }}
              />
              <span className="flex-1 text-xs text-muted-foreground">
                {item.name}
              </span>
              <span className="text-xs font-semibold">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
