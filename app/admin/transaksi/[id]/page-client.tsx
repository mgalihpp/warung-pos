"use client"

import { useCallback } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { HugeiconsIcon } from "@hugeicons/react"
import { Delete02Icon, Edit02Icon } from "@hugeicons/core-free-icons"

import { Button } from "@/components/ui/button"
import { CashierTransaksiDetailMobile } from "@/features/transaksi/components/cashier-transaksi-detail-mobile"
import type { TransactionDetail } from "@/features/transaksi/hooks/use-transaksi-queries"
import { PageShell } from "@/features/shared/components/page-shell"

export function AdminTransaksiDetailPageClient({
  transactionId,
  initialData,
}: {
  transactionId: string
  initialData: TransactionDetail
}) {
  const router = useRouter()
  const handleBack = useCallback(() => router.push("/admin/transaksi"), [router])

  return (
    <PageShell
      width="narrow"
      className="h-full min-h-0 overflow-y-auto bg-slate-50 lg:bg-transparent"
      onBack={handleBack}
      title="Detail Transaksi"
      subtitle={`Rincian transaksi ${initialData.transactionNumber}`}
      actions={
        <>
          <Button
            type="button"
            variant="outline"
            className="gap-2 border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive"
            onClick={() => window.dispatchEvent(new Event("transaksi-delete-request"))}
          >
            <HugeiconsIcon icon={Delete02Icon} size={16} />
            Hapus
          </Button>
          <Button asChild className="gap-2">
            <Link href={`/admin/transaksi/${transactionId}/edit`}>
              <HugeiconsIcon icon={Edit02Icon} size={16} />
              Edit Transaksi
            </Link>
          </Button>
        </>
      }
    >
      <CashierTransaksiDetailMobile
        transactionId={transactionId}
        initialData={initialData}
        onBack={handleBack}
        actionBasePath="/admin/transaksi"
      />
    </PageShell>
  )
}
