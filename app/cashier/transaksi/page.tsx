import { redirect } from "next/navigation"

import { TransaksiStatCards } from "@/features/transaksi/components/transaksi-stat-cards"
import { TransaksiTable } from "@/features/transaksi/components/transaksi-table"
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
    <div className="flex min-w-0 flex-col gap-3 p-4 lg:gap-6 lg:p-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight lg:text-2xl">Riwayat Transaksi</h1>
        <p className="text-sm text-muted-foreground">Daftar transaksi yang Anda proses.</p>
      </div>

      <TransaksiStatCards stats={data.stats} />

      <TransaksiTable transactions={data.transactions} cashierList={data.cashierList} />
    </div>
  )
}
