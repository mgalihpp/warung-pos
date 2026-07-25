"use client"

import { useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Money01Icon,
  QrCodeIcon,
  BankIcon,
  NoteIcon,
  CheckmarkCircle02Icon,
  Invoice01Icon,
  ArrowDown01Icon,
} from "@hugeicons/core-free-icons"
import { Button } from "@/components/ui/button"
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

const QUICK_AMOUNTS = [
  { label: "Uang Pas", value: "exact" as const },
  { label: "Rp 50.000", value: 50000 },
  { label: "Rp 100.000", value: 100000 },
]

const PAYMENT_METHODS: {
  value: PaymentMethod
  label: string
  icon: typeof Money01Icon
}[] = [
  { value: "CASH", label: "Tunai", icon: Money01Icon },
  { value: "QRIS_MANUAL", label: "QRIS", icon: QrCodeIcon },
  { value: "MANUAL_TRANSFER", label: "Transfer", icon: BankIcon },
]

type Props = {
  onPayment: () => void
  isProcessing: boolean
}

export function PosMobilePayment({ onPayment, isProcessing }: Props) {
  const paymentMethod = useCartStore((s) => s.paymentMethod)
  const amountPaid = useCartStore((s) => s.amountPaid)
  const notes = useCartStore((s) => s.notes)
  const setPaymentMethod = useCartStore((s) => s.setPaymentMethod)
  const setAmountPaid = useCartStore((s) => s.setAmountPaid)
  const setNotes = useCartStore((s) => s.setNotes)
  const items = useCartStore((s) => s.items)

  const subtotal = useCartSubtotal()
  const change = useCartChange()

  const [showNotes, setShowNotes] = useState(false)
  const [showDetails, setShowDetails] = useState(true)

  const handleAmountChange = (value: string) => {
    const num = parseRupiahInput(value)
    setAmountPaid(num)
  }

  const handleQuickAmount = (item: (typeof QUICK_AMOUNTS)[number]) => {
    if (item.value === "exact") {
      setAmountPaid(subtotal)
    } else {
      const newAmount = item.value as number
      setAmountPaid(newAmount)
    }
  }

  const canPay =
    items.length > 0 &&
    (paymentMethod !== "CASH" || amountPaid >= subtotal) &&
    !isProcessing

  return (
    <div className="flex h-full flex-col">
      {/* Scrollable Content */}
      <div className="scrollbar-thin flex-1 overflow-y-auto">
        {/* Total Banner */}
        <div className="mx-4 mt-4 rounded-2xl bg-primary px-5 py-5 text-center text-primary-foreground">
          <p className="text-xs font-medium opacity-80">Total Pembayaran</p>
          <p className="mt-1 text-3xl font-extrabold tracking-tight">
            {formatRupiah(subtotal)}
          </p>
        </div>

        {/* Nominal Pembayaran (Cash only) */}
        {paymentMethod === "CASH" && (
          <div className="mx-4 mt-5">
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
              <span className="flex size-6 items-center justify-center rounded-full bg-muted text-muted-foreground">$</span>
              Nominal Pembayaran
            </div>
            <div className="rounded-xl border bg-card px-4 py-3">
              <div className="relative">
                <span className="absolute top-1/2 left-0 -translate-y-1/2 text-sm font-medium text-muted-foreground">Rp</span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={amountPaid > 0 ? formatNumber(amountPaid) : ""}
                  onChange={(e) => handleAmountChange(e.target.value)}
                  className="w-full bg-transparent py-1 pl-7 text-base font-bold text-foreground outline-none"
                  placeholder="0"
                />
              </div>
            </div>

            {/* Quick Amount Buttons */}
            <div className="mt-3 grid grid-cols-3 gap-2">
              {QUICK_AMOUNTS.map((item) => (
                <button
                  key={item.label}
                  onClick={() => handleQuickAmount(item)}
                  className={`flex flex-col items-center gap-1 rounded-xl border py-3 text-xs font-semibold transition-all active:scale-95 ${
                    (item.value === "exact" && amountPaid === subtotal) ||
                    (typeof item.value === "number" && amountPaid === item.value)
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-card text-muted-foreground"
                  }`}
                >
                  {item.value === "exact" ? (
                    <HugeiconsIcon icon={CheckmarkCircle02Icon} size={20} className="text-emerald-500" />
                  ) : (
                    <HugeiconsIcon icon={Money01Icon} size={20} />
                  )}
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Metode Pembayaran */}
        <div className="mx-4 mt-5">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
            <HugeiconsIcon icon={Money01Icon} size={16} className="text-muted-foreground" />
            Metode Pembayaran
          </div>
          <div className="grid grid-cols-3 gap-2">
            {PAYMENT_METHODS.map((method) => (
              <button
                key={method.value}
                onClick={() => setPaymentMethod(method.value)}
                className={`flex items-center justify-center gap-2 rounded-xl border py-3 text-sm font-semibold transition-all active:scale-95 ${
                  paymentMethod === method.value
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-muted-foreground"
                }`}
              >
                <HugeiconsIcon icon={method.icon} size={16} />
                {method.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mx-4 mt-5 mb-4">
          {/* Notes */}
          <button
            onClick={() => setShowNotes(!showNotes)}
            className="mt-3 flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
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
              className="mt-2 w-full resize-none rounded-xl border bg-card px-3 py-2 text-xs text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
            />
          )}
        </div>
      </div>

      {/* Payment summary + CTA */}
      <div className="shrink-0 bg-background px-4 pt-3 pb-4">
        <div className="rounded-2xl border bg-card p-4 shadow-lg shadow-black/5">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="flex w-full items-center justify-between text-sm font-bold text-foreground"
          >
            <div className="flex items-center gap-2">
              <HugeiconsIcon icon={Invoice01Icon} size={16} className="text-primary" />
              Rincian Pembayaran
            </div>
            <div className="flex items-center gap-2">
              {!showDetails && (
                <span className="font-extrabold text-primary">{formatRupiah(subtotal)}</span>
              )}
              <HugeiconsIcon
                icon={ArrowDown01Icon}
                size={16}
                className={`text-muted-foreground transition-transform ${showDetails ? "rotate-180" : ""}`}
              />
            </div>
          </button>

          {showDetails && (
            <div className="mt-3 rounded-xl bg-muted/45 px-4 py-3">
              <div className="flex items-center justify-between py-1 text-sm text-muted-foreground">
                <span>Subtotal</span>
                <span>{formatRupiah(subtotal)}</span>
              </div>
              <div className="my-2 border-t" />
              <div className="flex items-center justify-between py-1 text-sm font-bold">
                <span>Total</span>
                <span className="text-primary">{formatRupiah(subtotal)}</span>
              </div>
              {paymentMethod === "CASH" && (
                <div className="flex items-center justify-between py-1 text-sm font-semibold">
                  <span className="text-emerald-600">Kembalian</span>
                  <span className={change >= 0 ? "text-emerald-600" : "text-destructive"}>
                    {change >= 0 ? formatRupiah(change) : `Kurang ${formatRupiah(Math.abs(change))}`}
                  </span>
                </div>
              )}
            </div>
          )}

          <Button
            type="button"
            onClick={onPayment}
            disabled={!canPay}
            loading={isProcessing}
            loadingText="Memproses..."
            className="mt-3 w-full rounded-2xl py-4 text-base font-bold shadow-lg shadow-primary/25"
          >
            <HugeiconsIcon icon={CheckmarkCircle02Icon} size={20} />
            Proses Pembayaran
          </Button>
        </div>
      </div>
    </div>
  )
}
