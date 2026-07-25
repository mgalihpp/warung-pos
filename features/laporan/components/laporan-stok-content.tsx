"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Alert02Icon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
  Cancel01Icon,
  Delete02Icon,
  Edit02Icon,
  FilterIcon,
  MoreVerticalCircle01Icon,
  PackageIcon,
  SearchIcon,
  Tick02Icon,
  ViewIcon,
  Wallet03Icon,
} from "@hugeicons/core-free-icons"

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { useSearchParam, useSearchParamsState } from "@/hooks/use-search-param"
import { formatNumber, formatRupiah } from "@/lib/format-currency"
import { useDeleteProduct } from "@/features/barang/hooks/use-barang-actions"
import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import {
  useLaporanStok,
  type StokData,
  type StokItem,
} from "@/features/laporan/hooks/use-laporan-queries"

type StatusFilter = "all" | "OK" | "LOW" | "OUT"

const statusLabel: Record<StatusFilter, string> = {
  all: "Semua Status",
  OK: "Aman",
  LOW: "Menipis",
  OUT: "Habis",
}

const pageSize = 10

export function LaporanStokContent({ initialData }: { initialData?: StokData }) {
  const { data, isLoading, error } = useLaporanStok(initialData)
  const [search, setSearch] = useSearchParam("search", "")
  const [categoryId, setCategoryId] = useSearchParam("category", "all")
  const [statusParam, setStatus] = useSearchParam("status", "all")
  const status = statusParam as StatusFilter
  const [pageParam, setCurrentPage] = useSearchParam("page", "1")
  const currentPage = Number(pageParam)
  const [filterOpen, setFilterOpen] = React.useState(false)

  if (error) {
    return (
      <div className="rounded-xl border bg-card p-6 text-center text-sm text-destructive">
        Gagal memuat laporan stok.
      </div>
    )
  }

  if (isLoading || !data) return <StokSkeleton />

  const filtered = data.items.filter((item) => {
    if (categoryId !== "all" && item.categoryId !== categoryId) return false
    if (status !== "all" && item.status !== status) return false
    if (search && !item.name.toLowerCase().includes(search.toLowerCase()))
      return false
    return true
  })
  const selectedCategory = data.categories.find((cat) => cat.id === categoryId)
  const hasFilter = categoryId !== "all" || status !== "all"
  const resetFilters = () => {
    setCategoryId("all")
    setStatus("all")
    setCurrentPage("1")
  }

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const safePage = Math.min(currentPage, totalPages)
  const pageProducts = filtered.slice(
    (safePage - 1) * pageSize,
    safePage * pageSize,
  )
  const startItem = filtered.length === 0 ? 0 : (safePage - 1) * pageSize + 1
  const endItem = Math.min(safePage * pageSize, filtered.length)

  return (
    <div className="flex flex-col gap-4">
      <StatGrid stats={data.stats} />

      <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
        <div className="flex flex-col gap-3 border-b p-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-1 flex-col gap-3 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <HugeiconsIcon
                icon={SearchIcon}
                size={16}
                className="absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setCurrentPage("1") }}
                placeholder="Cari barang..."
                className="h-12 w-full rounded-xl border bg-background py-2 pr-3 pl-9 text-sm outline-none transition-colors focus:border-primary lg:h-10 lg:rounded-lg"
              />
            </div>

            <div className="lg:hidden">
              <button
                type="button"
                onClick={() => setFilterOpen(true)}
                className="flex h-12 w-full items-center justify-between rounded-xl border bg-background px-4 text-sm font-semibold transition active:scale-[0.99]"
              >
                <span className="flex items-center gap-2">
                  <HugeiconsIcon icon={FilterIcon} size={16} />
                  Filter stok
                </span>
                {hasFilter ? (
                  <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-primary-foreground">
                    {[categoryId !== "all", status !== "all"].filter(Boolean).length}
                  </span>
                ) : null}
              </button>
              <Drawer
                open={filterOpen}
                onOpenChange={setFilterOpen}
              >
                <DrawerContent className="h-[100dvh] max-h-[100dvh] overflow-hidden p-3 pb-4 !mt-0 !max-h-[100dvh] lg:hidden">
                  <DrawerHeader className="px-4 pt-4 pb-3 text-left">
                    <DrawerTitle className="text-base font-bold">Filter Laporan Stok</DrawerTitle>
                    <DrawerDescription className="text-xs">
                      Saring barang berdasarkan kategori dan kondisi stok.
                    </DrawerDescription>
                  </DrawerHeader>
                  <div className="min-h-0 flex-1 overflow-y-auto px-4 py-2">
                    <div className="flex flex-col gap-6 pb-2">
                      <MobileFilterGroup label="Kategori">
                        <MobileFilterOption
                          active={categoryId === "all"}
                          label="Semua Kategori"
                          onClick={() => { setCategoryId("all"); setCurrentPage("1") }}
                        />
                        {data.categories.map((cat) => (
                          <MobileFilterOption
                            key={cat.id}
                            active={categoryId === cat.id}
                            label={cat.name}
                            onClick={() => { setCategoryId(cat.id); setCurrentPage("1") }}
                          />
                        ))}
                      </MobileFilterGroup>
                      <MobileFilterGroup label="Status stok">
                        {(["all", "OK", "LOW", "OUT"] as StatusFilter[]).map((item) => (
                          <MobileFilterOption
                            key={item}
                            active={status === item}
                            label={statusLabel[item]}
                            onClick={() => { setStatus(item); setCurrentPage("1") }}
                          />
                        ))}
                      </MobileFilterGroup>
                    </div>
                  </div>
                  <div className="shrink-0 border-t bg-background px-4 py-3 grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={resetFilters}
                      className="h-11 rounded-2xl border text-sm font-semibold"
                    >
                      Reset
                    </button>
                    <button
                      type="button"
                      onClick={() => setFilterOpen(false)}
                      className="h-11 rounded-2xl bg-primary text-sm font-semibold text-primary-foreground"
                    >
                      Terapkan
                    </button>
                  </div>
                </DrawerContent>
              </Drawer>
            </div>

            <div className="hidden lg:block">
              <Select value={categoryId} onValueChange={(v) => { setCategoryId(v); setCurrentPage("1") }}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Kategori</SelectItem>
                  {data.categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="hidden lg:block">
              <Select value={status} onValueChange={(v) => { setStatus(v as StatusFilter); setCurrentPage("1") }}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="OK">Aman</SelectItem>
                  <SelectItem value="LOW">Menipis</SelectItem>
                  <SelectItem value="OUT">Habis</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <span className="text-xs text-muted-foreground">
            {filtered.length} dari {data.items.length} barang
          </span>

          {hasFilter ? (
            <div className="flex flex-wrap gap-2 lg:hidden">
              {selectedCategory ? <FilterChip label={selectedCategory.name} /> : null}
              {status !== "all" ? <FilterChip label={statusLabel[status]} /> : null}
              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-semibold text-muted-foreground"
              >
                <HugeiconsIcon icon={Cancel01Icon} size={12} />
                Reset
              </button>
            </div>
          ) : null}
        </div>

        <div className="hidden overflow-x-auto lg:block">
          <table className="w-full min-w-[860px] text-left text-xs">
            <thead className="bg-muted/50 text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-semibold">Barang</th>
                <th className="px-4 py-3 font-semibold">Kategori</th>
                <th className="px-4 py-3 text-right font-semibold">Stok</th>
                <th className="px-4 py-3 text-right font-semibold">Min</th>
                <th className="px-4 py-3 text-right font-semibold">
                  Harga Beli
                </th>
                <th className="px-4 py-3 text-right font-semibold">
                  Harga Jual
                </th>
                <th className="px-4 py-3 text-right font-semibold">
                  Nilai Stok
                </th>
                <th className="px-4 py-3 text-center font-semibold">Status</th>
                <th className="px-4 py-3 text-center font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {pageProducts.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
                    className="px-4 py-10 text-center text-muted-foreground"
                  >
                    Tidak ada barang yang cocok.
                  </td>
                </tr>
              ) : (
                pageProducts.map((item) => <StokRow key={item.id} item={item} />)
              )}
            </tbody>
          </table>
        </div>

        <div className="hidden border-t px-4 py-3 lg:block">
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              Menampilkan {startItem}-{endItem} dari {filtered.length} barang
            </p>
            {totalPages > 1 && (
              <div className="flex items-center gap-1">
                <button
                  disabled={safePage === 1}
                  onClick={() => setCurrentPage(String(Math.max(1, safePage - 1)))}
                  className="flex size-8 items-center justify-center rounded-lg border text-muted-foreground transition-colors hover:bg-muted disabled:opacity-50"
                >
                  <HugeiconsIcon icon={ArrowLeft01Icon} size={14} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(String(page))}
                    className={`flex size-8 items-center justify-center rounded-lg text-xs font-medium transition-colors ${
                      safePage === page
                        ? "bg-primary text-primary-foreground"
                        : "border text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  disabled={safePage === totalPages}
                  onClick={() => setCurrentPage(String(Math.min(totalPages, safePage + 1)))}
                  className="flex size-8 items-center justify-center rounded-lg border text-muted-foreground transition-colors hover:bg-muted disabled:opacity-50"
                >
                  <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ── Mobile/Tablet Card List (<lg) ── */}
        <div className="flex flex-col gap-2.5 p-4 pt-4 lg:hidden">
          {pageProducts.length === 0 ? (
            <div className="py-6 text-center text-xs text-muted-foreground">
              Tidak ada barang yang cocok.
            </div>
          ) : (
            pageProducts.map((item) => {
              const badgeMap: Record<string, string> = { OK: "bg-emerald-500/10 text-emerald-600", LOW: "bg-amber-500/10 text-amber-600", OUT: "bg-rose-500/10 text-rose-600" }
              const labelMap: Record<string, string> = { OK: "Aman", LOW: "Menipis", OUT: "Habis" }
              const stockRatio = item.minStock > 0 ? Math.min((item.stock / item.minStock) * 100, 100) : 100
              const barColor = item.status === "OUT" ? "bg-rose-500" : item.status === "LOW" ? "bg-amber-500" : "bg-emerald-500"
              return (
                <Link
                  key={item.id}
                  href={`/admin/barang/${item.id}`}
                  className="rounded-2xl border border-border/60 bg-background p-3.5 shadow-sm transition-colors hover:bg-muted/30"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-muted">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={48}
                          height={48}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <HugeiconsIcon
                          icon={PackageIcon}
                          size={18}
                          className="text-muted-foreground"
                        />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold">{item.name}</p>
                      <p className="text-[11px] text-muted-foreground">
                        {item.categoryName} · {item.unit}
                      </p>
                    </div>
                    <span
                      className={`inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-[10px] font-bold ${badgeMap[item.status] || ""}`}
                    >
                      {labelMap[item.status] || item.status}
                    </span>
                  </div>

                  <div className="mt-3 rounded-2xl bg-muted/45 p-3">
                    <div className="flex items-end justify-between gap-3">
                      <div>
                        <p className="text-[10px] font-medium text-muted-foreground">Stok tersedia</p>
                        <p className="text-lg font-black tracking-tight">
                          {formatNumber(item.stock)} <span className="text-xs font-semibold text-muted-foreground">{item.unit}</span>
                        </p>
                      </div>
                      <p className="text-right text-[10px] font-medium text-muted-foreground">
                        Min. {formatNumber(item.minStock)}
                      </p>
                    </div>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-background">
                      <div className={`h-full rounded-full ${barColor}`} style={{ width: `${stockRatio}%` }} />
                    </div>
                  </div>

                  <div className="mt-2.5 grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-[10px] font-medium text-muted-foreground">Harga jual</p>
                      <p className="break-words text-xs font-semibold">{formatRupiah(item.sellPrice)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-medium text-muted-foreground">Nilai stok</p>
                      <p className="break-words text-xs font-bold text-primary">{formatRupiah(item.nilaiStok)}</p>
                    </div>
                  </div>
                </Link>
              )
            })
          )}

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-1 pt-2">
              <button
                disabled={safePage === 1}
                onClick={() => setCurrentPage(String(Math.max(1, safePage - 1)))}
                className="flex size-8 items-center justify-center rounded-lg border text-muted-foreground transition-colors hover:bg-muted disabled:opacity-50"
              >
                <HugeiconsIcon icon={ArrowLeft01Icon} size={14} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).slice(0, 5).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(String(page))}
                  className={`flex size-8 items-center justify-center rounded-lg text-xs font-medium transition-colors ${
                    safePage === page
                      ? "bg-primary text-primary-foreground"
                      : "border text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                disabled={safePage === totalPages}
                onClick={() => setCurrentPage(String(Math.min(totalPages, safePage + 1)))}
                className="flex size-8 items-center justify-center rounded-lg border text-muted-foreground transition-colors hover:bg-muted disabled:opacity-50"
              >
                <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function MobileFilterGroup({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div>
      <p className="mb-2 px-1 text-xs font-bold text-muted-foreground">{label}</p>
      <div className="flex flex-col gap-2.5">{children}</div>
    </div>
  )
}

function MobileFilterOption({
  active,
  label,
  onClick,
}: {
  active: boolean
  label: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex min-h-11 items-center justify-between gap-3 rounded-2xl border px-4 py-2.5 text-left text-sm transition active:scale-[0.99] ${
        active ? "border-primary bg-primary/5 font-bold text-primary" : "border-border bg-card"
      }`}
    >
      <span className="truncate">{label}</span>
      {active ? <HugeiconsIcon icon={Tick02Icon} size={16} /> : null}
    </button>
  )
}

function FilterChip({ label }: { label: string }) {
  return (
    <span className="inline-flex rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-bold text-primary">
      {label}
    </span>
  )
}

function StatGrid({ stats }: { stats: StokData["stats"] }) {
  const cards = [
    {
      title: "Total Barang Aktif",
      value: formatNumber(stats.totalBarang),
      icon: PackageIcon,
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
    },
    {
      title: "Stok Menipis",
      value: formatNumber(stats.stokMenipis),
      icon: Alert02Icon,
      iconBg: "bg-amber-500/10",
      iconColor: "text-amber-600",
    },
    {
      title: "Stok Habis",
      value: formatNumber(stats.stokHabis),
      icon: Alert02Icon,
      iconBg: "bg-rose-500/10",
      iconColor: "text-rose-600",
    },
    {
      title: "Nilai Stok",
      value: formatRupiah(stats.nilaiStok),
      icon: Wallet03Icon,
      iconBg: "bg-emerald-500/10",
      iconColor: "text-emerald-600",
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
      {cards.map((c) => (
        <div
          key={c.title}
          className="group relative flex min-h-24 items-center gap-3.5 overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-[0_2px_8px_-3px_rgba(0,0,0,0.05)] transition-all duration-200 active:scale-[0.98] lg:min-h-0 lg:items-center lg:gap-3 lg:rounded-xl lg:p-4 lg:shadow-sm"
        >
          <div
            className={`flex size-11 shrink-0 items-center justify-center rounded-[14px] transition-transform duration-300 group-hover:scale-105 lg:size-12 lg:rounded-xl ${c.iconBg}`}
          >
            <HugeiconsIcon icon={c.icon} size={22} className={c.iconColor} />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase lg:font-medium lg:normal-case lg:tracking-normal">
              {c.title}
            </p>
            <p className="break-words text-xl font-extrabold tracking-tight text-foreground lg:truncate lg:text-lg lg:font-bold">
              {c.value}
            </p>
          </div>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/[0.03] to-transparent opacity-0 transition-opacity group-hover:opacity-100 lg:hidden" />
        </div>
      ))}
    </div>
  )
}

function StokRow({ item }: { item: StokItem }) {
  const [deleteOpen, setDeleteOpen] = React.useState(false)
  const queryClient = useQueryClient()
  const deleteMutation = useDeleteProduct()

  const statusBadge: Record<StokItem["status"], string> = {
    OK: "bg-emerald-500/10 text-emerald-600",
    LOW: "bg-amber-500/10 text-amber-600",
    OUT: "bg-rose-500/10 text-rose-600",
  }
  const statusLabel: Record<StokItem["status"], string> = {
    OK: "Aman",
    LOW: "Menipis",
    OUT: "Habis",
  }

  const handleDelete = () => {
    deleteMutation.mutate(item.id, {
      onSuccess: (data) => {
        if (data.success) {
          queryClient.invalidateQueries({ queryKey: ["laporan", "stok"] })
          toast.success("Barang berhasil dihapus")
          return
        }
        toast.error(data.error ?? "Barang gagal dihapus")
      },
      onError: () => toast.error("Barang gagal dihapus"),
    })
  }

  return (
    <>
    <tr className="border-t transition-colors hover:bg-muted/30">
      <td className="px-4 py-2.5">
        <div className="flex items-center gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted">
            {item.image ? (
              <Image
                src={item.image}
                alt={item.name}
                width={36}
                height={36}
                className="h-full w-full object-cover"
              />
            ) : (
              <HugeiconsIcon
                icon={PackageIcon}
                size={16}
                className="text-muted-foreground"
              />
            )}
          </div>
          <div className="min-w-0">
            <p className="truncate font-semibold">{item.name}</p>
            <p className="text-[11px] text-muted-foreground">{item.unit}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-2.5 text-muted-foreground">{item.categoryName}</td>
      <td className="px-4 py-2.5 text-right font-semibold">
        {formatNumber(item.stock)}
      </td>
      <td className="px-4 py-2.5 text-right text-muted-foreground">
        {formatNumber(item.minStock)}
      </td>
      <td className="px-4 py-2.5 text-right">{formatRupiah(item.buyPrice)}</td>
      <td className="px-4 py-2.5 text-right">{formatRupiah(item.sellPrice)}</td>
      <td className="px-4 py-2.5 text-right font-medium">
        {formatRupiah(item.nilaiStok)}
      </td>
      <td className="px-4 py-2.5 text-center">
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold ${statusBadge[item.status]}`}
        >
          {statusLabel[item.status]}
        </span>
      </td>
      <td className="px-4 py-2.5 text-center">
        <div className="flex items-center justify-center gap-1">
          <Link
            href={`/admin/barang/${item.id}/edit`}
            className="hidden rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground lg:inline-flex"
            aria-label="Edit barang"
          >
            <HugeiconsIcon icon={Edit02Icon} size={15} />
          </Link>
          <Link
            href={`/admin/barang/${item.id}`}
            className="inline-flex rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Lihat detail"
          >
            <HugeiconsIcon icon={ViewIcon} size={15} />
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                aria-label="Aksi lainnya"
              >
                <HugeiconsIcon icon={MoreVerticalCircle01Icon} size={15} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44 rounded-xl p-2">
              <DropdownMenuItem asChild className="cursor-pointer gap-2 rounded-lg py-2">
                <Link href={`/admin/barang/${item.id}/edit`}>
                  <HugeiconsIcon icon={Edit02Icon} size={16} className="text-muted-foreground" />
                  Edit Barang
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="my-1" />
              <DropdownMenuItem
                variant="destructive"
                className="cursor-pointer gap-2 rounded-lg py-2"
                onSelect={() => setDeleteOpen(true)}
              >
                <HugeiconsIcon icon={Delete02Icon} size={16} />
                Hapus Barang
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </td>
    </tr>

    <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
      <AlertDialogContent className="sm:max-w-[400px]">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-destructive">
            <HugeiconsIcon icon={Alert02Icon} size={20} />
            Hapus Barang?
          </AlertDialogTitle>
          <AlertDialogDescription className="pt-2 leading-relaxed">
            Barang <strong className="font-semibold text-foreground">{item.name}</strong> akan
            dihapus secara permanen. Tindakan ini tidak dapat dibatalkan.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2">
          <AlertDialogCancel className="mt-0">Batal</AlertDialogCancel>
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-2xl bg-destructive px-5 text-sm font-semibold text-destructive-foreground transition-all hover:bg-destructive/90 active:scale-[0.98] disabled:opacity-50"
          >
            {deleteMutation.isPending ? "Menghapus..." : "Hapus"}
          </button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    </>
  )
}

function StokSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-20 rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-[420px] rounded-xl" />
    </div>
  )
}
