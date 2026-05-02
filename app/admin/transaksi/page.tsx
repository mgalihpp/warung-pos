"use client"

import { useTransactions } from "@/features/transaksi/hooks/use-transaksi-queries"
import { TransaksiHeader } from "@/features/transaksi/components/transaksi-header"
import { TransaksiStatCards } from "@/features/transaksi/components/transaksi-stat-cards"
import { TransaksiTable } from "@/features/transaksi/components/transaksi-table"
import { TransaksiAktivitas } from "@/features/transaksi/components/transaksi-aktivitas"
import TransaksiLoading from "./loading"

export default function TransaksiPage() {
  const { data, isLoading, error } = useTransactions()

  if (isLoading) {
    return <TransaksiLoading />
  }

  if (error || !data) {
    return (
      <div className="flex flex-col gap-3 p-4 lg:gap-6 lg:p-6">
        <div>
          <h1 className="text-xl font-bold tracking-tight lg:text-2xl">Manajemen Transaksi</h1>
          <p className="text-sm text-muted-foreground">Pantau, cari, dan kelola seluruh transaksi warung Anda</p>
        </div>
        <div className="flex flex-1 items-center justify-center py-20">
          <p className="text-sm text-destructive">Gagal memuat data transaksi. Silakan coba lagi.</p>
        </div>
      </div>
    )
  }

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
