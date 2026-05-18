"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import { Alert02Icon, CheckmarkCircle02Icon, PackageIcon, TagsIcon } from "@hugeicons/core-free-icons"

import type { KategoriStats } from "../types"

type KategoriStatCardsProps = {
  stats: KategoriStats
}

export function KategoriStatCards({ stats }: KategoriStatCardsProps) {
  const cards = [
    {
      title: "Total Kategori",
      value: stats.totalCategories,
      description: "Kategori tersimpan",
      icon: TagsIcon,
      tone: "bg-primary/10 text-primary",
    },
    {
      title: "Terpakai",
      value: stats.usedCategories,
      description: "Memiliki barang",
      icon: CheckmarkCircle02Icon,
      tone: "bg-emerald-500/10 text-emerald-600",
    },
    {
      title: "Kosong",
      value: stats.emptyCategories,
      description: "Belum ada barang",
      icon: Alert02Icon,
      tone: "bg-amber-500/10 text-amber-600",
    },
    {
      title: "Barang Terkait",
      value: stats.totalProducts,
      description: "Total barang berkategori",
      icon: PackageIcon,
      tone: "bg-blue-500/10 text-blue-600",
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
      {cards.map((card) => (
        <div key={card.title} className="rounded-xl border bg-card p-4 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs font-medium text-muted-foreground">{card.title}</p>
              <p className="mt-1 text-2xl font-bold tracking-tight">{card.value}</p>
              <p className="mt-1 truncate text-[11px] text-muted-foreground">{card.description}</p>
            </div>
            <span className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${card.tone}`}>
              <HugeiconsIcon icon={card.icon} size={18} />
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}
