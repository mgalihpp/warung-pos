"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowDown01Icon,
  ArrowRight01Icon,
  Cancel01Icon,
  FilterIcon,
  PackageIcon,
  Search01Icon,
  Tick02Icon,
} from "@hugeicons/core-free-icons"

import { useSearchParam } from "@/hooks/use-search-param"
import { formatRupiah } from "@/lib/format-currency"
import { cn } from "@/lib/utils"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import type { BarangCategory, BarangItem } from "../types"

const statusOptions = ["Semua Status", "Aktif", "Stok Menipis", "Stok Habis", "Nonaktif"] as const
const sortOptions = ["Terbaru", "Nama A-Z", "Harga Tertinggi", "Harga Terendah", "Stok Terbanyak", "Stok Tersedikit"] as const

type StatusOption = (typeof statusOptions)[number]
type SortOption = (typeof sortOptions)[number]

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

function getProductStatus(product: BarangItem): StatusOption {
  if (!product.isActive) return "Nonaktif"
  if (product.stock <= 0) return "Stok Habis"
  if (product.stock <= product.minStock) return "Stok Menipis"
  return "Aktif"
}

export function BarangMobileList({
  products,
  categories,
}: {
  products: BarangItem[]
  categories: BarangCategory[]
}) {
  const [q, setQ] = useSearchParam("search", "")
  const [activeCategoryId, setActiveCategoryId] = useSearchParam("category", "")
  const [activeStatus, setActiveStatus] = useSearchParam("status", "Semua Status")
  const [activeSort, setActiveSort] = useSearchParam("sort", "Terbaru")
  const [isSearchActive, setIsSearchActive] = React.useState(false)
  const [isCategoryOpen, setIsCategoryOpen] = React.useState(false)
  const [categorySnap, setCategorySnap] = React.useState<number | string | null>(0.5)
  const [isFilterOpen, setIsFilterOpen] = React.useState(false)
  const query = q.trim().toLowerCase()
  const activeCategory = activeCategoryId || null
  const hasActiveFilters = activeStatus !== "Semua Status" || activeSort !== "Terbaru"
  const activeCategoryName = activeCategory
    ? categories.find((category) => category.id === activeCategory)?.name ?? "Semua Kategori"
    : "Semua Kategori"

  const filtered = React.useMemo(() => {
    const list = products.filter((p) => {
      const matchSearch = !query || p.name.toLowerCase().includes(query)
      const matchCategory = !activeCategory || p.categoryId === activeCategory
      const matchStatus = activeStatus === "Semua Status" || getProductStatus(p) === activeStatus

      return matchSearch && matchCategory && matchStatus
    })

    return list.sort((a, b) => {
      if (activeSort === "Nama A-Z") return a.name.localeCompare(b.name)
      if (activeSort === "Harga Tertinggi") return b.sellPrice - a.sellPrice
      if (activeSort === "Harga Terendah") return a.sellPrice - b.sellPrice
      if (activeSort === "Stok Terbanyak") return b.stock - a.stock
      if (activeSort === "Stok Tersedikit") return a.stock - b.stock
      return 0
    })
  }, [activeCategory, activeSort, activeStatus, products, query])

  return (
    <div className="flex h-full min-h-0 flex-col lg:hidden">
      <div className="relative shrink-0 px-4 pt-3">
        <div className="flex h-11 items-center overflow-hidden rounded-xl border bg-card shadow-sm">
          {!isSearchActive ? (
            <>
              <button
                type="button"
                onClick={() => setIsSearchActive(true)}
                className="flex h-full w-11 shrink-0 items-center justify-center text-muted-foreground transition-colors hover:bg-muted/50"
                aria-label="Cari barang"
              >
                <HugeiconsIcon icon={Search01Icon} size={18} />
              </button>
              <div className="h-6 w-px bg-border" />
              <div className="relative h-full flex-1">
                <button
                  type="button"
                  onClick={() => setIsCategoryOpen(true)}
                  className="flex h-full w-full items-center justify-between gap-2 bg-transparent px-3 text-left text-[13px] outline-none transition-colors hover:bg-muted/50 focus:ring-0"
                >
                  <span className="truncate">{activeCategoryName}</span>
                  <HugeiconsIcon icon={ArrowDown01Icon} size={14} className="shrink-0 text-muted-foreground" />
                </button>
              </div>
              <div className="h-6 w-px bg-border" />
              <button
                type="button"
                onClick={() => setIsFilterOpen(true)}
                className={cn(
                  "relative flex h-full w-11 shrink-0 items-center justify-center transition-colors hover:bg-muted/50",
                  hasActiveFilters ? "text-primary" : "text-muted-foreground"
                )}
                aria-label="Filter barang"
              >
                <HugeiconsIcon icon={FilterIcon} size={18} />
              </button>
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

      <Drawer
        open={isCategoryOpen}
        onOpenChange={(open) => {
          setIsCategoryOpen(open)
          if (open) setCategorySnap(0.5)
        }}
        snapPoints={[0.5, 1]}
        activeSnapPoint={categorySnap}
        setActiveSnapPoint={setCategorySnap}
      >
        <DrawerContent className="h-[100dvh] max-h-[100dvh] overflow-hidden p-3 pb-4 !mt-0 !max-h-[100dvh] lg:hidden">
          <DrawerHeader className="px-4 pt-4 pb-3 text-left">
            <DrawerTitle className="text-base font-bold">Pilih Kategori</DrawerTitle>
            <DrawerDescription className="text-xs">
              Tampilkan barang berdasarkan kategori.
            </DrawerDescription>
          </DrawerHeader>
          <div className="scrollbar-thin min-h-0 flex-1 overflow-y-auto px-4 pb-2">
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => {
                  setActiveCategoryId("")
                  setIsCategoryOpen(false)
                }}
                className={cn(
                  "flex items-center justify-between rounded-2xl border px-4 py-3 text-left transition-colors",
                  !activeCategory
                    ? "border-primary/30 bg-primary/10 text-primary"
                    : "border-border bg-card text-foreground hover:bg-muted/50"
                )}
              >
                <span className="text-sm font-semibold">Semua Kategori</span>
                {!activeCategory && <HugeiconsIcon icon={Tick02Icon} size={18} />}
              </button>

              {categories.map((category) => {
                const isActive = activeCategory === category.id

                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => {
                      setActiveCategoryId(category.id)
                      setIsCategoryOpen(false)
                    }}
                    className={cn(
                      "flex items-center justify-between rounded-2xl border px-4 py-3 text-left transition-colors",
                      isActive
                        ? "border-primary/30 bg-primary/10 text-primary"
                        : "border-border bg-card text-foreground hover:bg-muted/50"
                    )}
                  >
                    <span className="truncate text-sm font-semibold">{category.name}</span>
                    {isActive && <HugeiconsIcon icon={Tick02Icon} size={18} />}
                  </button>
                )
              })}
            </div>
          </div>
        </DrawerContent>
      </Drawer>

      <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <SheetContent side="bottom" className="max-h-[80vh] rounded-t-3xl border-t p-0" showCloseButton={false}>
          <SheetHeader className="px-4 py-4 text-left">
            <div className="mx-auto mb-2 h-1 w-10 rounded-full bg-muted-foreground/25" />
            <SheetTitle>Filter & Urutkan</SheetTitle>
          </SheetHeader>

          <div className="grid max-h-[56vh] gap-5 overflow-y-auto px-4 pb-2">
            <div className="grid gap-2">
              <p className="px-1 text-xs font-semibold text-muted-foreground">Status</p>
              <div className="grid grid-cols-2 gap-2">
                {statusOptions.map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setActiveStatus(status)}
                    className={cn(
                      "h-10 rounded-xl px-3 text-sm font-medium transition-colors",
                      activeStatus === status ? "bg-primary text-primary-foreground" : "bg-muted/60 text-foreground"
                    )}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-2">
              <p className="px-1 text-xs font-semibold text-muted-foreground">Urutkan</p>
              <div className="grid grid-cols-2 gap-2">
                {sortOptions.map((sort) => (
                  <button
                    key={sort}
                    type="button"
                    onClick={() => setActiveSort(sort)}
                    className={cn(
                      "h-10 rounded-xl px-3 text-sm font-medium transition-colors",
                      activeSort === sort ? "bg-primary text-primary-foreground" : "bg-muted/60 text-foreground"
                    )}
                  >
                    {sort}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <SheetFooter className="grid grid-cols-2 gap-2 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setActiveStatus("Semua Status")
                setActiveSort("Terbaru")
              }}
            >
              Reset
            </Button>
            <SheetClose asChild>
              <Button>Selesai</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>

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
