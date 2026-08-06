import { Suspense } from "react"
import { forbidden, redirect } from "next/navigation"

import { TransaksiHeader } from "@/features/transaksi/components/transaksi-header"
import { TransaksiTable } from "@/features/transaksi/components/transaksi-table"
import { TransaksiMobile } from "@/features/transaksi/components/cashier-transaksi-mobile"
import { getTransaksiPageData } from "@/features/transaksi/server-data"
import { getSessionUser } from "@/lib/server/auth-guards"

export default async function TransaksiPage() {
  const user = await getSessionUser()

  if (!user) {
    redirect("/login")
  }

  if (user.role !== "admin") {
    forbidden()
  }

  const data = await getTransaksiPageData()

  return (
    <div className="flex h-full min-h-0 min-w-0 flex-col gap-3 overflow-hidden bg-background p-4 lg:min-h-screen lg:gap-6 lg:overflow-visible lg:bg-transparent lg:p-6">
      <div className="hidden lg:block">
        <TransaksiHeader />
      </div>

      <div className="hidden lg:flex lg:flex-col lg:gap-6">
        {/* Transaction Table */}
        <Suspense>
          <TransaksiTable
            transactions={data.transactions}
            cashierList={data.cashierList}
            detailBasePath="/admin/transaksi"
            actionBasePath="/admin/transaksi"
          />
        </Suspense>
      </div>

      <div className="block min-h-0 flex-1 lg:hidden">
        <Suspense>
          <TransaksiMobile
            transactions={data.transactions}
            stats={data.stats}
            actionBasePath="/admin/transaksi"
            detailBasePath="/admin/transaksi"
          />
        </Suspense>
      </div>
    </div>
  )
}
