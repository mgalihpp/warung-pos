"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowRight01Icon,
  Cancel01Icon,
  PackageIcon,
  Search01Icon,
} from "@hugeicons/core-free-icons"

import { formatRupiah } from "@/lib/format-currency"
import { cn } from "@/lib/utils"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { BarangCategory, BarangItem } from "../types"

function getStockBadge(product: BarangItem) {
  if (!product.isActive) {
    return { label: "Nonaktif", className: "bg-slate-500/10 text-slate-600" }
  }

  if (product.stock <= 0) {
    return { label: "Habis", className: "bg-rose-500/10 text-rose-600" }
  }

  if (product.stock <= product.minStock) {
    return {
      label: `Stok: ${product.stock}`,
      className: "bg-amber-500/10 text-amber-700",
    }
  }

  return {
    label: `Stok: ${product.stock}`,
    className: "bg-emerald-500/10 text-emerald-700",
  }
}

export function BarangMobileList({
  products,
  categories,
}: {
  products: BarangItem[]
  categories: BarangCategory[]
}) {
  const [q, setQ] = React.useState("")
  const [activeCategory, setActiveCategory] = React.useState<string | null>(null)
  const [isSearchActive, setIsSearchActive] = React.useState(false)
  const query = q.trim().toLowerCase()

  const filtered = React.useMemo(() => {
    return products.filter((p) => {
      const matchSearch = !query || p.name.toLowerCase().includes(query)
      const matchCategory = !activeCategory || p.categoryId === activeCategory

      return matchSearch && matchCategory
    })
  }, [activeCategory, products, query])

  return (
    <div className="flex h-full min-h-0 flex-col lg:hidden">
      <div className="relative shrink-0 px-3 pt-3">
        <div className="flex h-[46px] items-center overflow-hidden rounded-xl border bg-card shadow-sm">
          {!isSearchActive ? (
            <>
              <button
                type="button"
                onClick={() => setIsSearchActive(true)}
                className="flex h-full w-12 items-center justify-center text-muted-foreground transition-colors hover:bg-muted/50"
                aria-label="Cari barang"
              >
                <HugeiconsIcon icon={Search01Icon} size={18} />
              </button>
              <div className="h-6 w-px bg-border" />
              <div className="relative h-full flex-1">
                <Select
                  value={activeCategory || "all"}
                  onValueChange={(value) => setActiveCategory(value === "all" ? null : value)}
                >
                  <SelectTrigger className="h-full w-full rounded-none border-0 bg-transparent text-[13px] shadow-none focus:ring-0 focus:ring-offset-0 focus-visible:ring-0">
                    <SelectValue placeholder="Semua Kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Kategori</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </>
          ) : (
            <div className="flex h-full flex-1 items-center px-2">
              <HugeiconsIcon icon={Search01Icon} size={16} className="ml-2 shrink-0 text-muted-foreground" />
              <input
                autoFocus
                type="text"
                placeholder="Cari barang..."
                className="h-full min-w-0 flex-1 bg-transparent px-3 text-[13px] leading-none outline-none"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                inputMode="search"
              />
              <button
                type="button"
                onClick={() => {
                  setIsSearchActive(false)
                  setQ("")
                }}
                className="flex h-full w-10 items-center justify-center text-muted-foreground hover:text-foreground"
                aria-label="Tutup pencarian"
              >
                <HugeiconsIcon icon={Cancel01Icon} size={16} />
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 pb-[calc(1.5rem+env(safe-area-inset-bottom))] pt-4">
        {filtered.map((product) => {
          const badge = getStockBadge(product)
          const isOut = product.isActive && product.stock <= 0

          return (
            <Link
              key={product.id}
              href={`/admin/barang/${product.id}`}
              className={cn(
                "block rounded-2xl border bg-card p-3 shadow-sm",
                isOut && "border-rose-500/30"
              )}
            >
              <div className="flex items-center gap-3">
                <div className="relative size-16 shrink-0 overflow-hidden rounded-2xl bg-muted/40">
                  {product.image ? (
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  ) : (
                    <div className="flex size-full items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <HugeiconsIcon icon={PackageIcon} size={28} />
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="line-clamp-2 min-w-0 break-words text-[15px] font-semibold leading-5">
                      {product.name}
                    </p>
                    <p className="shrink-0 whitespace-nowrap text-sm font-bold leading-5 text-primary">
                      {formatRupiah(product.sellPrice)}
                    </p>
                  </div>

                  <div className="mt-2 flex items-center justify-between">
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold",
                        badge.className
                      )}
                    >
                      {badge.label}
                    </span>

                    <span className="inline-flex size-9 items-center justify-center rounded-full bg-muted/60 text-muted-foreground">
                      <HugeiconsIcon icon={ArrowRight01Icon} size={18} />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          )
        })}

        {filtered.length === 0 ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            Barang tidak ditemukan.
          </div>
        ) : null}
      </div>
    </div>
  )
}
