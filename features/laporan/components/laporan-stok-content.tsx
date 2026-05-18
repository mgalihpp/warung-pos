"use client"

import * as React from "react"
import Image from "next/image"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Alert02Icon,
  PackageIcon,
  SearchIcon,
  Wallet03Icon,
} from "@hugeicons/core-free-icons"

import { Skeleton } from "@/components/ui/skeleton"
import { formatNumber, formatRupiah } from "@/lib/format-currency"
import {
  useLaporanStok,
  type StokData,
  type StokItem,
} from "@/features/laporan/hooks/use-laporan-queries"

type StatusFilter = "all" | "OK" | "LOW" | "OUT"

export function LaporanStokContent() {
  const { data, isLoading, error } = useLaporanStok()
  const [search, setSearch] = React.useState("")
  const [categoryId, setCategoryId] = React.useState<string>("all")
  const [status, setStatus] = React.useState<StatusFilter>("all")

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

  return (
    <div className="flex flex-col gap-4">
      <StatGrid stats={data.stats} />

      <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
        <div className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <HugeiconsIcon
                icon={SearchIcon}
                size={16}
                className="absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari barang..."
                className="w-full rounded-lg border bg-background py-2 pr-3 pl-9 text-sm outline-none focus:border-primary"
              />
            </div>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            >
              <option value="all">Semua Kategori</option>
              {data.categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as StatusFilter)}
              className="rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            >
              <option value="all">Semua Status</option>
              <option value="OK">Aman</option>
              <option value="LOW">Menipis</option>
              <option value="OUT">Habis</option>
            </select>
          </div>
          <span className="text-xs text-muted-foreground">
            {filtered.length} dari {data.items.length} barang
          </span>
        </div>

        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[820px] text-left text-xs">
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
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-10 text-center text-muted-foreground"
                  >
                    Tidak ada barang yang cocok.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => <StokRow key={item.id} item={item} />)
              )}
            </tbody>
          </table>
        </div>

        {/* ── Mobile/Tablet Card List (<md) ── */}
        <div className="flex flex-col gap-2.5 p-4 pt-0 md:hidden">
          {filtered.length === 0 ? (
            <div className="py-6 text-center text-xs text-muted-foreground">
              Tidak ada barang yang cocok.
            </div>
          ) : (
            filtered.map((item) => {
              const badgeMap: Record<string, string> = { OK: "bg-emerald-500/10 text-emerald-600", LOW: "bg-amber-500/10 text-amber-600", OUT: "bg-rose-500/10 text-rose-600" }
              const labelMap: Record<string, string> = { OK: "Aman", LOW: "Menipis", OUT: "Habis" }
              return (
                <div
                  key={item.id}
                  className="rounded-lg border border-border/50 bg-background p-3"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={40}
                          height={40}
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
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-semibold">{item.name}</p>
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
                  <div className="mt-2.5 grid grid-cols-3 gap-2 rounded-md bg-muted/40 px-2.5 py-2">
                    <div>
                      <p className="text-[10px] font-medium text-muted-foreground">Stok</p>
                      <p className="text-xs font-bold">{formatNumber(item.stock)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-medium text-muted-foreground">Harga Jual</p>
                      <p className="text-xs font-semibold">{formatRupiah(item.sellPrice)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-medium text-muted-foreground">Nilai Stok</p>
                      <p className="text-xs font-bold text-primary">{formatRupiah(item.nilaiStok)}</p>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
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
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
      {cards.map((c) => (
        <div
          key={c.title}
          className="flex items-center gap-3 rounded-xl border bg-card p-3 shadow-sm lg:p-4"
        >
          <div
            className={`flex size-10 shrink-0 items-center justify-center rounded-xl lg:size-12 ${c.iconBg}`}
          >
            <HugeiconsIcon icon={c.icon} size={20} className={c.iconColor} />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-medium text-muted-foreground">
              {c.title}
            </p>
            <p className="truncate text-base font-bold tracking-tight lg:text-lg">
              {c.value}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}

function StokRow({ item }: { item: StokItem }) {
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
  return (
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
    </tr>
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
