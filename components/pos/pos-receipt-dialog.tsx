"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import {
  CheckmarkCircle02Icon,
  PrinterIcon,
  PlusSignIcon,
} from "@hugeicons/core-free-icons"
import { formatRupiah } from "@/lib/format-currency"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export type TransactionReceipt = {
  id: string
  invoiceNumber: string
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

  const handlePrint = () => {
    window.print()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="sr-only">Struk Pembayaran</DialogTitle>
        </DialogHeader>

        {/* Receipt Content */}
        <div className="flex flex-col items-center print:p-4" id="receipt-print">
          {/* Success Icon */}
          <div className="flex size-16 items-center justify-center rounded-full bg-green-100 text-green-600 mb-3 print:hidden">
            <HugeiconsIcon icon={CheckmarkCircle02Icon} size={32} />
          </div>

          <h3 className="text-lg font-bold text-foreground mb-1">Pembayaran Berhasil!</h3>
          <p className="text-sm text-muted-foreground mb-4">{formatDate(transaction.createdAt)}</p>

          {/* Store Info */}
          <div className="w-full text-center border-b border-dashed pb-3 mb-3">
            <p className="font-bold text-foreground">Warung Sembako</p>
            <p className="text-xs text-muted-foreground">Terima kasih atas kunjungan Anda</p>
          </div>

          {/* Invoice Info */}
          <div className="w-full grid grid-cols-2 gap-1 text-xs border-b border-dashed pb-3 mb-3">
            <span className="text-muted-foreground">No. Invoice</span>
            <span className="text-right font-medium text-foreground">
              {transaction.invoiceNumber}
            </span>
            <span className="text-muted-foreground">Kasir</span>
            <span className="text-right font-medium text-foreground">
              {transaction.cashierName}
            </span>
            <span className="text-muted-foreground">Pembayaran</span>
            <span className="text-right font-medium text-foreground">
              {getPaymentMethodLabel(transaction.paymentMethod)}
            </span>
          </div>

          {/* Items */}
          <div className="w-full border-b border-dashed pb-3 mb-3">
            <div className="flex flex-col gap-2">
              {transaction.items.map((item, idx) => (
                <div key={idx} className="flex justify-between text-xs">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">{item.productName}</p>
                    <p className="text-muted-foreground">
                      {item.quantity} × {formatRupiah(item.unitPrice)}
                    </p>
                  </div>
                  <span className="font-medium text-foreground shrink-0 ml-2">
                    {formatRupiah(item.subtotal)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Totals */}
          <div className="w-full flex flex-col gap-1.5 text-sm border-b border-dashed pb-3 mb-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium text-foreground">{formatRupiah(transaction.subtotal)}</span>
            </div>
            <div className="flex justify-between font-bold text-base">
              <span className="text-foreground">Total</span>
              <span className="text-primary">{formatRupiah(transaction.total)}</span>
            </div>
            {transaction.paymentMethod === "CASH" && (
              <>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Dibayar</span>
                  <span className="font-medium text-foreground">
                    {formatRupiah(transaction.amountPaid)}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Kembalian</span>
                  <span className="font-bold text-primary">{formatRupiah(transaction.change)}</span>
                </div>
              </>
            )}
          </div>

          {/* Notes */}
          {transaction.notes && (
            <div className="w-full text-xs text-muted-foreground bg-muted/50 rounded-lg p-2 mb-3">
              <span className="font-medium">Catatan:</span> {transaction.notes}
            </div>
          )}

          {/* Actions */}
          <div className="w-full flex flex-col gap-2 print:hidden">
            <button
              onClick={handlePrint}
              className="w-full border rounded-xl py-2.5 flex items-center justify-center gap-2 text-sm font-semibold text-foreground hover:bg-accent transition-colors"
            >
              <HugeiconsIcon icon={PrinterIcon} size={16} />
              Cetak Struk
            </button>
            <button
              onClick={onNewTransaction}
              className="w-full bg-primary text-primary-foreground rounded-xl py-2.5 flex items-center justify-center gap-2 text-sm font-bold hover:bg-primary/90 transition-colors"
            >
              <HugeiconsIcon icon={PlusSignIcon} size={16} />
              Transaksi Baru
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
