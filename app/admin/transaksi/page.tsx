import { Suspense } from "react"
import { redirect } from "next/navigation"

import { TransaksiHeader } from "@/features/transaksi/components/transaksi-header"
import { TransaksiStatCards } from "@/features/transaksi/components/transaksi-stat-cards"
import { TransaksiTable } from "@/features/transaksi/components/transaksi-table"
import { TransaksiAktivitas } from "@/features/transaksi/components/transaksi-aktivitas"
import { TransaksiMobile } from "@/features/transaksi/components/cashier-transaksi-mobile"
import { getTransaksiPageData } from "@/features/transaksi/server-data"
import { getSessionUser } from "@/lib/server/auth-guards"

export default async function TransaksiPage() {
  const user = await getSessionUser()

  if (!user) {
    redirect("/login")
  }

  if (user.role !== "admin") {
    redirect("/unauthorized")
  }

  const data = await getTransaksiPageData()

  return (
    <div className="flex h-full min-h-0 min-w-0 flex-col gap-3 overflow-hidden bg-slate-50 p-4 lg:min-h-screen lg:overflow-visible lg:bg-transparent lg:p-6 lg:gap-6">
      <div className="hidden lg:block">
        <TransaksiHeader />
      </div>

      <div className="hidden lg:flex lg:flex-col lg:gap-6">
        {/* Stat Cards */}
        <TransaksiStatCards stats={data.stats} />

        {/* Transaction Table */}
        <Suspense><TransaksiTable
          transactions={data.transactions}
          cashierList={data.cashierList}
          detailBasePath="/admin/transaksi"
          actionBasePath="/admin/transaksi"
        /></Suspense>

        {/* Recent Activity */}
        <TransaksiAktivitas activities={data.activities} />
      </div>

      <div className="block min-h-0 flex-1 lg:hidden">
        <Suspense><TransaksiMobile
          transactions={data.transactions}
          stats={data.stats}
          actionBasePath="/admin/transaksi"
          detailBasePath="/admin/transaksi"
        /></Suspense>
      </div>
    </div>
  )
}
