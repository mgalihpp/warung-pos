import { Suspense } from "react"
import { redirect } from "next/navigation"

import { TransaksiTable } from "@/features/transaksi/components/transaksi-table"
import { CashierTransaksiMobile } from "@/features/transaksi/components/cashier-transaksi-mobile"
import { getTransaksiPageData } from "@/features/transaksi/server-data"
import { getSessionUser } from "@/lib/server/auth-guards"

export default async function CashierTransaksiPage() {
  const user = await getSessionUser()

  if (!user) {
    redirect("/login")
  }

  if (user.role !== "cashier" && user.role !== "admin") {
    redirect("/unauthorized")
  }

  const data = await getTransaksiPageData()

  return (
    <div className="flex h-full min-h-0 min-w-0 flex-col gap-3 overflow-hidden bg-background p-4 lg:min-h-screen lg:gap-6 lg:overflow-visible lg:bg-transparent lg:p-6">
      <div className="hidden lg:block">
        <h1 className="text-xl font-bold tracking-tight lg:text-2xl">
          Riwayat Transaksi
        </h1>
        <p className="text-sm text-muted-foreground">
          Daftar transaksi yang Anda proses.
        </p>
      </div>

      <div className="hidden lg:flex lg:flex-col lg:gap-6">
        <Suspense>
          <TransaksiTable
            transactions={data.transactions}
            cashierList={data.cashierList}
            detailBasePath="/cashier/transaksi"
          />
        </Suspense>
      </div>

      <div className="block min-h-0 flex-1 lg:hidden">
        <Suspense>
          <CashierTransaksiMobile
            transactions={data.transactions}
            stats={data.stats}
            detailBasePath="/cashier/transaksi"
          />
        </Suspense>
      </div>
    </div>
  )
}
