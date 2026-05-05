import { redirect } from "next/navigation"

import { ProdukHeader } from "@/features/produk/components/produk-header"
import { ProdukStatCards } from "@/features/produk/components/produk-stat-cards"
import { ProdukTable } from "@/features/produk/components/produk-table"
import { ProdukKategoriChart } from "@/features/produk/components/produk-kategori-chart"
import { ProdukPopuler } from "@/features/produk/components/produk-populer"
import { getProdukPageData } from "@/features/produk/server-data"
import { getSessionUser } from "@/lib/server/auth-guards"

export default async function ProdukPage() {
  const user = await getSessionUser()

  if (!user) {
    redirect("/login")
  }

  if (user.role !== "admin") {
    redirect("/unauthorized")
  }

  const data = await getProdukPageData()

  return (
    <div className="flex min-w-0 flex-col gap-3 p-4 pb-28 lg:gap-6 lg:p-6">
      {/* Header */}
      <ProdukHeader />

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
