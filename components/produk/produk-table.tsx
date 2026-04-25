"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  SearchIcon,
  Edit02Icon,
  ViewIcon,
  MoreVerticalCircle01Icon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
  FilterIcon,
} from "@hugeicons/core-free-icons"
import { formatRupiah } from "@/lib/format"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerFooter,
} from "@/components/ui/drawer"

const categories = [
  "Semua",
  "Sembako",
  "Minuman",
  "Snack",
  "Bumbu",
  "Kebutuhan Rumah",
]

const statusOptions = ["Semua Status", "Aktif", "Stok Menipis", "Nonaktif"]
const sortOptions = [
  "Nama A–Z",
  "Nama Z–A",
  "Harga Tertinggi",
  "Harga Terendah",
  "Stok Terbanyak",
  "Stok Tersedikit",
]

type Product = {
  id: number
  name: string
  category: string
  stock: number
  price: number
  status: "Aktif" | "Stok Menipis"
  emoji: string
}

const products: Product[] = [
  {
    id: 1,
    name: "Beras Premium 5kg",
    category: "Sembako",
    stock: 24,
    price: 75000,
    status: "Aktif",
    emoji: "🌾",
  },
  {
    id: 2,
    name: "Gula Pasir 1kg",
    category: "Sembako",
    stock: 36,
    price: 16000,
    status: "Aktif",
    emoji: "🧂",
  },
  {
    id: 3,
    name: "Minyak Goreng 1L",
    category: "Sembako",
    stock: 28,
    price: 18000,
    status: "Aktif",
    emoji: "🫗",
  },
  {
    id: 4,
    name: "Mie Instan Goreng",
    category: "Makanan",
    stock: 120,
    price: 3500,
    status: "Aktif",
    emoji: "🍜",
  },
  {
    id: 5,
    name: "Tepung Terigu 1kg",
    category: "Sembako",
    stock: 30,
    price: 14000,
    status: "Aktif",
    emoji: "🌾",
  },
  {
    id: 6,
    name: "Kecap Manis 600ml",
    category: "Bumbu",
    stock: 22,
    price: 12000,
    status: "Aktif",
    emoji: "🫙",
  },
  {
    id: 7,
    name: "Air Mineral 600ml",
    category: "Minuman",
    stock: 100,
    price: 4000,
    status: "Aktif",
    emoji: "💧",
  },
  {
    id: 8,
    name: "Deterjen 800g",
    category: "Kebutuhan Rumah",
    stock: 8,
    price: 18000,
    status: "Stok Menipis",
    emoji: "🧹",
  },
]

export function ProdukTable() {
  const [activeCategory, setActiveCategory] = React.useState("Semua")
  const [activeStatus, setActiveStatus] = React.useState("Semua Status")
  const [activeSort, setActiveSort] = React.useState("Nama A–Z")
  const [searchQuery, setSearchQuery] = React.useState("")
  const [currentPage, setCurrentPage] = React.useState(1)
  const [isFilterOpen, setIsFilterOpen] = React.useState(false)

  // Temp state for drawer
  const [tempCategory, setTempCategory] = React.useState("Semua")
  const [tempStatus, setTempStatus] = React.useState("Semua Status")
  const [tempSort, setTempSort] = React.useState("Nama A–Z")

  const filteredProducts = products.filter((p) => {
    const matchCategory =
      activeCategory === "Semua" || p.category === activeCategory
    const matchSearch = p.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
    const matchStatus =
      activeStatus === "Semua Status" || p.status === activeStatus
    return matchCategory && matchSearch && matchStatus
  })

  const handleApplyFilter = () => {
    setActiveCategory(tempCategory)
    setActiveStatus(tempStatus)
    setActiveSort(tempSort)
    setIsFilterOpen(false)
  }

  const handleResetFilter = () => {
    setTempCategory("Semua")
    setTempStatus("Semua Status")
    setTempSort("Nama A–Z")
    setActiveCategory("Semua")
    setActiveStatus("Semua Status")
    setActiveSort("Nama A–Z")
    setIsFilterOpen(false)
  }

  // Count active filters for badge
  const activeFilterCount =
    (activeCategory !== "Semua" ? 1 : 0) +
    (activeStatus !== "Semua Status" ? 1 : 0) +
    (activeSort !== "Nama A–Z" ? 1 : 0)

  // Collect active filter labels for chips
  const activeFilterLabels: { label: string; reset: () => void }[] = []
  if (activeCategory !== "Semua")
    activeFilterLabels.push({ label: activeCategory, reset: () => setActiveCategory("Semua") })
  if (activeStatus !== "Semua Status")
    activeFilterLabels.push({ label: activeStatus, reset: () => setActiveStatus("Semua Status") })
  if (activeSort !== "Nama A–Z")
    activeFilterLabels.push({ label: activeSort, reset: () => setActiveSort("Nama A–Z") })

  const hasActiveFilters = activeFilterCount > 0

  return (
    <div className="flex flex-col gap-3 lg:gap-4">

      {/* Table Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Daftar Produk</h3>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
        {/* Search */}
        <div className="relative flex-1">
          <HugeiconsIcon
            icon={SearchIcon}
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="text"
            placeholder="Cari nama produk..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9 w-full rounded-lg border bg-background pl-9 pr-3 text-sm outline-none ring-ring transition-colors placeholder:text-muted-foreground focus:ring-1"
          />
        </div>

        {/* Mobile/Tablet: Filter Button that opens Drawer */}
        <Drawer open={isFilterOpen} onOpenChange={(open) => {
          setIsFilterOpen(open)
          if (open) {
            setTempCategory(activeCategory)
            setTempStatus(activeStatus)
            setTempSort(activeSort)
          }
        }}>
          <DrawerTrigger asChild>
            <button className={`relative inline-flex h-9 items-center gap-2 rounded-lg px-3 text-sm font-medium transition-all lg:hidden ${hasActiveFilters
              ? "bg-primary text-primary-foreground shadow-sm"
              : "border bg-background text-foreground hover:bg-muted"
              }`}>
              <HugeiconsIcon icon={FilterIcon} size={16} />
              Filter & Urutkan
              {hasActiveFilters && (
                <span className="flex size-5 items-center justify-center rounded-full bg-primary-foreground text-[10px] font-bold text-primary">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Filter & Urutkan</DrawerTitle>
            </DrawerHeader>
            <div className="flex flex-col gap-5 px-4 pb-2">
              {/* Kategori */}
              <div className="flex flex-col gap-2">
                <span className="text-xs font-semibold text-foreground">Kategori</span>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setTempCategory(cat)}
                      className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${tempCategory === cat
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "border bg-background text-muted-foreground"
                        }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Status */}
              <div className="flex flex-col gap-2">
                <span className="text-xs font-semibold text-foreground">Status</span>
                <div className="flex flex-wrap gap-2">
                  {statusOptions.map((s) => (
                    <button
                      key={s}
                      onClick={() => setTempStatus(s)}
                      className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${tempStatus === s
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "border bg-background text-muted-foreground"
                        }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Urutkan */}
              <div className="flex flex-col gap-2">
                <span className="text-xs font-semibold text-foreground">Urutkan</span>
                <div className="flex flex-wrap gap-2">
                  {sortOptions.map((s) => (
                    <button
                      key={s}
                      onClick={() => setTempSort(s)}
                      className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${tempSort === s
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "border bg-background text-muted-foreground"
                        }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <DrawerFooter>
              <div className="flex gap-2">
                <button
                  onClick={handleResetFilter}
                  className="flex-1 rounded-lg border bg-background py-2.5 text-sm font-medium transition-colors hover:bg-muted"
                >
                  Reset
                </button>
                <button
                  onClick={handleApplyFilter}
                  className="flex-1 rounded-lg bg-primary py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  Terapkan
                </button>
              </div>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>

        {/* Desktop: Filter Dropdowns */}
        <div className="hidden lg:flex flex-wrap items-center gap-2">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-medium text-muted-foreground">
              Kategori
            </span>
            <select className="h-9 rounded-lg border bg-background px-3 text-sm outline-none ring-ring focus:ring-1">
              <option>Semua Kategori</option>
              <option>Sembako</option>
              <option>Minuman</option>
              <option>Snack</option>
              <option>Bumbu</option>
              <option>Kebutuhan Rumah</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-medium text-muted-foreground">
              Status
            </span>
            <select className="h-9 rounded-lg border bg-background px-3 text-sm outline-none ring-ring focus:ring-1">
              <option>Semua Status</option>
              <option>Aktif</option>
              <option>Stok Menipis</option>
              <option>Nonaktif</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-medium text-muted-foreground">
              Urutkan
            </span>
            <select className="h-9 rounded-lg border bg-background px-3 text-sm outline-none ring-ring focus:ring-1">
              <option>Nama A–Z</option>
              <option>Nama Z–A</option>
              <option>Harga Tertinggi</option>
              <option>Harga Terendah</option>
              <option>Stok Terbanyak</option>
              <option>Stok Tersedikit</option>
            </select>
          </div>
        </div>
      </div>

      {/* Category Chips - desktop only */}
      <div className="hidden lg:flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${activeCategory === cat
              ? "bg-primary text-primary-foreground shadow-sm"
              : "border bg-background text-muted-foreground hover:bg-muted"
              }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Active filter chips on mobile/tablet */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 lg:hidden">
          <span className="text-xs text-muted-foreground">Filter:</span>
          {activeFilterLabels.map((f) => (
            <span
              key={f.label}
              className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary"
            >
              {f.label}
              <button
                onClick={f.reset}
                className="ml-0.5 flex size-4 items-center justify-center rounded-full text-[10px] hover:bg-primary/20"
              >
                ✕
              </button>
            </span>
          ))}
          <button
            onClick={() => {
              setActiveCategory("Semua")
              setActiveStatus("Semua Status")
              setActiveSort("Nama A–Z")
            }}
            className="text-xs font-medium text-muted-foreground hover:text-foreground"
          >
            Hapus semua
          </button>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border bg-card shadow-sm">
        <table className="w-full min-w-[700px] text-left">
          <thead>
            <tr className="border-b bg-muted/30">
              <th className="px-4 py-3 text-xs font-medium text-muted-foreground">
                Produk
              </th>
              <th className="px-4 py-3 text-xs font-medium text-muted-foreground">
                Kategori
              </th>
              <th className="px-4 py-3 text-xs font-medium text-muted-foreground">
                Stok
              </th>
              <th className="px-4 py-3 text-xs font-medium text-muted-foreground">
                Harga
              </th>
              <th className="px-4 py-3 text-xs font-medium text-muted-foreground">
                Status
              </th>
              <th className="px-4 py-3 text-xs font-medium text-muted-foreground">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr
                key={product.id}
                className="border-b last:border-0 transition-colors hover:bg-muted/20"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-lg bg-primary/5 text-base">
                      {product.emoji}
                    </div>
                    <span className="text-sm font-medium">{product.name}</span>
                  </div>
                </td>

                <td className="px-4 py-3 text-sm text-muted-foreground">
                  {product.category}
                </td>
                <td className="px-4 py-3 text-sm font-medium">
                  {product.stock}
                </td>
                <td className="px-4 py-3 text-sm">
                  {formatRupiah(product.price)}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${product.status === "Aktif"
                      ? "bg-primary/10 text-primary"
                      : "bg-amber-500/10 text-amber-600"
                      }`}
                  >
                    {product.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <button className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                      <HugeiconsIcon icon={Edit02Icon} size={15} />
                    </button>
                    <button className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                      <HugeiconsIcon icon={ViewIcon} size={15} />
                    </button>
                    <button className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                      <HugeiconsIcon
                        icon={MoreVerticalCircle01Icon}
                        size={15}
                      />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col items-center justify-between gap-3 lg:flex-row">
        <p className="text-xs text-muted-foreground">
          Menampilkan 1–{filteredProducts.length} dari 248 produk
        </p>
        <div className="flex items-center gap-1">
          <button className="flex size-8 items-center justify-center rounded-lg border text-muted-foreground transition-colors hover:bg-muted">
            <HugeiconsIcon icon={ArrowLeft01Icon} size={14} />
          </button>
          {[1, 2, 3].map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`flex size-8 items-center justify-center rounded-lg text-xs font-medium transition-colors ${currentPage === page
                ? "bg-primary text-primary-foreground"
                : "border text-muted-foreground hover:bg-muted"
                }`}
            >
              {page}
            </button>
          ))}
          <span className="px-1 text-xs text-muted-foreground">...</span>
          <button
            onClick={() => setCurrentPage(31)}
            className={`flex size-8 items-center justify-center rounded-lg text-xs font-medium transition-colors ${currentPage === 31
              ? "bg-primary text-primary-foreground"
              : "border text-muted-foreground hover:bg-muted"
              }`}
          >
            31
          </button>
          <button className="flex size-8 items-center justify-center rounded-lg border text-muted-foreground transition-colors hover:bg-muted">
            <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}
