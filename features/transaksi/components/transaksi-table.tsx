"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  SearchIcon,
  ViewIcon,
  MoreVerticalCircle01Icon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
  FilterIcon,
} from "@hugeicons/core-free-icons"
import { formatRupiah } from "@/lib/format-currency"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerFooter,
} from "@/components/ui/drawer"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { TransactionItem, TransactionStatus, PaymentMethod } from "../hooks/use-transaksi-queries"

// ── Filter options ──
const statusDropdownOptions = ["Semua Status", "Selesai", "Pending", "Dibatalkan"]
const metodeDropdownOptions = ["Semua Metode", "Tunai", "QRIS", "Transfer"]
const sortOptions = ["Terbaru", "Terlama", "Nilai Tertinggi", "Nilai Terendah"]

const ITEMS_PER_PAGE = 10

// ── Status badge styles ──
function getStatusBadgeClass(status: TransactionStatus) {
  switch (status) {
    case "Selesai":
      return "bg-primary/10 text-primary"
    case "Pending":
      return "bg-amber-500/10 text-amber-600"
    case "Dibatalkan":
      return "bg-red-500/10 text-red-600"
    default:
      return "bg-muted text-muted-foreground"
  }
}

// ── Payment method badge styles ──
function getMetodeBadgeClass(metode: PaymentMethod) {
  switch (metode) {
    case "Tunai":
      return "bg-emerald-500/10 text-emerald-600"
    case "QRIS":
      return "bg-blue-500/10 text-blue-600"
    case "Transfer":
      return "bg-violet-500/10 text-violet-600"
    default:
      return "bg-muted text-muted-foreground"
  }
}

function sortTransactions(list: TransactionItem[], sort: string): TransactionItem[] {
  const sorted = [...list]
  switch (sort) {
    case "Terlama":
      return sorted.reverse()
    case "Nilai Tertinggi":
      return sorted.sort((a, b) => b.total - a.total)
    case "Nilai Terendah":
      return sorted.sort((a, b) => a.total - b.total)
    default: // "Terbaru" — already sorted desc from API
      return sorted
  }
}

type Props = {
  transactions: TransactionItem[]
  cashierList: string[]
}

export function TransaksiTable({ transactions, cashierList }: Props) {
  const [activeStatusFilter, setActiveStatusFilter] = React.useState("Semua")
  const [activeMetodeFilter, setActiveMetodeFilter] = React.useState<string | null>(null)
  const [activeKasirFilter, setActiveKasirFilter] = React.useState<string | null>(null)
  const [activeSort, setActiveSort] = React.useState("Terbaru")
  const [searchQuery, setSearchQuery] = React.useState("")
  const [currentPage, setCurrentPage] = React.useState(1)
  const [isFilterOpen, setIsFilterOpen] = React.useState(false)

  // Drawer temp state
  const [tempStatus, setTempStatus] = React.useState("Semua Status")
  const [tempMetode, setTempMetode] = React.useState("Semua Metode")
  const [tempKasir, setTempKasir] = React.useState("Semua Kasir")
  const [tempSort, setTempSort] = React.useState("Terbaru")

  const kasirDropdownOptions = ["Semua Kasir", ...cashierList]

  // Derive desktop dropdown display values from active filter state
  const desktopStatus = activeStatusFilter === "Semua" ? "Semua Status" : activeStatusFilter
  const desktopMetode = activeMetodeFilter ?? "Semua Metode"
  const desktopKasir = activeKasirFilter ?? "Semua Kasir"

  // Desktop dropdown handlers — directly set active filters + reset page
  const handleDesktopStatusChange = (value: string) => {
    setActiveStatusFilter(value === "Semua Status" ? "Semua" : value)
    setCurrentPage(1)
  }
  const handleDesktopMetodeChange = (value: string) => {
    setActiveMetodeFilter(value === "Semua Metode" ? null : value)
    setCurrentPage(1)
  }
  const handleDesktopKasirChange = (value: string) => {
    setActiveKasirFilter(value === "Semua Kasir" ? null : value)
    setCurrentPage(1)
  }
  const handleDesktopSortChange = (value: string) => {
    setActiveSort(value)
    setCurrentPage(1)
  }
  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    setCurrentPage(1)
  }

  const filteredTransactions = React.useMemo(() => {
    let result = transactions.filter((t) => {
      const matchStatus =
        activeStatusFilter === "Semua" || t.status === activeStatusFilter
      const matchMetode =
        !activeMetodeFilter || t.metode === activeMetodeFilter
      const matchKasir =
        !activeKasirFilter || t.kasir === activeKasirFilter
      const query = searchQuery.toLowerCase()
      const matchSearch =
        !query ||
        t.transactionNumber.toLowerCase().includes(query) ||
        t.kasir.toLowerCase().includes(query) ||
        t.item.toLowerCase().includes(query)
      return matchStatus && matchMetode && matchKasir && matchSearch
    })

    result = sortTransactions(result, activeSort)
    return result
  }, [transactions, activeStatusFilter, activeMetodeFilter, activeKasirFilter, searchQuery, activeSort])

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE))
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  )

  const handleApplyFilter = () => {
    if (tempStatus !== "Semua Status") {
      setActiveStatusFilter(tempStatus)
    } else {
      setActiveStatusFilter("Semua")
    }
    if (tempMetode !== "Semua Metode") {
      setActiveMetodeFilter(tempMetode)
    } else {
      setActiveMetodeFilter(null)
    }
    if (tempKasir !== "Semua Kasir") {
      setActiveKasirFilter(tempKasir)
    } else {
      setActiveKasirFilter(null)
    }
    setActiveSort(tempSort)
    setCurrentPage(1)
    setIsFilterOpen(false)
  }

  const handleResetFilter = () => {
    setTempStatus("Semua Status")
    setTempMetode("Semua Metode")
    setTempKasir("Semua Kasir")
    setTempSort("Terbaru")
    setActiveStatusFilter("Semua")
    setActiveMetodeFilter(null)
    setActiveKasirFilter(null)
    setActiveSort("Terbaru")
    setCurrentPage(1)
    setIsFilterOpen(false)
  }

  // Count active filters for badge
  const activeFilterCount =
    (activeStatusFilter !== "Semua" ? 1 : 0) +
    (activeMetodeFilter ? 1 : 0) +
    (activeKasirFilter ? 1 : 0)

  // Collect active filter labels for chips
  const activeFilterLabels: { label: string; reset: () => void }[] = []
  if (activeStatusFilter !== "Semua")
    activeFilterLabels.push({ label: activeStatusFilter, reset: () => setActiveStatusFilter("Semua") })
  if (activeMetodeFilter)
    activeFilterLabels.push({ label: activeMetodeFilter, reset: () => setActiveMetodeFilter(null) })
  if (activeKasirFilter)
    activeFilterLabels.push({ label: `Kasir: ${activeKasirFilter}`, reset: () => setActiveKasirFilter(null) })

  const hasActiveFilters = activeFilterCount > 0

  // Build pagination buttons
  const paginationButtons = React.useMemo(() => {
    const pages: (number | "...")[] = []
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      pages.push(1)
      if (currentPage > 3) pages.push("...")
      const start = Math.max(2, currentPage - 1)
      const end = Math.min(totalPages - 1, currentPage + 1)
      for (let i = start; i <= end; i++) pages.push(i)
      if (currentPage < totalPages - 2) pages.push("...")
      pages.push(totalPages)
    }
    return pages
  }, [totalPages, currentPage])

  return (
    <div className="flex flex-col gap-3 lg:gap-4">
      {/* Section title */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Daftar Transaksi</h3>
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
            placeholder="Cari no. transaksi, kasir, atau item..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="h-9 w-full rounded-lg border bg-background pl-9 pr-3 text-sm outline-none ring-ring transition-colors placeholder:text-muted-foreground focus:ring-1"
          />
        </div>

        {/* Mobile: Filter Button */}
        <Drawer open={isFilterOpen} onOpenChange={(open) => {
          setIsFilterOpen(open)
          if (open) {
            setTempStatus(activeStatusFilter === "Semua" ? "Semua Status" : activeStatusFilter)
            setTempMetode(activeMetodeFilter || "Semua Metode")
            setTempKasir(activeKasirFilter || "Semua Kasir")
            setTempSort(activeSort)
          }
        }}>
          <DrawerTrigger asChild>
            <button className={`relative inline-flex h-9 items-center gap-2 rounded-lg px-3 text-sm font-medium transition-all lg:hidden ${
              hasActiveFilters
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
              {/* Status */}
              <div className="flex flex-col gap-2">
                <span className="text-xs font-semibold text-foreground">Status</span>
                <div className="flex flex-wrap gap-2">
                  {statusDropdownOptions.map((s) => (
                    <button
                      key={s}
                      onClick={() => setTempStatus(s)}
                      className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
                        tempStatus === s
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "border bg-background text-muted-foreground"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Metode Bayar */}
              <div className="flex flex-col gap-2">
                <span className="text-xs font-semibold text-foreground">Metode Bayar</span>
                <div className="flex flex-wrap gap-2">
                  {metodeDropdownOptions.map((m) => (
                    <button
                      key={m}
                      onClick={() => setTempMetode(m)}
                      className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
                        tempMetode === m
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "border bg-background text-muted-foreground"
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {/* Kasir */}
              <div className="flex flex-col gap-2">
                <span className="text-xs font-semibold text-foreground">Kasir</span>
                <div className="flex flex-wrap gap-2">
                  {kasirDropdownOptions.map((k) => (
                    <button
                      key={k}
                      onClick={() => setTempKasir(k)}
                      className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
                        tempKasir === k
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "border bg-background text-muted-foreground"
                      }`}
                    >
                      {k}
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
                      className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
                        tempSort === s
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
            <span className="text-[10px] font-medium text-muted-foreground">Status</span>
            <Select value={desktopStatus} onValueChange={handleDesktopStatusChange}>
              <SelectTrigger className="w-full lg:w-[160px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {statusDropdownOptions.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-medium text-muted-foreground">Metode Bayar</span>
            <Select value={desktopMetode} onValueChange={handleDesktopMetodeChange}>
              <SelectTrigger className="w-full lg:w-[180px]">
                <SelectValue placeholder="Metode" />
              </SelectTrigger>
              <SelectContent>
                {metodeDropdownOptions.map((m) => (
                  <SelectItem key={m} value={m}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-medium text-muted-foreground">Kasir</span>
            <Select value={desktopKasir} onValueChange={handleDesktopKasirChange}>
              <SelectTrigger className="w-full lg:w-[180px]">
                <SelectValue placeholder="Kasir" />
              </SelectTrigger>
              <SelectContent>
                {kasirDropdownOptions.map((k) => (
                  <SelectItem key={k} value={k}>
                    {k}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-medium text-muted-foreground">Urutkan</span>
            <Select value={activeSort} onValueChange={handleDesktopSortChange}>
              <SelectTrigger className="w-full lg:w-[180px]">
                <SelectValue placeholder="Urutkan" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
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
              setActiveStatusFilter("Semua")
              setActiveMetodeFilter(null)
              setActiveKasirFilter(null)
            }}
            className="text-xs font-medium text-muted-foreground hover:text-foreground"
          >
            Hapus semua
          </button>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border bg-card shadow-sm">
        <table className="w-full min-w-[900px] text-left">
          <thead>
            <tr className="border-b bg-muted/30">
              <th className="px-4 py-3 text-xs font-medium text-muted-foreground">No. Transaksi</th>
              <th className="px-4 py-3 text-xs font-medium text-muted-foreground">Waktu</th>
              <th className="px-4 py-3 text-xs font-medium text-muted-foreground">Kasir</th>
              <th className="px-4 py-3 text-xs font-medium text-muted-foreground">Item</th>
              <th className="px-4 py-3 text-xs font-medium text-muted-foreground">Metode</th>
              <th className="px-4 py-3 text-xs font-medium text-muted-foreground">Total</th>
              <th className="px-4 py-3 text-xs font-medium text-muted-foreground">Status</th>
              <th className="px-4 py-3 text-xs font-medium text-muted-foreground">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {paginatedTransactions.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center text-sm text-muted-foreground">
                  {searchQuery || hasActiveFilters
                    ? "Tidak ada transaksi yang cocok dengan filter."
                    : "Belum ada data transaksi."}
                </td>
              </tr>
            ) : (
              paginatedTransactions.map((trx) => (
                <tr
                  key={trx.id}
                  className="border-b last:border-0 transition-colors hover:bg-muted/20"
                >
                  <td className="px-4 py-3">
                    <span className="text-sm font-medium">{trx.transactionNumber}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground whitespace-nowrap">
                    {trx.waktu}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-blue-500/10 text-[11px] font-bold text-blue-600">
                        {trx.kasir.charAt(0)}
                      </div>
                      <span className="text-sm">{trx.kasir}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-muted-foreground max-w-[200px] truncate block">
                      {trx.item}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${getMetodeBadgeClass(trx.metode)}`}
                    >
                      {trx.metode}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm font-semibold">{formatRupiah(trx.total)}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${getStatusBadgeClass(trx.status)}`}
                    >
                      {trx.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground" title="Lihat Detail">
                        <HugeiconsIcon icon={ViewIcon} size={15} />
                      </button>
                      <button className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground" title="Lainnya">
                        <HugeiconsIcon icon={MoreVerticalCircle01Icon} size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col items-center justify-between gap-3 lg:flex-row">
        <p className="text-xs text-muted-foreground">
          Menampilkan {filteredTransactions.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filteredTransactions.length)} dari {filteredTransactions.length} transaksi
        </p>
        <div className="flex items-center gap-1">
          <button
            disabled={currentPage <= 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="flex size-8 items-center justify-center rounded-lg border text-muted-foreground transition-colors hover:bg-muted disabled:opacity-40 disabled:pointer-events-none"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} size={14} />
          </button>
          {paginationButtons.map((page, idx) =>
            page === "..." ? (
              <span key={`ellipsis-${idx}`} className="px-1 text-xs text-muted-foreground">...</span>
            ) : (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`flex size-8 items-center justify-center rounded-lg text-xs font-medium transition-colors ${
                  currentPage === page
                    ? "bg-primary text-primary-foreground"
                    : "border text-muted-foreground hover:bg-muted"
                }`}
              >
                {page}
              </button>
            ),
          )}
          <button
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className="flex size-8 items-center justify-center rounded-lg border text-muted-foreground transition-colors hover:bg-muted disabled:opacity-40 disabled:pointer-events-none"
          >
            <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}
