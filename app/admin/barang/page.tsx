import { redirect } from "next/navigation"

import { BarangHeader } from "@/features/barang/components/barang-header"
import { BarangStatCards } from "@/features/barang/components/barang-stat-cards"
import { BarangTable } from "@/features/barang/components/barang-table"
import { BarangKategoriChart } from "@/features/barang/components/barang-kategori-chart"
import { BarangPopuler } from "@/features/barang/components/barang-populer"
import { getBarangPageData } from "@/features/barang/server-data"
import { getSessionUser } from "@/lib/server/auth-guards"
import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import { Alert02Icon, ArrowRight01Icon, PackageIcon, TagsIcon, WarehouseIcon } from "@hugeicons/core-free-icons"

export default async function BarangPage() {
  const user = await getSessionUser()

  if (!user) {
    redirect("/login")
  }

  if (user.role !== "admin") {
    redirect("/unauthorized")
  }

  const data = await getBarangPageData()

  return (
    <>
      {/* Mobile / Tablet: landing "Manajemen Barang" */}
      <div className="h-full overflow-y-auto px-4 pb-20 pt-5 lg:hidden animate-in fade-in slide-in-from-bottom-3 duration-300">
        <div className="rounded-3xl bg-primary p-5 text-primary-foreground shadow-lg shadow-primary/20 transition-all active:scale-[0.99]">
          <div className="flex items-center gap-4">
            <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-primary-foreground/12">
              <HugeiconsIcon icon={WarehouseIcon} size={26} className="text-primary-foreground" />
            </div>
            <div className="min-w-0">
              <p className="text-xl font-extrabold leading-6 tracking-tight">Kelola Barang</p>
              <p className="mt-1 text-sm leading-5 text-primary-foreground/80">Atur barang dan kategori toko Anda</p>
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2.5">
          <div className="cursor-pointer rounded-2xl border bg-card p-3 shadow-[0_2px_8px_-3px_rgba(0,0,0,0.05)] transition-all active:scale-[0.97]">
            <div className="flex min-w-0 items-center gap-2.5">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <HugeiconsIcon icon={PackageIcon} size={18} />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] leading-4 font-semibold text-muted-foreground">Total Barang</p>
                <p className="text-2xl font-extrabold leading-7 tracking-tight text-foreground">{data.stats.totalProducts}</p>
              </div>
            </div>
          </div>

          <div className="cursor-pointer rounded-2xl border bg-card p-3 shadow-[0_2px_8px_-3px_rgba(0,0,0,0.05)] transition-all active:scale-[0.97]">
            <div className="flex min-w-0 items-center gap-2.5">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600">
                <HugeiconsIcon icon={Alert02Icon} size={18} />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] leading-4 font-semibold text-muted-foreground">Stok Menipis</p>
                <p className="text-2xl font-extrabold leading-7 tracking-tight text-foreground">{data.stats.lowStock}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 space-y-4">
          <Link
            href="/admin/barang/daftar"
            className="flex items-center gap-4 rounded-3xl border bg-card p-4 shadow-[0_2px_8px_-3px_rgba(0,0,0,0.05)] transition-all duration-150 active:scale-[0.98] hover:border-border/80"
          >
            <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <HugeiconsIcon icon={PackageIcon} size={26} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-lg font-extrabold leading-6 tracking-tight text-foreground">Barang</p>
              <p className="text-sm font-medium leading-5 text-muted-foreground">Kelola daftar barang</p>
            </div>
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted/60 text-muted-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary">
              <HugeiconsIcon icon={ArrowRight01Icon} size={18} />
            </div>
          </Link>

          <Link
            href="/admin/kategori"
            className="flex items-center gap-4 rounded-3xl border bg-card p-4 shadow-[0_2px_8px_-3px_rgba(0,0,0,0.05)] transition-all duration-150 active:scale-[0.98] hover:border-border/80"
          >
            <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600">
              <HugeiconsIcon icon={TagsIcon} size={26} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-lg font-extrabold leading-6 tracking-tight text-foreground">Kategori</p>
              <p className="text-sm font-medium leading-5 text-muted-foreground">Atur kategori barang</p>
            </div>
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted/60 text-amber-700 transition-colors">
              <HugeiconsIcon icon={ArrowRight01Icon} size={18} />
            </div>
          </Link>
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden lg:flex min-w-0 flex-col gap-3 p-4 pb-28 lg:gap-6 lg:p-6">
        <BarangHeader />
        <BarangStatCards stats={data.stats} />

        <div className="flex min-w-0 flex-col gap-6 xl:flex-row">
          <div className="flex min-w-0 flex-1 flex-col gap-6 overflow-hidden">
            <BarangTable products={data.products} categories={data.categories} />
          </div>

          <div className="flex w-full flex-col gap-6 lg:grid lg:grid-cols-2 xl:flex xl:w-[320px] xl:shrink-0 2xl:w-[350px]">
            <BarangKategoriChart data={data.categoryChartData} total={data.stats.totalProducts} />
            <BarangPopuler products={data.popularProducts} />
          </div>
        </div>
      </div>
    </>
  )
}
