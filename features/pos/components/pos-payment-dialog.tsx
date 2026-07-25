"use client"

import { useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Money01Icon,
  QrCodeIcon,
  BankIcon,
  NoteIcon,
} from "@hugeicons/core-free-icons"
import {
  formatRupiah,
  formatNumber,
  parseRupiahInput,
} from "@/lib/format-currency"
import {
  useCartStore,
  useCartSubtotal,
  useCartChange,
  type PaymentMethod,
} from "@/features/pos/hooks/use-cart"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

const QUICK_AMOUNTS = [2000, 5000, 10000, 20000, 50000, 100000]

const PAYMENT_METHODS: {
  value: PaymentMethod
  label: string
  icon: typeof Money01Icon
}[] = [
  { value: "CASH", label: "Tunai", icon: Money01Icon },
  { value: "QRIS_MANUAL", label: "QRIS", icon: QrCodeIcon },
  { value: "MANUAL_TRANSFER", label: "Transfer", icon: BankIcon },
]

type PosPaymentDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  isProcessing: boolean
}

export function PosPaymentDialog({
  open,
  onOpenChange,
  onConfirm,
  isProcessing,
}: PosPaymentDialogProps) {
  const items = useCartStore((s) => s.items)
  const paymentMethod = useCartStore((s) => s.paymentMethod)
  const amountPaid = useCartStore((s) => s.amountPaid)
  const notes = useCartStore((s) => s.notes)
  const setPaymentMethod = useCartStore((s) => s.setPaymentMethod)
  const setAmountPaid = useCartStore((s) => s.setAmountPaid)
  const setNotes = useCartStore((s) => s.setNotes)

  const subtotal = useCartSubtotal()
  const change = useCartChange()

  const [showNotes, setShowNotes] = useState(false)

  const handleAmountChange = (value: string) => {
    setAmountPaid(parseRupiahInput(value))
  }

  const handleQuickAmount = (amount: number) => {
    setAmountPaid(amountPaid + amount)
  }

  const handleExactAmount = () => {
    setAmountPaid(subtotal)
  }

  const handleResetAmount = () => {
    setAmountPaid(0)
  }

  const canPay =
    items.length > 0 &&
    (paymentMethod !== "CASH" || amountPaid >= subtotal) &&
    !isProcessing

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Pembayaran</DialogTitle>
          <DialogDescription>
            Pilih metode pembayaran dan selesaikan transaksi.
          </DialogDescription>
        </DialogHeader>

        {/* Total Banner */}
        <div className="rounded-2xl border border-primary/20 bg-primary/10 px-5 py-4 text-center">
          <p className="text-xs font-medium text-primary/70">Total Pembayaran</p>
          <p className="mt-1 text-3xl font-extrabold tracking-tight text-primary">
            {formatRupiah(subtotal)}
          </p>
        </div>

        {/* Payment Method */}
        <div>
          <span className="mb-2 block text-xs font-semibold text-muted-foreground">
            Metode Pembayaran
          </span>
          <div className="grid grid-cols-3 gap-2">
            {PAYMENT_METHODS.map((method) => (
              <button
                key={method.value}
                onClick={() => setPaymentMethod(method.value)}
                className={`flex items-center justify-center gap-1.5 rounded-lg border py-2.5 text-xs font-semibold transition-colors ${
                  paymentMethod === method.value
                    ? "border-primary bg-primary/10 text-primary"
                    : "bg-card text-muted-foreground hover:bg-accent"
                }`}
              >
                <HugeiconsIcon icon={method.icon} size={14} />
                {method.label}
              </button>
            ))}
          </div>
        </div>

        {/* Cash Payment Details */}
        {paymentMethod === "CASH" && (
          <>
            {/* Quick amount buttons */}
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground">
                  Nominal Cepat
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleExactAmount}
                    className="text-[10px] font-semibold text-primary hover:underline"
                  >
                    Uang Pas
                  </button>
                  <button
                    onClick={handleResetAmount}
                    className="text-[10px] font-semibold text-muted-foreground hover:underline"
                  >
                    Reset
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {QUICK_AMOUNTS.map((amount) => (
                  <button
                    key={amount}
                    onClick={() => handleQuickAmount(amount)}
                    className="rounded-lg border py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-accent"
                  >
                    +{formatNumber(amount)}
                  </button>
                ))}
              </div>
            </div>

            {/* Amount & Change */}
            <div className="flex gap-3">
              <div className="flex flex-1 flex-col">
                <span className="mb-1 text-xs font-semibold text-muted-foreground">
                  Uang Diterima
                </span>
                <div className="relative">
                  <span className="absolute top-1/2 left-3 -translate-y-1/2 text-sm font-medium text-muted-foreground">
                    Rp
                  </span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={amountPaid > 0 ? formatNumber(amountPaid) : ""}
                    onChange={(e) => handleAmountChange(e.target.value)}
                    className="w-full rounded-lg border bg-card py-2 pr-3 pl-8 text-sm font-bold text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
                    placeholder="0"
                  />
                </div>
              </div>
              <div className="flex flex-1 flex-col">
                <span className="mb-1 text-xs font-semibold text-muted-foreground">
                  Kembalian
                </span>
                <div
                  className={`flex w-full items-center justify-center rounded-lg border px-3 py-2 text-sm font-bold ${
                    amountPaid === 0
                      ? "border-transparent bg-muted text-muted-foreground"
                      : change >= 0
                        ? "border-primary/30 bg-primary/10 text-primary"
                        : "border-destructive/30 bg-destructive/10 text-destructive"
                  }`}
                >
                  {amountPaid === 0
                    ? "Rp 0"
                    : change >= 0
                      ? formatRupiah(change)
                      : `Kurang ${formatRupiah(Math.abs(change))}`}
                </div>
              </div>
            </div>
          </>
        )}

        {/* Notes toggle */}
        <div>
          <button
            onClick={() => setShowNotes(!showNotes)}
            className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <HugeiconsIcon icon={NoteIcon} size={14} />
            {showNotes ? "Sembunyikan catatan" : "Tambah catatan"}
          </button>
          {showNotes && (
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Catatan transaksi (opsional)..."
              rows={2}
              className="mt-2 w-full resize-none rounded-lg border bg-card px-3 py-2 text-xs text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
            />
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2">
          <Button
            type="button"
            onClick={onConfirm}
            disabled={!canPay}
            loading={isProcessing}
            loadingText="Memproses..."
            className="w-full rounded-xl font-bold shadow-sm"
          >
            Bayar {formatRupiah(subtotal)}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isProcessing}
            className="w-full rounded-xl font-bold shadow-sm"
          >
            Batal
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
