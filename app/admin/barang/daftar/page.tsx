import { Suspense } from "react"
import { redirect } from "next/navigation"

import { BarangMobileList } from "@/features/barang/components/barang-mobile-list"
import { BarangHeader } from "@/features/barang/components/barang-header"
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
        <div className="flex min-w-0 flex-col gap-6 overflow-hidden">
          <Suspense>
            <BarangTable
              products={data.products}
              categories={data.categories}
            />
          </Suspense>
        </div>
      </div>
    </>
  )
}
