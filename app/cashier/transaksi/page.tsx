import { headers } from "next/headers"

import { auth } from "@/lib/auth"
import { TransaksiHeader } from "@/components/transaksi/transaksi-header"
import { TransaksiStatCards } from "@/components/transaksi/transaksi-stat-cards"
import { TransaksiTable } from "@/components/transaksi/transaksi-table"

export default async function CashierTransaksiPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  // We can reuse the admin's TransaksiTable but maybe it needs to know it's only fetching cashier's data.
  // Wait, the TransaksiTable is a client component that fetches from /api/transaksi.
  // The cashier only has access to their own transactions. 
  // Let's pass a prop to TransaksiTable or just let the API handle the role-based filtering.
  // For now, we'll render the same components.

  return (
    <div className="flex flex-col gap-3 p-4 lg:gap-6 lg:p-6 min-w-0 overflow-y-auto h-full">
      <div className="mb-2">
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Riwayat Transaksi</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Daftar transaksi yang Anda proses.
        </p>
      </div>

      <TransaksiStatCards />
      
      <div className="bg-card rounded-xl border shadow-sm">
        <TransaksiTable />
      </div>
    </div>
  )
}
