"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import { PlusSignIcon, Alert02Icon } from "@hugeicons/core-free-icons"
import Image from "next/image"
import { formatRupiah } from "@/lib/format-currency"
import { useCartStore, useCartItemQuantity } from "@/features/pos/hooks/use-cart"

export type PosProduct = {
  id: string
  name: string
  categoryId: string
  categoryName: string
  image: string | null
  unit: string
  stock: number
  buyPrice: number
  sellPrice: number
}

type PosProductGridProps = {
  products: PosProduct[]
  isLoading?: boolean
}

function ProductCard({ product }: { product: PosProduct }) {
  const addItem = useCartStore((s) => s.addItem)
  const qtyInCart = useCartItemQuantity(product.id)

  const handleAdd = () => {
    addItem({
      id: product.id,
      name: product.name,
      sellPrice: product.sellPrice,
      buyPrice: product.buyPrice,
      unit: product.unit,
      stock: product.stock,
      image: product.image,
    })
  }

  const isInCart = qtyInCart > 0
  const isOutOfStock = product.stock <= 0 || qtyInCart >= product.stock

  return (
    <>
      {/* --- DESKTOP CARD (HORIZONTAL) --- */}
      <div
        className={`group relative hidden flex-row overflow-hidden rounded-xl border bg-card transition-all xl:flex ${
          isInCart
            ? "border-primary/50 ring-1 ring-primary/30"
            : "hover:shadow-md"
        } ${isOutOfStock ? "opacity-55 grayscale-[0.35]" : ""}`}
      >
        {isInCart && (
          <div className="absolute top-1.5 left-1.5 z-10 flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground shadow-sm">
            {qtyInCart}
          </div>
        )}

        <div className="w-24 shrink-0 overflow-hidden">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              width={96}
              height={96}
              className="h-full w-full object-contain"
            />
          ) : (
            <div className="flex h-full min-h-[80px] w-full items-center justify-center border border-primary/20 bg-primary/10 text-3xl font-bold text-primary">
              {product.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        <div className="flex min-w-0 flex-1 flex-col justify-between p-2.5">
          <div className="flex flex-col gap-0.5">
            <span className="line-clamp-2 text-sm leading-tight font-semibold text-foreground">
              {product.name}
            </span>
            <span className="text-sm font-bold text-primary">
              {formatRupiah(product.sellPrice)}
            </span>
            <span className="text-[10px] text-muted-foreground">
              Stok {product.stock} {product.unit}
            </span>
          </div>

          <button
            onClick={handleAdd}
            disabled={isOutOfStock}
            className={`mt-1.5 flex w-full items-center justify-center gap-1 rounded-lg py-1.5 text-[11px] font-semibold whitespace-nowrap transition-all active:scale-[0.97] ${
              isOutOfStock
                ? "cursor-not-allowed border border-muted bg-muted/50 text-muted-foreground"
                : isInCart
                  ? "border border-primary bg-primary/10 text-primary hover:bg-primary/20"
                  : "border border-border text-muted-foreground hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
            }`}
          >
            {isOutOfStock ? (
              <>
                <HugeiconsIcon icon={Alert02Icon} size={12} /> Stok Habis
              </>
            ) : (
              <>
                <HugeiconsIcon icon={PlusSignIcon} size={12} /> Tambah
              </>
            )}
          </button>
        </div>
      </div>

      {/* --- MOBILE/TABLET CARD (VERTICAL) --- */}
      <button
        onClick={handleAdd}
        disabled={isOutOfStock}
        className={`group relative flex flex-col overflow-hidden rounded-xl border bg-card p-3 text-left transition-all active:scale-[0.98] xl:hidden ${
          isInCart
            ? "border-primary/50 bg-primary/5 ring-1 ring-primary/30"
            : ""
        } ${isOutOfStock ? "cursor-not-allowed opacity-45 grayscale-[0.75]" : "cursor-pointer"}`}
      >
        {isInCart && (
          <div className="absolute top-2 right-2 z-10 flex size-6 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground shadow-sm">
            {qtyInCart}
          </div>
        )}

        <div className="flex w-full flex-col items-center gap-3">
          {product.image ? (
            <div className="relative h-24 w-full shrink-0 overflow-hidden rounded-lg bg-white">
              <Image
                src={product.image}
                alt={product.name}
                fill
                sizes="(max-width: 1279px) 50vw, 25vw"
                className="object-contain"
              />
            </div>
          ) : (
            <div className="flex h-24 w-full shrink-0 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-3xl font-bold text-primary">
              {product.name.charAt(0).toUpperCase()}
            </div>
          )}

          <div className="flex w-full min-w-0 flex-col text-center">
            <span className="mb-1 line-clamp-2 text-xs leading-tight font-semibold text-foreground sm:text-sm">
              {product.name}
            </span>
            <span className="text-sm font-bold text-primary">
              {formatRupiah(product.sellPrice)}
            </span>
            <span className="mt-1 self-center rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">
              Stok: {product.stock} {product.unit}
            </span>
          </div>
        </div>
      </button>
    </>
  )
}

function ProductSkeleton() {
  return (
    <div className="flex animate-pulse flex-col gap-3 rounded-xl border bg-card p-3">
      <div className="h-24 w-full shrink-0 rounded-lg bg-muted" />
      <div className="flex w-full flex-col items-center gap-2">
        <div className="h-4 w-3/4 rounded bg-muted" />
        <div className="h-4 w-1/2 rounded bg-muted" />
        <div className="mt-1 h-3 w-1/3 rounded-full bg-muted" />
      </div>
    </div>
  )
}

export function PosProductGrid({ products, isLoading }: PosProductGridProps) {
  if (isLoading) {
    return (
      <div className="relative min-h-0 flex-1">
        <div className="no-scrollbar h-full min-h-0 overflow-y-auto px-3 pb-24 xl:px-0 xl:pr-2 xl:pb-4">
          <div className="grid grid-cols-2 gap-3 min-[1399px]:grid-cols-4 sm:grid-cols-3 xl:gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
        Tidak ada produk ditemukan
      </div>
    )
  }

  return (
    <div className="relative min-h-0 flex-1">
      <div className="scrollbar-thin h-full min-h-0 overflow-y-auto px-3 pb-24 xl:px-0 xl:pr-2 xl:pb-4">
        <div className="grid grid-cols-2 gap-3 min-[1399px]:grid-cols-4 sm:grid-cols-3 xl:gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  )
}
