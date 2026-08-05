import { Suspense } from "react"
import { redirect } from "next/navigation"

import { BarangMobileList } from "@/features/barang/components/barang-mobile-list"
import { BarangHeader } from "@/features/barang/components/barang-header"
import { BarangKategoriChart } from "@/features/barang/components/barang-kategori-chart"
import { BarangPopuler } from "@/features/barang/components/barang-populer"
import { BarangStatCards } from "@/features/barang/components/barang-stat-cards"
import { BarangTable } from "@/features/barang/components/barang-table"
import { getBarangPageData } from "@/features/barang/server-data"
import { getSessionUser } from "@/lib/server/auth-guards"

export default async function DaftarBarangPage() {
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
      {/* Mobile / Tablet */}
      <Suspense>
        <BarangMobileList
          products={data.products}
          categories={data.categories}
        />
      </Suspense>

      {/* Desktop */}
      <div className="hidden min-w-0 flex-col gap-3 p-4 pb-28 lg:flex lg:gap-6 lg:p-6">
        <BarangHeader />
        <BarangStatCards stats={data.stats} />

        <div className="flex min-w-0 flex-col gap-6 xl:flex-row">
          <div className="flex min-w-0 flex-1 flex-col gap-6 overflow-hidden">
            <Suspense>
              <BarangTable
                products={data.products}
                categories={data.categories}
              />
            </Suspense>
          </div>

          <div className="flex w-full flex-col gap-6 lg:grid lg:grid-cols-2 xl:flex xl:w-[320px] xl:shrink-0 2xl:w-[350px]">
            <BarangKategoriChart
              data={data.categoryChartData}
              total={data.stats.totalProducts}
            />
            <BarangPopuler products={data.popularProducts} />
          </div>
        </div>
      </div>
    </>
  )
}
