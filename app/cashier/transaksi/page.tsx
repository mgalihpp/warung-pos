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
      <div className="flex min-w-0 flex-col gap-3 p-4 lg:gap-6 lg:p-6">
        <div>
          <h1 className="text-xl font-bold tracking-tight lg:text-2xl">Riwayat Transaksi</h1>
          <p className="text-sm text-muted-foreground">Daftar transaksi yang Anda proses.</p>
        </div>
        <div className="flex flex-1 items-center justify-center py-20">
          <p className="text-sm text-destructive">Gagal memuat data transaksi. Silakan coba lagi.</p>
        </div>
      </div>
    )
  }

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
