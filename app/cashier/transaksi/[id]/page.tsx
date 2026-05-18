"use client"

import { use, useCallback } from "react"
import { useRouter } from "next/navigation"

import { CashierTransaksiDetailMobile } from "@/features/transaksi/components/cashier-transaksi-detail-mobile"

export default function CashierTransaksiDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()
  const handleBack = useCallback(() => router.push("/cashier/transaksi"), [router])

  return (
    <div className="h-full min-h-0 overflow-y-auto bg-slate-50 p-4 lg:bg-transparent lg:p-6">
      <div className="mx-auto max-w-3xl">
        <CashierTransaksiDetailMobile transactionId={id} onBack={handleBack} />
      </div>
    </div>
  )
}
