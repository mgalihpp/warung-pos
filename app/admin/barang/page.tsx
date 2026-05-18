import { redirect } from "next/navigation"

import { BarangHeader } from "@/features/barang/components/barang-header"
import { BarangStatCards } from "@/features/barang/components/barang-stat-cards"
import { BarangTable } from "@/features/barang/components/barang-table"
import { BarangKategoriChart } from "@/features/barang/components/barang-kategori-chart"
import { BarangPopuler } from "@/features/barang/components/barang-populer"
import { getBarangPageData } from "@/features/barang/server-data"
import { getSessionUser } from "@/lib/server/auth-guards"

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
    <div className="flex min-w-0 flex-col gap-3 p-4 pb-28 lg:gap-6 lg:p-6">
      {/* Header */}
      <BarangHeader />

      {/* Stat Cards */}
      <BarangStatCards stats={data.stats} />

      {/* Main Content & Right Panel */}
      <div className="flex min-w-0 flex-col gap-6 xl:flex-row">
        {/* Left: Table */}
        <div className="flex min-w-0 flex-1 flex-col gap-6 overflow-hidden">
          <BarangTable products={data.products} categories={data.categories} />
        </div>

        {/* Right Panel */}
        <div className="flex w-full flex-col gap-6 lg:grid lg:grid-cols-2 xl:flex xl:w-[320px] xl:shrink-0 2xl:w-[350px]">
          <BarangKategoriChart data={data.categoryChartData} total={data.stats.totalProducts} />
          <BarangPopuler products={data.popularProducts} />
        </div>
      </div>
    </div>
  )
}
