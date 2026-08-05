import { Suspense } from "react"
import { redirect } from "next/navigation"

import { KategoriHeader } from "@/features/kategori/components/kategori-header"
import { KategoriMobileList } from "@/features/kategori/components/kategori-mobile-list"
import { KategoriStatCards } from "@/features/kategori/components/kategori-stat-cards"
import { KategoriTable } from "@/features/kategori/components/kategori-table"
import { getKategoriPageData } from "@/features/kategori/server-data"
import { getSessionUser } from "@/lib/server/auth-guards"

export default async function KategoriPage() {
  const user = await getSessionUser()

  if (!user) {
    redirect("/login")
  }

  if (user.role !== "admin") {
    redirect("/unauthorized")
  }

  const data = await getKategoriPageData()

  return (
    <>
      <Suspense>
        <KategoriMobileList categories={data.categories} />
      </Suspense>

      <div className="hidden min-w-0 flex-col gap-3 p-4 pb-28 lg:flex lg:gap-6 lg:p-6">
        <KategoriHeader />
        <KategoriStatCards stats={data.stats} />
        <Suspense>
          <KategoriTable categories={data.categories} />
        </Suspense>
      </div>
    </>
  )
}
