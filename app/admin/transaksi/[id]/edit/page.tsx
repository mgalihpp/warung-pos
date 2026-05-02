"use client"

import { use } from "react"
import { useTransactionDetail } from "@/features/transaksi/hooks/use-transaksi-queries"
import { TransaksiEditPage } from "@/features/transaksi/components/transaksi-edit-page"
import { notFound } from "next/navigation"

export default function EditTransaksiPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const { data, isLoading } = useTransactionDetail(id)

  if (isLoading || !data) {
    return <EditTransaksiSkeleton />
  }

  if (!data.id) {
    notFound()
  }

  return <TransaksiEditPage data={data} basePath="/admin/transaksi" />
}

function EditTransaksiSkeleton() {
  return (
    <div className="flex min-w-0 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="mx-auto w-full max-w-4xl space-y-2">
        <div className="h-8 w-48 animate-pulse rounded-lg bg-muted" />
        <div className="h-4 w-72 animate-pulse rounded-lg bg-muted" />
      </div>
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 lg:flex-row">
        <div className="flex-1 space-y-6">
          <div className="h-64 animate-pulse rounded-xl bg-muted" />
          <div className="h-32 animate-pulse rounded-xl bg-muted" />
        </div>
        <div className="w-full space-y-6 lg:w-[340px]">
          <div className="h-48 animate-pulse rounded-xl bg-muted" />
          <div className="h-64 animate-pulse rounded-xl bg-muted" />
        </div>
      </div>
    </div>
  )
}
