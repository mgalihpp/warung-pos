"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import { PlusSignIcon, CheckmarkCircle02Icon } from "@hugeicons/core-free-icons"
import { formatRupiah } from "@/lib/format-currency"
import { useCartStore, useCartItemQuantity } from "@/hooks/use-cart"

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
        className={`hidden xl:flex group relative overflow-hidden bg-card border rounded-xl flex-row transition-all ${isInCart ? "border-primary/50 ring-1 ring-primary/30" : "hover:shadow-md"
          }`}
      >
        {isInCart && (
          <div className="absolute top-1.5 left-1.5 z-10 flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px] font-bold shadow-sm">
            {qtyInCart}
          </div>
        )}

        <div className="w-24 shrink-0 overflow-hidden">
          {product.image ? (
            <img src={product.image} alt={product.name} className="w-full h-full object-contain" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-muted/50 text-muted-foreground text-2xl font-bold min-h-[80px]">
              {product.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        <div className="flex flex-col flex-1 p-2.5 min-w-0 justify-between">
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-semibold text-foreground line-clamp-2 leading-tight">
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
            className={`mt-1.5 w-full py-1.5 flex items-center justify-center gap-1 rounded-lg text-[11px] font-semibold transition-all active:scale-[0.97] ${isOutOfStock
                ? "border border-muted bg-muted/50 text-muted-foreground cursor-not-allowed"
                : isInCart
                  ? "border border-primary bg-primary/10 text-primary hover:bg-primary/20"
                  : "border border-border text-muted-foreground hover:border-primary/40 hover:text-primary hover:bg-primary/5"
              }`}
          >
            {isOutOfStock ? (
              <>
                <HugeiconsIcon icon={CheckmarkCircle02Icon} size={12} /> Stok Habis
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
        className={`xl:hidden flex group relative text-left overflow-hidden bg-card border rounded-xl p-3 flex-col active:scale-[0.98] transition-all ${isInCart ? "border-primary/50 ring-1 ring-primary/30 bg-primary/5" : ""
          } ${isOutOfStock ? "opacity-60 cursor-not-allowed grayscale-[0.5]" : "cursor-pointer"}`}
      >
        {isInCart && (
          <div className="absolute top-2 right-2 z-10 flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-[11px] font-bold shadow-sm">
            {qtyInCart}
          </div>
        )}

        <div className="flex flex-col items-center gap-3 w-full">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-24 shrink-0 rounded-lg object-contain bg-white"
            />
          ) : (
            <div className="w-full h-24 shrink-0 flex items-center justify-center rounded-lg border bg-primary/10 text-primary border-primary/20 text-3xl font-bold">
              {product.name.charAt(0).toUpperCase()}
            </div>
          )}

          <div className="flex flex-col w-full min-w-0 text-center">
            <span className="text-xs sm:text-sm font-semibold text-foreground line-clamp-2 leading-tight mb-1">
              {product.name}
            </span>
            <span className="text-sm font-bold text-primary">
              {formatRupiah(product.sellPrice)}
            </span>
            <span className="text-[10px] text-muted-foreground mt-1 bg-muted px-2 py-0.5 rounded-full self-center">
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
    <div className="bg-card border rounded-xl p-3 flex flex-col animate-pulse gap-3">
      <div className="w-full h-24 shrink-0 rounded-lg bg-muted" />
      <div className="flex flex-col w-full items-center gap-2">
        <div className="h-4 bg-muted rounded w-3/4" />
        <div className="h-4 bg-muted rounded w-1/2" />
        <div className="h-3 bg-muted rounded-full w-1/3 mt-1" />
      </div>
    </div>
  )
}

export function PosProductGrid({ products, isLoading }: PosProductGridProps) {
  if (isLoading) {
    return (
      <div className="flex-1 overflow-y-auto min-h-0 px-3 xl:px-0 xl:pr-2 pb-24 xl:pb-4 scrollbar-hide">
        <div className="grid grid-cols-2 sm:grid-cols-3 min-[1399px]:grid-cols-4 gap-3 xl:gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductSkeleton key={i} />
          ))}
        </div>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
        Tidak ada produk ditemukan
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto min-h-0 px-3 xl:px-0 xl:pr-2 pb-24 xl:pb-4 scrollbar-hide">
      <div className="grid grid-cols-2 sm:grid-cols-3 min-[1399px]:grid-cols-4 gap-3 xl:gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}
