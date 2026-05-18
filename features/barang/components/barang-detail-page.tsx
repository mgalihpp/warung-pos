"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowLeft02Icon,
  ArrowRight01Icon,
  ArrowUp01Icon,
  ArrowDown01Icon,
  Alert02Icon,
  Copy01Icon,
  Delete02Icon,
  ChartUpIcon,
  Dollar01Icon,
  Edit02Icon,
  ExchangeIcon,
  MoneyBag02Icon,
  PackageIcon,
  PercentSquareIcon,
  ShoppingBag01Icon,
  ShoppingCart01Icon,
  Tag01Icon,
} from "@hugeicons/core-free-icons"
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { formatRupiah } from "@/lib/format-currency"
import { cn } from "@/lib/utils"
import { useDeleteProduct } from "../hooks/use-barang-actions"
import type { BarangDetailData } from "../server-data-detail"

type BarangDetailPageProps = {
  data: NonNullable<BarangDetailData>
}

function getStatus(product: BarangDetailPageProps["data"]["product"]) {
  if (!product.isActive) return "Nonaktif"
  if (product.stock <= 0) return "Stok Habis"
  if (product.stock <= product.minStock) return "Stok Menipis"
  return "Aktif"
}

function statusBadgeClass(status: string) {
  if (status === "Aktif") return "bg-primary/10 text-primary"
  if (status === "Stok Menipis") return "bg-amber-500/10 text-amber-600"
  if (status === "Stok Habis") return "bg-rose-500/10 text-rose-600"
  return "bg-slate-500/10 text-slate-600"
}

function formatDate(iso: string, withTime = false) {
  const date = new Date(iso)
  const d = date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
  if (!withTime) return d
  const t = date.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  })
  return `${d} ${t}`
}

function formatShortDate(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
  })
}

const movementTypeLabel: Record<string, string> = {
  IN: "Masuk",
  OUT: "Keluar",
  CORRECTION: "Penyesuaian",
  TRANSFER: "Transfer",
}

const movementTypeStyle: Record<string, string> = {
  IN: "bg-primary/10 text-primary",
  OUT: "bg-rose-500/10 text-rose-600",
  CORRECTION: "bg-amber-500/10 text-amber-600",
  TRANSFER: "bg-blue-500/10 text-blue-600",
}

export function BarangDetailPage({ data }: BarangDetailPageProps) {
  const router = useRouter()
  const { product, stats, salesTrend, movements, activities } = data
  const status = getStatus(product)
  const [deleteOpen, setDeleteOpen] = React.useState(false)
  const [isDuplicating, setIsDuplicating] = React.useState(false)
  const deleteMutation = useDeleteProduct()

  React.useEffect(() => {
    const openDeleteDialog = () => setDeleteOpen(true)

    window.addEventListener("barang-delete-request", openDeleteDialog)
    return () => window.removeEventListener("barang-delete-request", openDeleteDialog)
  }, [])

  async function handleDuplicate() {
    setIsDuplicating(true)
    try {
      const res = await fetch("/api/barang", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${product.name} (Salinan)`,
          categoryId: product.categoryId,
          image: product.image ?? "",
          unit: product.unit,
          stock: 0,
          minStock: product.minStock,
          buyPrice: product.buyPrice,
          sellPrice: product.sellPrice,
          description: product.description ?? "",
          isActive: product.isActive ? "on" : "off",
        }),
      })
      if (res.ok) {
        router.push("/admin/barang")
        router.refresh()
      }
    } finally {
      setIsDuplicating(false)
    }
  }

  const topStats = [
    {
      title: "Terjual Bulan Ini",
      value: `${stats.soldThisMonth}`,
      suffix: product.unit,
      desc: "Unit terjual bulan ini",
      icon: ShoppingCart01Icon,
      tint: "bg-primary/10 text-primary",
    },
    {
      title: "Stok Saat Ini",
      value: `${product.stock}`,
      suffix: product.unit,
      desc: "Stok tersedia",
      icon: PackageIcon,
      tint: "bg-emerald-500/10 text-emerald-600",
    },
    {
      title: "Total Penjualan",
      value: formatRupiah(stats.totalRevenue),
      desc: "Dari seluruh penjualan",
      icon: MoneyBag02Icon,
      tint: "bg-violet-500/10 text-violet-600",
    },
    {
      title: "Margin",
      value: `${stats.margin.toFixed(1)}%`,
      desc: "Keuntungan per unit",
      icon: PercentSquareIcon,
      tint: "bg-amber-500/10 text-amber-600",
    },
  ]

  return (
    <div className="min-w-0">
      {/* Mobile / Tablet */}
      <div className="lg:hidden">
        <div className="relative aspect-[9/10] w-full overflow-hidden bg-muted/40">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              sizes="100vw"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <HugeiconsIcon icon={PackageIcon} size={72} className="text-muted-foreground" />
            </div>
          )}
        </div>

        <div className="space-y-4 px-4 pb-[calc(5.5rem+env(safe-area-inset-bottom))] pt-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h1 className="truncate text-2xl font-bold tracking-tight">{product.name}</h1>
              <div className="mt-2 flex items-center gap-2">
                <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                  {product.category}
                </span>
              </div>
            </div>

            <span
              className={cn(
                "shrink-0 rounded-xl px-3 py-2 text-xs font-bold",
                statusBadgeClass(status)
              )}
            >
              {status === "Stok Habis" ? "Habis" : status}
            </span>
          </div>

          <section className="rounded-2xl border bg-card p-4 shadow-sm">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
              <span className="flex size-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-700">
                <HugeiconsIcon icon={MoneyBag02Icon} size={16} />
              </span>
              Informasi Harga
            </div>

            <div className="divide-y">
              <div className="flex items-center justify-between gap-3 py-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <HugeiconsIcon icon={Tag01Icon} size={18} className="text-blue-600" />
                  Harga Jual
                </div>
                <div className="text-base font-bold text-primary">{formatRupiah(product.sellPrice)}</div>
              </div>
              <div className="flex items-center justify-between gap-3 py-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <HugeiconsIcon icon={Dollar01Icon} size={18} className="text-emerald-700" />
                  Harga Dasar
                </div>
                <div className="text-base font-semibold">{formatRupiah(product.buyPrice)}</div>
              </div>
              <div className="flex items-center justify-between gap-3 py-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <HugeiconsIcon icon={ChartUpIcon} size={18} className="text-emerald-700" />
                  Profit
                </div>
                <div className="text-base font-bold text-emerald-700">
                  {formatRupiah(product.sellPrice - product.buyPrice)}
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/80 p-4 backdrop-blur pb-[calc(1rem+env(safe-area-inset-bottom))]">
          <Button asChild className="h-12 w-full rounded-2xl gap-2">
            <Link href={`/admin/barang/${product.id}/edit`}>
              <HugeiconsIcon icon={Edit02Icon} size={18} />
              Edit Barang
            </Link>
          </Button>
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden lg:flex min-w-0 flex-col gap-4 p-4 pb-24 lg:gap-6 lg:p-6">
        {/* Header */}
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-3">
          <Button
            asChild
            size="icon"
            variant="outline"
            className="mt-0.5 shrink-0 rounded-full"
            aria-label="Kembali"
          >
            <Link href="/admin/barang">
              <HugeiconsIcon icon={ArrowLeft02Icon} size={16} />
            </Link>
          </Button>
          <div>
            <h1 className="text-xl font-bold tracking-tight lg:text-2xl">
              Detail Barang
            </h1>
            <p className="text-sm text-muted-foreground">
              Lihat informasi lengkap, performa, dan stok barang
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="outline"
            className="gap-2"
            onClick={handleDuplicate}
            disabled={isDuplicating}
          >
            <HugeiconsIcon icon={Copy01Icon} size={16} />
            {isDuplicating ? "Menduplikasi..." : "Duplikat Barang"}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="gap-2 border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive"
            onClick={() => setDeleteOpen(true)}
          >
            <HugeiconsIcon icon={Delete02Icon} size={16} />
            Hapus
          </Button>
          <Button asChild className="gap-2">
            <Link href={`/admin/barang/${product.id}/edit`}>
              <HugeiconsIcon icon={Edit02Icon} size={16} />
              Edit Barang
            </Link>
          </Button>
        </div>
      </div>

      <div className="flex min-w-0 flex-col gap-4 lg:gap-6">
          {/* Stat cards */}
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
            {topStats.map((s) => (
              <div
                key={s.title}
                className="group flex items-center gap-3 rounded-xl border bg-card p-3 shadow-sm transition-shadow hover:shadow-md lg:p-4"
              >
                <div
                  className={cn(
                    "flex size-10 shrink-0 items-center justify-center rounded-xl lg:size-12",
                    s.tint
                  )}
                >
                  <HugeiconsIcon icon={s.icon} size={20} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[10px] font-medium text-muted-foreground lg:text-xs">
                    {s.title}
                  </p>
                  <p className="truncate text-lg font-bold tracking-tight lg:text-xl">
                    {s.value}
                    {s.suffix ? (
                      <span className="ml-1 text-xs font-normal text-muted-foreground">
                        {s.suffix}
                      </span>
                    ) : null}
                  </p>
                  <p className="hidden truncate text-[10px] text-muted-foreground lg:block">
                    {s.desc}
                  </p>
                </div>
                <HugeiconsIcon
                  icon={ArrowRight01Icon}
                  size={14}
                  className="hidden shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 lg:block"
                />
              </div>
            ))}
          </div>

          {/* Informasi Barang */}
          <section className="rounded-xl border bg-card p-4 shadow-sm lg:p-5">
            <h2 className="mb-4 text-sm font-semibold">Informasi Barang</h2>
            <div className="grid gap-5 sm:grid-cols-[220px_1fr] lg:grid-cols-[260px_1fr]">
              <div className="flex aspect-square w-full items-center justify-center overflow-hidden rounded-xl bg-muted/30">
                {product.image ? (
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={400}
                    height={400}
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <HugeiconsIcon
                    icon={PackageIcon}
                    size={64}
                    className="text-muted-foreground"
                  />
                )}
              </div>

              <dl className="divide-y divide-border/60 text-sm">
                <InfoRow label="Nama Barang" value={product.name} />
                <InfoRow label="Kategori" value={product.category} />
                <InfoRow label="Satuan" value={product.unit} />
                <InfoRow
                  label="Status"
                  value={
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold",
                        statusBadgeClass(status)
                      )}
                    >
                      {status}
                    </span>
                  }
                />
                <InfoRow label="Dibuat" value={formatDate(product.createdAt)} />
                <InfoRow
                  label="Terakhir Diperbarui"
                  value={formatDate(product.updatedAt)}
                />
              </dl>
            </div>
          </section>

          {/* Harga + Deskripsi */}
          <div className="grid gap-4 lg:grid-cols-2 lg:gap-6">
            <section className="rounded-xl border bg-card p-4 shadow-sm lg:p-5">
              <h2 className="mb-4 text-sm font-semibold">Harga &amp; Persediaan</h2>
              <div className="grid grid-cols-2 gap-3">
                <PriceMiniCard
                  icon={ShoppingBag01Icon}
                  iconTint="bg-primary/10 text-primary"
                  label="Harga Beli"
                  value={formatRupiah(product.buyPrice)}
                />
                <PriceMiniCard
                  icon={Tag01Icon}
                  iconTint="bg-blue-500/10 text-blue-600"
                  label="Harga Jual"
                  value={formatRupiah(product.sellPrice)}
                />
                <PriceMiniCard
                  icon={PercentSquareIcon}
                  iconTint="bg-amber-500/10 text-amber-600"
                  label="Margin"
                  value={`${stats.margin.toFixed(1)}%`}
                />
                <PriceMiniCard
                  icon={PackageIcon}
                  iconTint="bg-emerald-500/10 text-emerald-600"
                  label="Stok Minimum"
                  value={`${product.minStock} ${product.unit}`}
                />
                <PriceMiniCard
                  icon={MoneyBag02Icon}
                  iconTint="bg-violet-500/10 text-violet-600"
                  label="Estimasi Nilai Stok"
                  value={formatRupiah(stats.stockValue)}
                  className="col-span-2"
                />
              </div>
            </section>

            <section className="rounded-xl border bg-card p-4 shadow-sm lg:p-5">
              <h2 className="mb-3 text-sm font-semibold">Deskripsi Barang</h2>
              {product.description ? (
                <p className="text-sm leading-relaxed whitespace-pre-line text-foreground/80">
                  {product.description}
                </p>
              ) : (
                <p className="text-sm text-muted-foreground italic">
                  Belum ada deskripsi untuk barang ini.
                </p>
              )}
            </section>
          </div>

          {/* Tren & Riwayat */}
          <div className="grid gap-4 lg:grid-cols-2 lg:gap-6">
            <section className="rounded-xl border bg-card p-4 shadow-sm lg:p-5">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-semibold">Tren Penjualan</h2>
                  <p className="text-[11px] text-muted-foreground">
                    30 Hari Terakhir
                  </p>
                </div>
                <span className="rounded-full border bg-muted/40 px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">
                  30 Hari
                </span>
              </div>
              {salesTrend.every((s) => s.quantity === 0) ? (
                <div className="flex h-[220px] items-center justify-center text-xs text-muted-foreground">
                  Belum ada penjualan 30 hari terakhir.
                </div>
              ) : (
                <div className="h-[220px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={salesTrend}
                      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#16a34a" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                      <XAxis
                        dataKey="date"
                        tickFormatter={(value) => formatShortDate(value)}
                        tick={{ fontSize: 10 }}
                        tickLine={false}
                        axisLine={false}
                        minTickGap={24}
                      />
                      <YAxis
                        tick={{ fontSize: 10 }}
                        tickLine={false}
                        axisLine={false}
                        allowDecimals={false}
                      />
                      <Tooltip
                        cursor={{ stroke: "var(--border)", strokeWidth: 1 }}
                        contentStyle={{
                          borderRadius: 8,
                          fontSize: 12,
                          border: "1px solid var(--border)",
                          background: "var(--card)",
                        }}
                        labelFormatter={(value) => formatDate(value as string)}
                        formatter={(value) => [`${value} ${product.unit}`, "Terjual"]}
                      />
                      <Area
                        type="monotone"
                        dataKey="quantity"
                        stroke="#16a34a"
                        strokeWidth={2}
                        fill="url(#trendGradient)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}
            </section>

            <section className="rounded-xl border bg-card p-4 shadow-sm lg:p-5">
              <h2 className="mb-3 text-sm font-semibold">
                Riwayat Pergerakan Stok
              </h2>
              {movements.length === 0 ? (
                <div className="flex h-[220px] items-center justify-center text-xs text-muted-foreground">
                  Belum ada riwayat pergerakan stok.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[480px] text-left text-xs">
                    <thead>
                      <tr className="border-b text-[11px] text-muted-foreground">
                        <th className="py-2 pr-3 font-medium">Tanggal</th>
                        <th className="py-2 pr-3 font-medium">Tipe</th>
                        <th className="py-2 pr-3 font-medium">Jumlah</th>
                        <th className="py-2 pr-3 font-medium">PIC</th>
                        <th className="py-2 pr-3 font-medium">Keterangan</th>
                      </tr>
                    </thead>
                    <tbody>
                      {movements.map((m) => {
                        const sign = m.type === "OUT" ? "-" : "+"
                        const label = movementTypeLabel[m.type] ?? m.type
                        return (
                          <tr key={m.id} className="border-b last:border-0">
                            <td className="py-2.5 pr-3 whitespace-nowrap text-muted-foreground">
                              {formatDate(m.createdAt, true)}
                            </td>
                            <td className="py-2.5 pr-3">
                              <span
                                className={cn(
                                  "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold",
                                  movementTypeStyle[m.type] ??
                                    "bg-slate-500/10 text-slate-600"
                                )}
                              >
                                {label}
                              </span>
                            </td>
                            <td
                              className={cn(
                                "py-2.5 pr-3 font-semibold whitespace-nowrap",
                                m.type === "OUT"
                                  ? "text-rose-600"
                                  : m.type === "IN"
                                    ? "text-primary"
                                    : "text-amber-600"
                              )}
                            >
                              {sign}
                              {m.quantity} {product.unit}
                            </td>
                            <td className="py-2.5 pr-3 text-muted-foreground whitespace-nowrap">
                              {m.userName}
                            </td>
                            <td className="py-2.5 pr-3 text-muted-foreground">
                              {m.reason ?? "-"}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </div>

          {/* Aktivitas Barang Terbaru */}
          <section className="rounded-xl border bg-card p-4 shadow-sm lg:p-5">
            <h2 className="mb-3 text-sm font-semibold">
              Aktivitas Barang Terbaru
            </h2>
            {activities.length === 0 ? (
              <div className="rounded-lg border border-dashed p-6 text-center text-xs text-muted-foreground">
                Belum ada aktivitas pada barang ini.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {activities.map((a) => {
                  const icon =
                    a.type === "IN"
                      ? ArrowUp01Icon
                      : a.type === "OUT"
                        ? ArrowDown01Icon
                        : ExchangeIcon
                  const tone =
                    a.type === "IN"
                      ? "bg-primary/10 text-primary"
                      : a.type === "OUT"
                        ? "bg-rose-500/10 text-rose-600"
                        : "bg-amber-500/10 text-amber-600"
                  const label = movementTypeLabel[a.type] ?? a.type
                  return (
                    <div
                      key={a.id}
                      className="flex items-center gap-3 rounded-lg border border-border/50 bg-muted/20 px-3 py-2.5"
                    >
                      <div
                        className={cn(
                          "flex size-9 shrink-0 items-center justify-center rounded-full",
                          tone
                        )}
                      >
                        <HugeiconsIcon icon={icon} size={16} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[11px] font-medium text-muted-foreground">
                          Stok {label.toLowerCase()}{" "}
                          {a.type === "OUT" ? "-" : a.type === "IN" ? "+" : "±"}
                          {a.quantity} {product.unit}
                        </p>
                        <p className="truncate text-xs font-medium">
                          {a.reason ?? "Tanpa keterangan"}
                        </p>
                      </div>
                      <span className="shrink-0 text-[10px] text-muted-foreground">
                        {formatShortDate(a.createdAt)}
                      </span>
                    </div>
                  )
                })}
              </div>
            )}
          </section>
      </div>
      </div>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent className="sm:max-w-[400px]">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
              <HugeiconsIcon icon={Alert02Icon} size={20} />
              Hapus Barang?
            </AlertDialogTitle>
            <AlertDialogDescription className="pt-2 leading-relaxed">
              Anda yakin ingin menghapus{" "}
              <strong className="font-semibold text-foreground">
                {product.name}
              </strong>
              ? Tindakan ini permanen. <br />
              <br />
              *Jika barang memiliki riwayat transaksi, barang otomatis hanya
              dinonaktifkan untuk menjaga validitas laporan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 pt-4">
            <AlertDialogCancel
              onClick={() => setDeleteOpen(false)}
              className="mt-0 w-full sm:w-auto"
            >
              Batal
            </AlertDialogCancel>
            <Button
              type="button"
              variant="destructive"
              className="w-full sm:w-auto"
              disabled={deleteMutation.isPending}
              onClick={async () => {
                const result = await deleteMutation.mutateAsync(product.id)
                if (result.success) {
                  setDeleteOpen(false)
                  router.push("/admin/barang")
                  router.refresh()
                }
              }}
            >
              {deleteMutation.isPending ? "Menghapus..." : "Hapus"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

function InfoRow({
  label,
  value,
}: {
  label: string
  value: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-2.5">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="min-w-0 text-right font-medium">{value}</dd>
    </div>
  )
}

function PriceMiniCard({
  icon,
  iconTint,
  label,
  value,
  className,
}: {
  icon: Parameters<typeof HugeiconsIcon>[0]["icon"]
  iconTint: string
  label: string
  value: string
  className?: string
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-2.5 rounded-lg border bg-muted/30 px-3 py-2.5",
        className
      )}
    >
      <div
        className={cn(
          "flex size-9 shrink-0 items-center justify-center rounded-lg",
          iconTint
        )}
      >
        <HugeiconsIcon icon={icon} size={16} />
      </div>
      <div className="min-w-0">
        <p className="truncate text-[10px] font-medium text-muted-foreground">
          {label}
        </p>
        <p className="truncate text-sm font-bold tracking-tight">{value}</p>
      </div>
    </div>
  )
}
