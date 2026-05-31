"use client"

import { useCallback } from "react"
import { useRouter } from "next/navigation"

import { CashierTransaksiDetailMobile } from "@/features/transaksi/components/cashier-transaksi-detail-mobile"
import type { TransactionDetail } from "@/features/transaksi/hooks/use-transaksi-queries"

export function CashierTransaksiDetailPageClient({
  transactionId,
  initialData,
}: {
  transactionId: string
  initialData: TransactionDetail
}) {
  const router = useRouter()
  const handleBack = useCallback(() => router.push("/cashier/transaksi"), [router])

  return (
    <CashierTransaksiDetailMobile
      transactionId={transactionId}
      initialData={initialData}
      onBack={handleBack}
    />
  )
}
