"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import {
  PackageIcon,
  Layers01Icon,
  Alert02Icon,
  Cancel01Icon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons"
import type { ProdukStats } from "../types"

type ProdukStatCardsProps = {
  stats: ProdukStats
}

export function ProdukStatCards({ stats }: ProdukStatCardsProps) {
  const items = [
    {
      title: "Total Produk",
      value: stats.totalProducts,
      description: "Produk aktif terdaftar",
      icon: PackageIcon,
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
    },
    {
      title: "Kategori",
      value: stats.totalCategories,
      description: "Kategori produk",
      icon: Layers01Icon,
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-600",
    },
    {
      title: "Stok Menipis",
      value: stats.lowStock,
      description: "Produk perlu restock",
      icon: Alert02Icon,
      iconBg: "bg-amber-500/10",
      iconColor: "text-amber-600",
    },
    {
      title: "Produk Nonaktif",
      value: stats.inactiveProducts,
      description: "Produk disembunyikan",
      icon: Cancel01Icon,
      iconBg: "bg-slate-500/10",
      iconColor: "text-slate-600",
    },
  ]

  return (
    <>
      {/* Mobile: horizontal scroll compact cards */}
      <div className="scrollbar-none -mx-4 flex gap-3 overflow-x-auto px-4 pb-1 lg:hidden">
        {items.map((stat) => (
          <div
            key={stat.title}
            className="group relative flex min-w-[180px] shrink-0 cursor-pointer items-center gap-3 rounded-xl border bg-card p-3 shadow-sm transition-shadow hover:shadow-md"
          >
            <div
              className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${stat.iconBg}`}
            >
              <HugeiconsIcon
                icon={stat.icon}
                size={18}
                className={stat.iconColor}
              />
            </div>
            <div className="min-w-0">
              <p className="truncate text-[10px] font-medium text-muted-foreground">
                {stat.title}
              </p>
              <p className="text-xl font-bold tracking-tight">{stat.value}</p>
            </div>
            <HugeiconsIcon
              icon={ArrowRight01Icon}
              size={14}
              className="ml-auto shrink-0 text-muted-foreground"
            />
          </div>
        ))}
      </div>

      {/* Desktop: full grid */}
      <div className="hidden lg:grid lg:grid-cols-2 lg:gap-4 2xl:grid-cols-4">
        {items.map((stat) => (
          <div
            key={stat.title}
            className="group relative flex cursor-pointer items-center gap-4 overflow-hidden rounded-xl border bg-card p-4 shadow-sm transition-shadow hover:shadow-md"
          >
            <div
              className={`flex size-12 shrink-0 items-center justify-center rounded-xl ${stat.iconBg}`}
            >
              <HugeiconsIcon
                icon={stat.icon}
                size={22}
                className={stat.iconColor}
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-medium text-muted-foreground sm:text-xs">
                {stat.title}
              </p>
              <p className="text-2xl font-bold tracking-tight">{stat.value}</p>
              <p className="text-[10px] text-muted-foreground sm:text-[11px]">
                {stat.description}
              </p>
            </div>
            <HugeiconsIcon
              icon={ArrowRight01Icon}
              size={16}
              className="shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/[0.02] to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
          </div>
        ))}
      </div>
    </>
  )
}
