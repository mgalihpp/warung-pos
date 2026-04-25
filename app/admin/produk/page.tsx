"use client"

import { useProducts } from "@/components/produk/use-produk-queries"
import { ProdukHeader } from "@/components/produk/produk-header"
import { ProdukStatCards } from "@/components/produk/produk-stat-cards"
import { ProdukTable } from "@/components/produk/produk-table"
import { ProdukKategoriChart } from "@/components/produk/produk-kategori-chart"
import { ProdukPopuler } from "@/components/produk/produk-populer"
import ProdukLoading from "./loading"

export default function ProdukPage() {
  const { data, isLoading, error } = useProducts()

  if (isLoading) {
    return <ProdukLoading />
  }

  if (error || !data) {
    return (
      <div className="flex flex-col gap-3 p-4 lg:gap-6 lg:p-6">
        <div>
          <h1 className="text-xl font-bold tracking-tight lg:text-2xl">Manajemen Produk</h1>
          <p className="text-sm text-muted-foreground">Kelola produk, kategori, dan stok warung Anda</p>
        </div>
        <div className="flex flex-1 items-center justify-center py-20">
          <p className="text-sm text-destructive">Gagal memuat data. Silakan coba lagi.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-w-0 flex-col gap-3 p-4 lg:gap-6 lg:p-6">
      {/* Header */}
      <ProdukHeader categories={data.categories} />

      {/* Stat Cards */}
      <ProdukStatCards stats={data.stats} />

      {/* Main Content & Right Panel */}
      <div className="flex min-w-0 flex-col gap-6 xl:flex-row">
        {/* Left: Table */}
        <div className="flex min-w-0 flex-1 flex-col gap-6 overflow-hidden">
          <ProdukTable products={data.products} categories={data.categories} />
        </div>

        {/* Right Panel */}
        <div className="flex w-full flex-col gap-6 lg:grid lg:grid-cols-2 xl:flex xl:w-[320px] xl:shrink-0 2xl:w-[350px]">
          <ProdukKategoriChart data={data.categoryChartData} total={data.stats.totalProducts} />
          <ProdukPopuler products={data.popularProducts} />
        </div>
      </div>
    </div>
  )
}
