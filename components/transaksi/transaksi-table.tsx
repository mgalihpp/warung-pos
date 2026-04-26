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
import { formatRupiah } from "@/lib/format"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerFooter,
} from "@/components/ui/drawer"

// ── Filter options ──
const statusFilters = ["Semua", "Selesai", "Pending", "Dibatalkan"]
const metodeFilters = ["Tunai", "QRIS", "Transfer"]
const statusDropdownOptions = ["Semua Status", "Selesai", "Pending", "Dibatalkan", "Refund"]
const metodeDropdownOptions = ["Semua Metode", "Tunai", "QRIS", "Transfer"]
const kasirDropdownOptions = ["Semua Kasir", "Siti", "Doni", "Budi"]
const sortOptions = ["Terbaru", "Terlama", "Nilai Tertinggi", "Nilai Terendah"]

// ── Types ──
type TransactionStatus = "Selesai" | "Pending" | "Dibatalkan"
type PaymentMethod = "Tunai" | "QRIS" | "Transfer"

type Transaction = {
  id: string
  transactionNumber: string
  waktu: string
  pelanggan: string
  kasir: string
  item: string
  metode: PaymentMethod
  total: number
  status: TransactionStatus
}

// ── Mock data ──
const transactions: Transaction[] = [
  {
    id: "1",
    transactionNumber: "TRX-240524-101",
    waktu: "24 Mei 2025 09:42",
    pelanggan: "Pelanggan Umum",
    kasir: "Siti",
    item: "Beras 5kg, Minyak 1L, Gula 1kg",
    metode: "Tunai",
    total: 125000,
    status: "Selesai",
  },
  {
    id: "2",
    transactionNumber: "TRX-240524-100",
    waktu: "24 Mei 2025 09:15",
    pelanggan: "Pelanggan Umum",
    kasir: "Siti",
    item: "Mie Instan, Telur 1kg, Kecap",
    metode: "QRIS",
    total: 78000,
    status: "Selesai",
  },
  {
    id: "3",
    transactionNumber: "TRX-240524-099",
    waktu: "24 Mei 2025 08:50",
    pelanggan: "Ibu Rina",
    kasir: "Siti",
    item: "Beras 2.5kg, Gula 1kg",
    metode: "Transfer",
    total: 60000,
    status: "Selesai",
  },
  {
    id: "4",
    transactionNumber: "TRX-240524-098",
    waktu: "24 Mei 2025 08:23",
    pelanggan: "Pak Andi",
    kasir: "Doni",
    item: "Sabun, Shampoo, Pasta Gigi",
    metode: "Tunai",
    total: 45000,
    status: "Pending",
  },
  {
    id: "5",
    transactionNumber: "TRX-240524-097",
    waktu: "24 Mei 2025 07:58",
    pelanggan: "Pelanggan Umum",
    kasir: "Siti",
    item: "Minyak 1L, Tepung 1kg, Garam",
    metode: "Tunai",
    total: 68000,
    status: "Selesai",
  },
  {
    id: "6",
    transactionNumber: "TRX-240524-096",
    waktu: "24 Mei 2025 07:33",
    pelanggan: "Bu Sari",
    kasir: "Doni",
    item: "Susu Kental, Roti, Kopi Sachet",
    metode: "QRIS",
    total: 39000,
    status: "Dibatalkan",
  },
  {
    id: "7",
    transactionNumber: "TRX-240524-095",
    waktu: "24 Mei 2025 07:10",
    pelanggan: "Pelanggan Umum",
    kasir: "Siti",
    item: "Air Mineral, Snack, Mie Instan",
    metode: "QRIS",
    total: 23500,
    status: "Selesai",
  },
  {
    id: "8",
    transactionNumber: "TRX-240524-094",
    waktu: "24 Mei 2025 06:48",
    pelanggan: "Pak Joko",
    kasir: "Doni",
    item: "Telur 1kg, Minyak 1L",
    metode: "Transfer",
    total: 46000,
    status: "Pending",
  },
]

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

export function TransaksiTable() {
  const [activeStatusFilter, setActiveStatusFilter] = React.useState("Semua")
  const [activeMetodeFilter, setActiveMetodeFilter] = React.useState<string | null>(null)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [currentPage, setCurrentPage] = React.useState(1)
  const [isFilterOpen, setIsFilterOpen] = React.useState(false)

  // Drawer temp state
  const [tempStatus, setTempStatus] = React.useState("Semua Status")
  const [tempMetode, setTempMetode] = React.useState("Semua Metode")
  const [tempKasir, setTempKasir] = React.useState("Semua Kasir")
  const [tempSort, setTempSort] = React.useState("Terbaru")

  // Desktop dropdown state
  const [desktopStatus, setDesktopStatus] = React.useState("Semua Status")
  const [desktopMetode, setDesktopMetode] = React.useState("Semua Metode")
  const [desktopKasir, setDesktopKasir] = React.useState("Semua Kasir")
  const [desktopSort, setDesktopSort] = React.useState("Terbaru")

  // Combined chip filter state
  const allChipFilters = [...statusFilters, ...metodeFilters]

  const filteredTransactions = transactions.filter((t) => {
    // Status chip filter
    const matchStatus =
      activeStatusFilter === "Semua" || t.status === activeStatusFilter
    // Metode chip filter
    const matchMetode =
      !activeMetodeFilter || t.metode === activeMetodeFilter
    // Search filter
    const matchSearch =
      t.transactionNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.pelanggan.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.item.toLowerCase().includes(searchQuery.toLowerCase())
    return matchStatus && matchMetode && matchSearch
  })

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
    setIsFilterOpen(false)
  }

  const handleResetFilter = () => {
    setTempStatus("Semua Status")
    setTempMetode("Semua Metode")
    setTempKasir("Semua Kasir")
    setTempSort("Terbaru")
    setActiveStatusFilter("Semua")
    setActiveMetodeFilter(null)
    setIsFilterOpen(false)
  }

  // Count active filters for badge
  const activeFilterCount =
    (activeStatusFilter !== "Semua" ? 1 : 0) +
    (activeMetodeFilter ? 1 : 0)

  // Collect active filter labels for chips
  const activeFilterLabels: { label: string; reset: () => void }[] = []
  if (activeStatusFilter !== "Semua")
    activeFilterLabels.push({ label: activeStatusFilter, reset: () => setActiveStatusFilter("Semua") })
  if (activeMetodeFilter)
    activeFilterLabels.push({ label: activeMetodeFilter, reset: () => setActiveMetodeFilter(null) })

  const hasActiveFilters = activeFilterCount > 0

  const handleChipClick = (chip: string) => {
    if (statusFilters.includes(chip)) {
      setActiveStatusFilter(chip)
      // Clear metode filter when clicking a status chip
      if (chip !== "Semua") setActiveMetodeFilter(null)
    } else if (metodeFilters.includes(chip)) {
      if (activeMetodeFilter === chip) {
        setActiveMetodeFilter(null)
      } else {
        setActiveMetodeFilter(chip)
        setActiveStatusFilter("Semua")
      }
    }
  }

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
            placeholder="Cari no. transaksi atau nama pelanggan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9 w-full rounded-lg border bg-background pl-9 pr-3 text-sm outline-none ring-ring transition-colors placeholder:text-muted-foreground focus:ring-1"
          />
        </div>

        {/* Mobile: Filter Button */}
        <Drawer open={isFilterOpen} onOpenChange={(open) => {
          setIsFilterOpen(open)
          if (open) {
            setTempStatus(activeStatusFilter === "Semua" ? "Semua Status" : activeStatusFilter)
            setTempMetode(activeMetodeFilter || "Semua Metode")
            setTempKasir(desktopKasir)
            setTempSort(desktopSort)
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
            <select
              value={desktopStatus}
              onChange={(e) => setDesktopStatus(e.target.value)}
              className="h-9 rounded-lg border bg-background px-3 text-sm outline-none ring-ring focus:ring-1"
            >
              {statusDropdownOptions.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-medium text-muted-foreground">Metode Bayar</span>
            <select
              value={desktopMetode}
              onChange={(e) => setDesktopMetode(e.target.value)}
              className="h-9 rounded-lg border bg-background px-3 text-sm outline-none ring-ring focus:ring-1"
            >
              {metodeDropdownOptions.map((m) => (
                <option key={m}>{m}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-medium text-muted-foreground">Kasir</span>
            <select
              value={desktopKasir}
              onChange={(e) => setDesktopKasir(e.target.value)}
              className="h-9 rounded-lg border bg-background px-3 text-sm outline-none ring-ring focus:ring-1"
            >
              {kasirDropdownOptions.map((k) => (
                <option key={k}>{k}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-medium text-muted-foreground">Urutkan</span>
            <select
              value={desktopSort}
              onChange={(e) => setDesktopSort(e.target.value)}
              className="h-9 rounded-lg border bg-background px-3 text-sm outline-none ring-ring focus:ring-1"
            >
              {sortOptions.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Filter Chips - desktop only */}
      <div className="hidden lg:flex flex-wrap gap-2">
        {allChipFilters.map((chip) => {
          const isStatusChip = statusFilters.includes(chip)
          const isActive = isStatusChip
            ? activeStatusFilter === chip
            : activeMetodeFilter === chip

          return (
            <button
              key={chip}
              onClick={() => handleChipClick(chip)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "border bg-background text-muted-foreground hover:bg-muted"
              }`}
            >
              {chip}
            </button>
          )
        })}
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
              <th className="px-4 py-3 text-xs font-medium text-muted-foreground">Pelanggan</th>
              <th className="px-4 py-3 text-xs font-medium text-muted-foreground">Kasir</th>
              <th className="px-4 py-3 text-xs font-medium text-muted-foreground">Item</th>
              <th className="px-4 py-3 text-xs font-medium text-muted-foreground">Metode</th>
              <th className="px-4 py-3 text-xs font-medium text-muted-foreground">Total</th>
              <th className="px-4 py-3 text-xs font-medium text-muted-foreground">Status</th>
              <th className="px-4 py-3 text-xs font-medium text-muted-foreground">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((trx) => (
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
                    <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[11px] font-bold text-primary">
                      {trx.pelanggan.charAt(0)}
                    </div>
                    <span className="text-sm">{trx.pelanggan}</span>
                  </div>
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
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col items-center justify-between gap-3 lg:flex-row">
        <p className="text-xs text-muted-foreground">
          Menampilkan 1–{filteredTransactions.length} dari 327 transaksi
        </p>
        <div className="flex items-center gap-1">
          <button className="flex size-8 items-center justify-center rounded-lg border text-muted-foreground transition-colors hover:bg-muted">
            <HugeiconsIcon icon={ArrowLeft01Icon} size={14} />
          </button>
          {[1, 2, 3].map((page) => (
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
          ))}
          <span className="px-1 text-xs text-muted-foreground">...</span>
          <button
            onClick={() => setCurrentPage(41)}
            className={`flex size-8 items-center justify-center rounded-lg text-xs font-medium transition-colors ${
              currentPage === 41
                ? "bg-primary text-primary-foreground"
                : "border text-muted-foreground hover:bg-muted"
            }`}
          >
            41
          </button>
          <button className="flex size-8 items-center justify-center rounded-lg border text-muted-foreground transition-colors hover:bg-muted">
            <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}
