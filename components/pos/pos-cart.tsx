"use client"

import { useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ShoppingCart01Icon,
  MinusSignIcon,
  PlusSignIcon,
  Delete02Icon,
  Money01Icon,
  QrCodeIcon,
  BankIcon,
  NoteIcon,
} from "@hugeicons/core-free-icons"
import { formatRupiah, formatNumber, parseRupiahInput } from "@/lib/format-currency"
import {
  useCartStore,
  useCartSubtotal,
  useCartChange,
  useCartItemCount,
  type PaymentMethod,
} from "@/hooks/use-cart"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

const QUICK_AMOUNTS = [2000, 5000, 10000, 20000, 50000, 100000]

const PAYMENT_METHODS: { value: PaymentMethod; label: string; icon: typeof Money01Icon }[] = [
  { value: "CASH", label: "Tunai", icon: Money01Icon },
  { value: "QRIS_MANUAL", label: "QRIS", icon: QrCodeIcon },
  { value: "MANUAL_TRANSFER", label: "Transfer", icon: BankIcon },
]

type PosCartProps = {
  onPayment: () => void
  isProcessing: boolean
}

export function PosCart({ onPayment, isProcessing }: PosCartProps) {
  const items = useCartStore((s) => s.items)
  const paymentMethod = useCartStore((s) => s.paymentMethod)
  const amountPaid = useCartStore((s) => s.amountPaid)
  const notes = useCartStore((s) => s.notes)
  const setPaymentMethod = useCartStore((s) => s.setPaymentMethod)
  const setAmountPaid = useCartStore((s) => s.setAmountPaid)
  const setNotes = useCartStore((s) => s.setNotes)
  const incrementItem = useCartStore((s) => s.incrementItem)
  const decrementItem = useCartStore((s) => s.decrementItem)
  const removeItem = useCartStore((s) => s.removeItem)
  const clearCart = useCartStore((s) => s.clearCart)

  const subtotal = useCartSubtotal()
  const change = useCartChange()
  const itemCount = useCartItemCount()

  const [showNotes, setShowNotes] = useState(false)
  const [amountInput, setAmountInput] = useState(amountPaid > 0 ? formatNumber(amountPaid) : "")

  const handleAmountChange = (value: string) => {
    const num = parseRupiahInput(value)
    setAmountInput(num > 0 ? formatNumber(num) : "")
    setAmountPaid(num)
  }

  const handleQuickAmount = (amount: number) => {
    const newAmount = amountPaid + amount
    setAmountPaid(newAmount)
    setAmountInput(formatNumber(newAmount))
  }

  const handleExactAmount = () => {
    setAmountPaid(subtotal)
    setAmountInput(formatNumber(subtotal))
  }

  const canPay =
    items.length > 0 &&
    (paymentMethod !== "CASH" || amountPaid >= subtotal) &&
    !isProcessing

  return (
    <div className="w-full xl:w-[400px] min-[1400px]:w-[450px] bg-card md:border md:rounded-xl flex flex-col shadow-sm shrink-0 overflow-hidden h-full">
      {/* Header (Desktop Only) */}
      <div className="hidden xl:flex p-4 border-b items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <HugeiconsIcon icon={ShoppingCart01Icon} size={20} className="text-primary" />
          <h2 className="font-bold text-foreground">Keranjang</h2>
        </div>
        {itemCount > 0 && (
          <span className="text-xs bg-primary/10 text-primary font-bold px-2 py-0.5 rounded-full">
            {itemCount} item
          </span>
        )}
      </div>

      {/* Cart Items List */}
      <div className="flex-1 overflow-y-auto p-2 scrollbar-hide min-h-0">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <HugeiconsIcon icon={ShoppingCart01Icon} size={40} className="mb-2 opacity-30" />
            <p className="text-sm font-medium">Keranjang kosong</p>
            <p className="text-xs mt-1">Tambahkan produk dari daftar</p>
          </div>
        ) : (
          <div className="flex flex-col gap-1.5">
            {items.map((item) => (
              <div
                key={item.productId}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent group transition-colors"
              >
                {/* Item Image */}
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="size-10 shrink-0 rounded-lg object-cover"
                  />
                ) : (
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted/50 text-muted-foreground text-xs font-bold">
                    {item.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-foreground truncate">{item.name}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {formatRupiah(item.price)} / {item.unit}
                  </p>
                </div>

                {/* Qty Controls */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => decrementItem(item.productId)}
                    className="flex size-6 items-center justify-center rounded-md border bg-card text-muted-foreground hover:bg-muted transition-colors"
                  >
                    <HugeiconsIcon icon={MinusSignIcon} size={12} />
                  </button>
                  <span className="text-xs font-bold text-foreground w-5 text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => incrementItem(item.productId)}
                    disabled={item.quantity >= item.maxStock}
                    className="flex size-6 items-center justify-center rounded-md border bg-card text-muted-foreground hover:bg-muted transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <HugeiconsIcon icon={PlusSignIcon} size={12} />
                  </button>
                </div>

                {/* Subtotal & Delete */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="text-xs font-bold text-foreground min-w-[56px] text-right">
                    {formatRupiah(item.price * item.quantity)}
                  </span>
                  <button
                    onClick={() => removeItem(item.productId)}
                    className="flex size-6 items-center justify-center rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <HugeiconsIcon icon={Delete02Icon} size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Payment Area */}
      {items.length > 0 && (
        <div className="p-4 border-t bg-muted/30">
          {/* Total */}
          <div className="bg-card border rounded-xl p-4 flex justify-between items-center mb-3 shadow-sm">
            <span className="font-bold text-foreground text-base">Total</span>
            <span className="text-xl font-bold text-primary">{formatRupiah(subtotal)}</span>
          </div>

          {/* Payment Method */}
          <div className="mb-3">
            <span className="text-xs font-semibold text-muted-foreground mb-2 block">
              Metode Pembayaran
            </span>
            <div className="grid grid-cols-3 gap-2">
              {PAYMENT_METHODS.map((method) => (
                <button
                  key={method.value}
                  onClick={() => setPaymentMethod(method.value)}
                  className={`flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-colors border ${
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
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-semibold text-muted-foreground">
                    Nominal Cepat
                  </span>
                  <button
                    onClick={handleExactAmount}
                    className="text-[10px] font-semibold text-primary hover:underline"
                  >
                    Uang Pas
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  {QUICK_AMOUNTS.map((amount) => (
                    <button
                      key={amount}
                      onClick={() => handleQuickAmount(amount)}
                      className="py-1.5 border rounded-lg text-xs font-medium text-foreground hover:bg-accent transition-colors"
                    >
                      +{formatNumber(amount)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Amount & Change */}
              <div className="flex gap-3 mb-3">
                <div className="flex-1 flex flex-col">
                  <span className="text-xs font-semibold text-muted-foreground mb-1">
                    Uang Diterima
                  </span>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium">
                      Rp
                    </span>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={amountInput}
                      onChange={(e) => handleAmountChange(e.target.value)}
                      className="w-full border bg-card text-foreground rounded-lg pl-8 pr-3 py-2 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      placeholder="0"
                    />
                  </div>
                </div>
                <div className="flex-1 flex flex-col">
                  <span className="text-xs font-semibold text-muted-foreground mb-1">
                    Kembalian
                  </span>
                  <div
                    className={`w-full rounded-lg px-3 py-2 flex items-center justify-center text-sm font-bold border ${
                      amountPaid === 0
                        ? "bg-muted text-muted-foreground border-transparent"
                        : change >= 0
                        ? "bg-primary/10 border-primary/30 text-primary"
                        : "bg-destructive/10 border-destructive/30 text-destructive"
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
          <div className="mb-3">
            <button
              onClick={() => setShowNotes(!showNotes)}
              className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
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
                className="w-full mt-2 border bg-card text-foreground rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
              />
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2">
            <button
              onClick={onPayment}
              disabled={!canPay}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl py-3 flex items-center justify-center font-bold shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <span className="flex items-center gap-2">
                  <span className="size-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Memproses...
                </span>
              ) : (
                `Bayar ${formatRupiah(subtotal)}`
              )}
            </button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button className="w-full bg-card border border-destructive/20 hover:bg-destructive/10 text-destructive rounded-xl py-3 flex items-center justify-center gap-2 font-bold shadow-sm transition-colors">
                  <HugeiconsIcon icon={Delete02Icon} size={18} />
                  <span>Hapus Keranjang</span>
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Hapus Keranjang?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Semua item dalam keranjang akan dihapus. Tindakan ini tidak bisa dibatalkan.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Batal</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => {
                      clearCart()
                      setAmountInput("")
                      setShowNotes(false)
                    }}
                    className="bg-destructive text-white hover:bg-destructive/90"
                  >
                    Ya, Hapus
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      )}
    </div>
  )
}
