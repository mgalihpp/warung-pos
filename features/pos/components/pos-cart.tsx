"use client"

import { useState } from "react"
import Image from "next/image"
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
import {
  formatRupiah,
  formatNumber,
  parseRupiahInput,
} from "@/lib/format-currency"
import {
  useCartStore,
  useCartSubtotal,
  useCartChange,
  useCartItemCount,
  type PaymentMethod,
} from "@/features/pos/hooks/use-cart"
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

const PAYMENT_METHODS: {
  value: PaymentMethod
  label: string
  icon: typeof Money01Icon
}[] = [
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
  const [amountInput, setAmountInput] = useState(
    amountPaid > 0 ? formatNumber(amountPaid) : ""
  )

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

  const handleResetAmount = () => {
    setAmountPaid(0)
    setAmountInput("")
  }

  const canPay =
    items.length > 0 &&
    (paymentMethod !== "CASH" || amountPaid >= subtotal) &&
    !isProcessing

  return (
    <div className="flex h-full min-h-0 w-full shrink-0 flex-col overflow-hidden bg-card xl:w-[400px] xl:rounded-xl xl:border xl:shadow-sm min-[1400px]:xl:w-[450px]">
      {/* Header (Desktop Only) */}
      <div className="hidden shrink-0 items-center justify-between border-b p-4 xl:flex">
        <h2 className="font-bold text-foreground">Keranjang</h2>
        {itemCount > 0 && (
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">
            {itemCount} item
          </span>
        )}
      </div>

      {/* Content (scrollable) */}
      <div className="scrollbar-thin min-h-[110px] flex-1 overflow-y-auto">
        {/* Cart Items */}
        <div
          className={`p-2 ${items.length === 0 ? "flex min-h-full flex-col" : ""}`}
        >
          {items.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center py-12 text-muted-foreground">
              <HugeiconsIcon
                icon={ShoppingCart01Icon}
                size={40}
                className="mb-2 opacity-30"
              />
              <p className="text-sm font-medium">Keranjang kosong</p>
              <p className="mt-1 text-xs">Tambahkan barang dari daftar</p>
            </div>
          ) : (
            <div className="flex flex-col gap-1.5">
              {items.map((item) => (
                <div
                  key={item.productId}
                  className="group flex items-center gap-2 rounded-lg p-2 transition-colors hover:bg-accent"
                >
                  {/* Item Image */}
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={40}
                      height={40}
                      className="size-10 shrink-0 rounded-lg object-contain"
                    />
                  ) : (
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted/50 text-xs font-bold text-muted-foreground">
                      {item.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-medium text-foreground">
                      {item.name}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {formatRupiah(item.price)} / {item.unit}
                    </p>
                  </div>

                  {/* Qty Controls */}
                  <div className="flex shrink-0 items-center gap-1">
                    <button
                      onClick={() => decrementItem(item.productId)}
                      className="flex size-6 items-center justify-center rounded-md border bg-card text-muted-foreground transition-colors hover:bg-muted"
                    >
                      <HugeiconsIcon icon={MinusSignIcon} size={12} />
                    </button>
                    <span className="w-5 text-center text-xs font-bold text-foreground">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => incrementItem(item.productId)}
                      disabled={item.quantity >= item.maxStock}
                      className="flex size-6 items-center justify-center rounded-md border bg-card text-muted-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <HugeiconsIcon icon={PlusSignIcon} size={12} />
                    </button>
                  </div>

                  {/* Subtotal & Delete */}
                  <div className="flex shrink-0 items-center gap-1.5">
                    <span className="min-w-[56px] text-right text-xs font-bold text-foreground">
                      {formatRupiah(item.price * item.quantity)}
                    </span>
                    <button
                      onClick={() => removeItem(item.productId)}
                      className="flex size-7 items-center justify-center rounded-md bg-destructive/10 text-destructive opacity-100 transition-colors hover:bg-destructive/20 xl:size-6 xl:bg-transparent xl:text-muted-foreground xl:opacity-0 xl:group-hover:opacity-100 xl:hover:bg-destructive/10 xl:hover:text-destructive"
                      aria-label={`Hapus ${item.name} dari keranjang`}
                    >
                      <HugeiconsIcon icon={Delete02Icon} size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Bar (fixed inside cart) */}
      {items.length > 0 && (
        <div className="flex min-h-0 shrink-0 flex-col bg-card">
          <div className="rounded-t-4xl border-t p-4 pb-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-foreground">Total</span>
              <span className="text-lg font-bold text-primary">
                {formatRupiah(subtotal)}
              </span>
            </div>
          </div>

          <div className="relative min-h-0 flex-1">
            <div className="scrollbar-thin h-full min-h-0 overflow-y-auto p-4 pt-3">
              {/* Payment Method */}
              <div className="mb-3">
                <span className="mb-2 block text-xs font-semibold text-muted-foreground">
                  Metode Pembayaran
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {PAYMENT_METHODS.map((method) => (
                    <button
                      key={method.value}
                      onClick={() => setPaymentMethod(method.value)}
                      className={`flex items-center justify-center gap-1.5 rounded-lg border py-2 text-xs font-semibold transition-colors ${
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
                  <div className="mb-3 flex gap-3">
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
                          value={amountInput}
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
            </div>
          </div>

          <div className="p-4">
            <div className="flex flex-col gap-2">
              <button
                onClick={onPayment}
                disabled={!canPay}
                className="flex w-full items-center justify-center rounded-xl bg-primary py-3 font-bold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isProcessing ? (
                  <span className="flex items-center gap-2">
                    <span className="size-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
                    Memproses...
                  </span>
                ) : (
                  `Bayar ${formatRupiah(subtotal)}`
                )}
              </button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-destructive/20 bg-card py-3 font-bold text-destructive shadow-sm transition-colors hover:bg-destructive/10">
                    <HugeiconsIcon icon={Delete02Icon} size={18} />
                    <span>Hapus Keranjang</span>
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Hapus Keranjang?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Semua item dalam keranjang akan dihapus. Tindakan ini
                      tidak bisa dibatalkan.
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
        </div>
      )}
    </div>
  )
}
