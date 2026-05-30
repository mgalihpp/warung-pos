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
      <div className="scrollbar-thin flex-1 overflow-y-auto px-4 max-[340px]:px-3">
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
                className="flex items-center gap-3 rounded-2xl border bg-card p-3 max-[340px]:gap-2 max-[340px]:p-2.5"
              >
                <div className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-muted/30 max-[340px]:size-12">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="(max-width: 340px) 48px, 56px"
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
                  <p className="line-clamp-2 break-words text-sm font-semibold leading-5 text-foreground max-[340px]:leading-4">
                    {item.name}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground max-[340px]:text-[11px]">
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
                      className="flex size-7 items-center justify-center rounded-md bg-destructive/10 text-destructive max-[340px]:size-6"
                    >
                      <HugeiconsIcon icon={Delete02Icon} size={13} className="max-[340px]:size-3" />
                    </button>
                  ) : (
                    <button
                      onClick={() => decrementItem(item.productId)}
                      className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground max-[340px]:size-6"
                    >
                      <HugeiconsIcon icon={MinusSignIcon} size={13} className="max-[340px]:size-3" />
                    </button>
                  )}
                  <span className="w-7 text-center text-sm font-bold text-foreground max-[340px]:w-6 max-[340px]:text-xs">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => incrementItem(item.productId)}
                    disabled={item.quantity >= item.maxStock}
                    className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground disabled:opacity-40 max-[340px]:size-6"
                  >
                    <HugeiconsIcon icon={PlusSignIcon} size={13} className="max-[340px]:size-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Bar */}
      {items.length > 0 && (
        <div className="shrink-0 bg-background px-4 pt-3 pb-4 max-[340px]:px-3">
          <button
            type="button"
            onClick={onProceed}
            className="flex w-full items-center justify-between gap-4 rounded-2xl bg-primary px-4 py-4 text-left text-primary-foreground shadow-lg shadow-primary/25 transition-all active:scale-[0.98] max-[340px]:gap-2 max-[340px]:px-3 max-[340px]:py-3"
          >
            <div className="min-w-0">
              <p className="text-xs font-medium text-primary-foreground/80 max-[340px]:text-[11px]">
                Total ({itemCount} item)
              </p>
              <p className="mt-1 text-2xl font-extrabold leading-none tracking-tight text-primary-foreground max-[340px]:text-xl">
                {formatRupiah(subtotal)}
              </p>
            </div>
            <span className="shrink-0 rounded-xl bg-primary-foreground/18 px-8 py-4 text-xs font-black tracking-[0.22em] text-primary-foreground shadow-sm ring-1 ring-primary-foreground/10 max-[340px]:px-4 max-[340px]:py-3 max-[340px]:text-[10px] max-[340px]:tracking-[0.16em]">
              PROSES
            </span>
          </button>
        </div>
      )}
    </div>
  )
}
