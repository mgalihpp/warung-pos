"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import { CheckmarkCircle02Icon } from "@hugeicons/core-free-icons"
import { formatRupiah } from "@/lib/format-currency"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"

export type TransactionReceipt = {
  id: string
  transactionNumber: string
  cashierName: string
  paymentMethod: string
  subtotal: number
  total: number
  amountPaid: number
  change: number
  notes: string | null
  createdAt: string
  items: Array<{
    productName: string
    unitPrice: number
    quantity: number
    subtotal: number
  }>
}

type PosReceiptDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  transaction: TransactionReceipt | null
  onNewTransaction: () => void
}

function getPaymentMethodLabel(method: string): string {
  switch (method) {
    case "CASH":
      return "Tunai"
    case "QRIS_MANUAL":
      return "QRIS"
    case "MANUAL_TRANSFER":
      return "Transfer Bank"
    default:
      return method
  }
}

function formatDate(iso: string): string {
  const date = new Date(iso)
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function PosReceiptDialog({
  open,
  onOpenChange,
  transaction,
  onNewTransaction,
}: PosReceiptDialogProps) {
  if (!transaction) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader className="sr-only">
          <DialogTitle className="sr-only">Ringkasan Pembayaran</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 p-4 print:p-0" id="receipt-print">
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-3 flex size-12 items-center justify-center rounded-full bg-green-100 text-green-600 print:hidden">
              <span className="absolute -top-2 -left-2 text-[10px] leading-none font-bold text-amber-500">
                ✦
              </span>
              <span className="absolute -top-1 -right-1 text-[10px] leading-none font-bold text-amber-400">
                ✧
              </span>
              <span className="absolute -bottom-2 -left-1 text-[10px] leading-none font-bold text-amber-500">
                ✧
              </span>
              <span className="absolute -right-2 -bottom-1 text-[10px] leading-none font-bold text-amber-400">
                ✦
              </span>
              <HugeiconsIcon icon={CheckmarkCircle02Icon} size={24} />
            </div>

            <h3 className="text-base font-bold text-foreground">
              Transaksi Berhasil
            </h3>
            <p className="text-xs text-muted-foreground">
              {formatDate(transaction.createdAt)}
            </p>
          </div>

          <Separator className="bg-border/70" />

          <div className="space-y-1.5 rounded-2xl bg-muted/40 p-3 text-xs">
            <div className="flex justify-between gap-3 py-1">
              <span className="text-muted-foreground">No. Transaksi</span>
              <span className="text-right font-medium text-foreground">
                {transaction.transactionNumber}
              </span>
            </div>
            <div className="flex justify-between gap-3 py-1">
              <span className="text-muted-foreground">Kasir</span>
              <span className="text-right font-medium text-foreground">
                {transaction.cashierName}
              </span>
            </div>
            <div className="flex justify-between gap-3 py-1">
              <span className="text-muted-foreground">Pembayaran</span>
              <span className="text-right font-medium text-foreground">
                {getPaymentMethodLabel(transaction.paymentMethod)}
              </span>
            </div>
          </div>

          <Separator className="bg-border/70" />

          <div className="rounded-2xl bg-muted/40 p-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">Total</span>
              <span className="text-lg font-bold text-primary tabular-nums">
                {formatRupiah(transaction.total)}
              </span>
            </div>
            {transaction.paymentMethod === "CASH" && (
              <>
                <div className="mt-1 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Dibayar</span>
                  <span className="text-foreground tabular-nums">
                    {formatRupiah(transaction.amountPaid)}
                  </span>
                </div>
                <div className="mt-1 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Kembalian</span>
                  <span className="font-medium text-emerald-600 tabular-nums">
                    {formatRupiah(transaction.change)}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="w-full px-4 pt-0 pb-4 print:hidden">
          <button
            onClick={onNewTransaction}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-2 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Tutup
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
