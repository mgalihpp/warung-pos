"use client"

import { useTransactions } from "@/features/transaksi/hooks/use-transaksi-queries"
import { TransaksiStatCards } from "@/features/transaksi/components/transaksi-stat-cards"
import { TransaksiTable } from "@/features/transaksi/components/transaksi-table"
import TransaksiLoading from "@/features/transaksi/components/transaksi-loading"

export default function CashierTransaksiPage() {
  const { data, isLoading, error } = useTransactions()

  if (isLoading) {
    return <TransaksiLoading />
  }

  if (error || !data) {
    return (
      <div className="flex flex-1 flex-col gap-3 bg-muted/40 p-4 lg:gap-6 lg:p-6 min-w-0 min-h-0 overflow-y-auto">
        <div className="mb-2">
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Riwayat Transaksi</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Daftar transaksi yang Anda proses.
          </p>
        </div>
        <div className="flex flex-1 items-center justify-center py-20">
          <p className="text-sm text-destructive">Gagal memuat data transaksi. Silakan coba lagi.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-3 bg-muted/40 p-4 lg:gap-6 lg:p-6 min-w-0 min-h-0 overflow-y-auto">
      <div className="mb-2">
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Riwayat Transaksi</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Daftar transaksi yang Anda proses.
        </p>
      </div>

      <TransaksiStatCards stats={data.stats} />

      <TransaksiTable transactions={data.transactions} cashierList={data.cashierList} />
    </div>
  )
}
