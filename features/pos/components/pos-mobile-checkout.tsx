"use client"

import Image from "next/image"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  MinusSignIcon,
  PlusSignIcon,
  Delete02Icon,
  Invoice01Icon,
  PackageIcon,
} from "@hugeicons/core-free-icons"
import { formatRupiah } from "@/lib/format-currency"
import {
  useCartStore,
  useCartSubtotal,
  useCartItemCount,
} from "@/features/pos/hooks/use-cart"

type Props = {
  onProceed: () => void
}

export function PosMobileCheckout({ onProceed }: Props) {
  const items = useCartStore((s) => s.items)
  const incrementItem = useCartStore((s) => s.incrementItem)
  const decrementItem = useCartStore((s) => s.decrementItem)
  const removeItem = useCartStore((s) => s.removeItem)
  const subtotal = useCartSubtotal()
  const itemCount = useCartItemCount()

  return (
    <div className="flex h-full flex-col">
      {/* Header Info */}
      <div className="flex shrink-0 items-center gap-3 px-4 pt-4 pb-3">
        <div className="flex size-10 items-center justify-center rounded-xl bg-muted">
          <HugeiconsIcon icon={Invoice01Icon} size={18} className="text-muted-foreground" />
        </div>
        <div>
          <p className="text-sm font-bold text-foreground">Item Pesanan</p>
          <p className="text-xs text-muted-foreground">{itemCount} item dalam keranjang</p>
        </div>
      </div>

      {/* Cart Items */}
      <div className="scrollbar-thin flex-1 overflow-y-auto px-4">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <p className="text-sm font-medium">Keranjang kosong</p>
            <p className="mt-1 text-xs">Tambahkan barang dari daftar</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {items.map((item) => (
              <div
                key={item.productId}
                className="flex items-center gap-3 rounded-2xl border bg-card p-3"
              >
                <div className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-muted/30">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="56px"
                      className="object-contain"
                    />
                  ) : (
                    <div className="flex size-full items-center justify-center bg-primary/10 text-primary">
                      <HugeiconsIcon icon={PackageIcon} size={22} />
                    </div>
                  )}
                </div>

                {/* Item Info */}
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-2 break-words text-sm font-semibold leading-5 text-foreground">
                    {item.name}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {formatRupiah(item.price)}
                    <span className="mx-1.5">→</span>
                    <span className="font-bold text-primary">
                      {formatRupiah(item.price * item.quantity)}
                    </span>
                  </p>
                </div>

                {/* Quantity Controls */}
                <div className="flex shrink-0 items-center gap-0">
                  {item.quantity <= 1 ? (
                    <button
                      onClick={() => removeItem(item.productId)}
                      className="flex size-8 items-center justify-center rounded-lg bg-destructive/10 text-destructive"
                    >
                      <HugeiconsIcon icon={Delete02Icon} size={14} />
                    </button>
                  ) : (
                    <button
                      onClick={() => decrementItem(item.productId)}
                      className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground"
                    >
                      <HugeiconsIcon icon={MinusSignIcon} size={14} />
                    </button>
                  )}
                  <span className="w-8 text-center text-sm font-bold text-foreground">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => incrementItem(item.productId)}
                    disabled={item.quantity >= item.maxStock}
                    className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground disabled:opacity-40"
                  >
                    <HugeiconsIcon icon={PlusSignIcon} size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Bar */}
      {items.length > 0 && (
        <div className="shrink-0 bg-background px-4 pt-3 pb-4">
          <button
            type="button"
            onClick={onProceed}
            className="flex w-full items-center justify-between gap-4 rounded-2xl bg-primary px-4 py-4 text-left text-primary-foreground shadow-lg shadow-primary/25 transition-all active:scale-[0.98]"
          >
            <div className="min-w-0">
              <p className="text-xs font-medium text-primary-foreground/80">
                Total ({itemCount} item)
              </p>
              <p className="mt-1 text-2xl font-extrabold leading-none tracking-tight text-primary-foreground">
                {formatRupiah(subtotal)}
              </p>
            </div>
            <span className="shrink-0 rounded-xl bg-primary-foreground/18 px-8 py-4 text-xs font-black tracking-[0.22em] text-primary-foreground shadow-sm ring-1 ring-primary-foreground/10">
              PROSES
            </span>
          </button>
        </div>
      )}
    </div>
  )
}
