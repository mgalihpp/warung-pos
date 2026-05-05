import { redirect } from "next/navigation"

import { TransaksiHeader } from "@/features/transaksi/components/transaksi-header"
import { TransaksiStatCards } from "@/features/transaksi/components/transaksi-stat-cards"
import { TransaksiTable } from "@/features/transaksi/components/transaksi-table"
import { TransaksiAktivitas } from "@/features/transaksi/components/transaksi-aktivitas"
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
    <div className="flex min-w-0 flex-col gap-3 p-4 pb-28 lg:gap-6 lg:p-6 xl:pb-6">
      {/* Header */}
      <TransaksiHeader />

      {/* Stat Cards */}
      <TransaksiStatCards stats={data.stats} />

      {/* Transaction Table */}
      <TransaksiTable transactions={data.transactions} cashierList={data.cashierList} />

      {/* Recent Activity */}
      <TransaksiAktivitas activities={data.activities} />
    </div>
  )
}
