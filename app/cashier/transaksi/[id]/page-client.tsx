"use client"

import { useCallback } from "react"
import { useRouter } from "next/navigation"

import { CashierTransaksiDetailMobile } from "@/features/transaksi/components/cashier-transaksi-detail-mobile"
import type { TransactionDetail } from "@/features/transaksi/hooks/use-transaksi-queries"
import { PageShell } from "@/features/shared/components/page-shell"

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
    <PageShell
      width="narrow"
      className="h-full min-h-0 overflow-y-auto bg-slate-50 lg:bg-transparent"
      onBack={handleBack}
      title="Detail Transaksi"
      subtitle={`Rincian transaksi ${initialData.transactionNumber}`}
    >
      <CashierTransaksiDetailMobile
        transactionId={transactionId}
        initialData={initialData}
        onBack={handleBack}
      />
    </PageShell>
  )
}
