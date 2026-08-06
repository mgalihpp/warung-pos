"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import { Alert02Icon } from "@hugeicons/core-free-icons"
import { formatRupiah } from "@/lib/format-currency"
import type { DashboardStats } from "@/features/dashboard/hooks/use-dashboard-queries"

function buildStats(stats: DashboardStats) {
  return [
    {
      title: "Stok Menipis",
      value: stats.lowStockCount.value,
      formatted: false,
      change: null,
      changeLabel: "Perlu restok segera",
      positive: false,
      icon: Alert02Icon,
      iconBg: "bg-destructive/10",
      iconColor: "text-destructive",
      accent: "#dc2626",
    },
  ]
}

export function StatCards({
  stats,
  className,
}: {
  stats: DashboardStats
  className?: string
}) {
  const items = buildStats(stats)
  return (
    <div
      className={
        className ?? "grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4"
      }
    >
      {items.map((stat) => (
        <div
          key={stat.title}
          className="group relative flex cursor-pointer flex-col overflow-hidden rounded-xl border bg-card shadow-sm transition-shadow hover:shadow-md"
        >
          <div
            className="absolute inset-x-0 top-0 h-1"
            style={{ backgroundColor: stat.accent }}
          />
          <div className="flex items-start justify-between gap-4 p-5">
            <div className="min-w-0">
              <p className="text-xs font-medium text-muted-foreground">
                {stat.title}
              </p>
              <p className="mt-2 text-xl font-bold tracking-tight sm:text-2xl 2xl:text-3xl">
                {stat.formatted
                  ? formatRupiah(stat.value)
                  : stat.value.toLocaleString("id-ID")}
              </p>
            </div>
            <HugeiconsIcon
              icon={stat.icon}
              size={22}
              className={stat.iconColor}
            />
          </div>

          <div className="mt-3 flex items-center gap-1.5 px-4">
            {stat.change ? (
              <span className="text-[10px] font-medium text-muted-foreground sm:text-[11px]">
                {stat.changeLabel}
              </span>
            ) : (
              <span
                className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                  stat.positive === false && !stat.change
                    ? "bg-destructive/10 text-destructive"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {stat.changeLabel}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
