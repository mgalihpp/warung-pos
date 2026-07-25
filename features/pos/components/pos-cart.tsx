"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ShoppingCart01Icon,
  MinusSignIcon,
  PlusSignIcon,
  Delete02Icon,
} from "@hugeicons/core-free-icons"
import { formatRupiah } from "@/lib/format-currency"
import {
  useCartStore,
  useCartSubtotal,
  useCartItemCount,
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
import { Button } from "@/components/ui/button"
import { PosPaymentDialog } from "./pos-payment-dialog"

type PosCartProps = {
  onPayment: () => void
  isProcessing: boolean
}

export function PosCart({ onPayment, isProcessing }: PosCartProps) {
  const items = useCartStore((s) => s.items)
  const incrementItem = useCartStore((s) => s.incrementItem)
  const decrementItem = useCartStore((s) => s.decrementItem)
  const removeItem = useCartStore((s) => s.removeItem)
  const clearCart = useCartStore((s) => s.clearCart)

  const subtotal = useCartSubtotal()
  const itemCount = useCartItemCount()

  const [isPaymentOpen, setIsPaymentOpen] = useState(false)

  // Tutup dialog pembayaran ketika keranjang kosong (transaksi sukses / dikosongkan)
  useEffect(() => {
    if (items.length === 0) setIsPaymentOpen(false)
  }, [items.length])

  return (
    <div data-pos-cart-target className="flex h-full min-h-0 w-full shrink-0 flex-col overflow-hidden bg-card xl:w-[400px] xl:rounded-xl xl:border xl:shadow-sm min-[1400px]:xl:w-[450px]">
      {/* Header (Desktop Only) */}
      <div className="hidden shrink-0 items-center justify-between border-b p-4 xl:flex">
        <div data-pos-cart-icon-target className="flex items-center gap-2">
          <HugeiconsIcon icon={ShoppingCart01Icon} size={18} className="text-primary" />
          <h2 className="font-bold text-foreground">Keranjang</h2>
        </div>
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
        <div className="flex shrink-0 flex-col bg-card">
          <div className="rounded-t-4xl border-t p-4 pb-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-foreground">Total</span>
              <span className="text-lg font-bold text-primary">
                {formatRupiah(subtotal)}
              </span>
            </div>
          </div>

          <div className="p-4 pt-0">
            <div className="flex flex-col gap-2">
              <Button
                type="button"
                onClick={() => setIsPaymentOpen(true)}
                disabled={isProcessing}
                loading={isProcessing}
                loadingText="Memproses..."
                className="h-auto w-full rounded-xl px-0 py-3 font-bold shadow-sm"
              >
                Bayar {formatRupiah(subtotal)}
              </Button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="h-auto w-full rounded-xl border-destructive/20 px-0 py-3 font-bold text-destructive shadow-sm hover:bg-destructive/10"
                  >
                    <HugeiconsIcon icon={Delete02Icon} size={18} />
                    <span>Hapus Keranjang</span>
                  </Button>
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
                      onClick={() => clearCart()}
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

      <PosPaymentDialog
        open={isPaymentOpen}
        onOpenChange={setIsPaymentOpen}
        onConfirm={onPayment}
        isProcessing={isProcessing}
      />
    </div>
  )
}
