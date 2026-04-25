import { TransaksiHeader } from "@/components/transaksi/transaksi-header"
import { TransaksiStatCards } from "@/components/transaksi/transaksi-stat-cards"
import { TransaksiTable } from "@/components/transaksi/transaksi-table"
import { TransaksiAktivitas } from "@/components/transaksi/transaksi-aktivitas"

export default function TransaksiPage() {
  return (
    <div className="flex flex-col gap-3 p-4 lg:gap-6 lg:p-6 min-w-0">
      {/* Header */}
      <TransaksiHeader />

      {/* Stat Cards */}
      <TransaksiStatCards />

      {/* Transaction Table */}
      <TransaksiTable />

      {/* Recent Activity */}
      <TransaksiAktivitas />
    </div>
  )
}
