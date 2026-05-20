"use client"

import { memo, useMemo } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Alert02Icon,
  PackageIcon,
  PlusSignIcon,
  ShoppingCartAdd01Icon,
} from "@hugeicons/core-free-icons"
import Image from "next/image"
import { formatRupiah } from "@/lib/format-currency"
import { useCartStore } from "@/features/pos/hooks/use-cart"

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

type AddCartItem = (product: {
  id: string
  name: string
  sellPrice: number
  buyPrice: number
  unit: string
  stock: number
  image: string | null
}) => void

function getVisibleCartTarget() {
  const selectors = ["[data-pos-cart-icon-target]", "[data-pos-cart-target]"]

  const isVisible = (target: HTMLElement) => {
    const rect = target.getBoundingClientRect()
    const style = window.getComputedStyle(target)

    return (
      rect.width > 0 &&
      rect.height > 0 &&
      rect.bottom > 0 &&
      rect.right > 0 &&
      rect.top < window.innerHeight &&
      rect.left < window.innerWidth &&
      style.display !== "none" &&
      style.visibility !== "hidden"
    )
  }

  for (const selector of selectors) {
    const target = Array.from(document.querySelectorAll<HTMLElement>(selector)).find(isVisible)

    if (target) return target
  }
}

function animateProductToCart(source: HTMLElement) {
  const target = getVisibleCartTarget()
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

  if (!target || prefersReducedMotion) return

  const isMobileLayout = !window.matchMedia("(min-width: 1280px)").matches

  const sourceRect = source.getBoundingClientRect()
  const targetRect = target.getBoundingClientRect()
  const sourceImage = source.querySelector<HTMLImageElement>("img")
  const clone = document.createElement("div")

  clone.style.position = "fixed"
  clone.style.left = `${sourceRect.left}px`
  clone.style.top = `${sourceRect.top}px`
  clone.style.width = `${sourceRect.width}px`
  clone.style.height = `${sourceRect.height}px`
  clone.style.zIndex = "9999"
  clone.style.pointerEvents = "none"
  clone.style.borderRadius = "16px"
  clone.style.overflow = "hidden"
  clone.style.boxShadow = isMobileLayout ? "none" : "0 18px 45px rgba(0, 0, 0, 0.2)"
  clone.style.backgroundColor = "var(--muted)"
  clone.style.backgroundPosition = "center"
  clone.style.backgroundRepeat = "no-repeat"
  clone.style.backgroundSize = "cover"
  clone.style.willChange = "transform, opacity"

  if (sourceImage?.currentSrc || sourceImage?.src) {
    clone.style.backgroundImage = `url("${sourceImage.currentSrc || sourceImage.src}")`
  }

  document.body.appendChild(clone)

  const targetX = targetRect.left + targetRect.width / 2
  const targetY = targetRect.top + targetRect.height / 2
  const sourceX = sourceRect.left + sourceRect.width / 2
  const sourceY = sourceRect.top + sourceRect.height / 2
  const deltaX = targetX - sourceX
  const deltaY = targetY - sourceY

  clone
    .animate(
      isMobileLayout
        ? [
            { transform: "translate3d(0, 0, 0) scale(1)", opacity: 0.9 },
            { transform: `translate3d(${deltaX}px, ${deltaY}px, 0) scale(0.3)`, opacity: 0 },
          ]
        : [
            { transform: "translate3d(0, 0, 0) scale(1)", opacity: 0.98 },
            { transform: `translate3d(${deltaX * 0.38}px, ${deltaY * 0.38 - 46}px, 0) scale(0.88)`, opacity: 0.95 },
            { transform: `translate3d(${deltaX * 0.78}px, ${deltaY * 0.78 - 18}px, 0) scale(0.52)`, opacity: 0.85 },
            { transform: `translate3d(${deltaX}px, ${deltaY}px, 0) scale(0.16)`, opacity: 0 },
          ],
      {
        duration: isMobileLayout ? 360 : 900,
        easing: isMobileLayout ? "cubic-bezier(0.2, 0.8, 0.2, 1)" : "cubic-bezier(0.2, 0.85, 0.18, 1)",
      }
    )
    .finished.finally(() => {
      clone.remove()
    })
}

function shouldAnimateCart() {
  return true
}

const ProductCard = memo(function ProductCard({
  product,
  qtyInCart,
  addItem,
}: {
  product: PosProduct
  qtyInCart: number
  addItem: AddCartItem
}) {
  const handleAdd = (event: React.MouseEvent<HTMLElement>) => {
    if (isOutOfStock) return

    const canAnimate = shouldAnimateCart()
    const image = canAnimate
      ? (event.currentTarget.closest<HTMLElement>("[data-pos-product-card]") ?? event.currentTarget)
          .querySelector<HTMLElement>("[data-pos-product-image]")
      : null

    addItem({
      id: product.id,
      name: product.name,
      sellPrice: product.sellPrice,
      buyPrice: product.buyPrice,
      unit: product.unit,
      stock: product.stock,
      image: product.image,
    })

    if (canAnimate && image) {
      window.requestAnimationFrame(() => animateProductToCart(image))
    }
  }

  const isInCart = qtyInCart > 0
  const isOutOfStock = product.stock <= 0 || qtyInCart >= product.stock

  return (
    <>
      {/* --- DESKTOP CARD (HORIZONTAL) --- */}
      <div
        role="button"
        tabIndex={isOutOfStock ? -1 : 0}
        data-pos-product-card
        onClick={handleAdd}
        onKeyDown={(event) => {
          if (event.key !== "Enter" && event.key !== " ") return

          event.preventDefault()
          handleAdd(event as unknown as React.MouseEvent<HTMLElement>)
        }}
        className={`group relative hidden flex-row overflow-hidden rounded-xl border bg-card text-left transition-all active:scale-[0.985] ${isOutOfStock ? "cursor-not-allowed" : "cursor-pointer"} xl:flex ${
          isInCart
            ? "border-primary/45 bg-primary/[0.025] shadow-sm ring-1 ring-primary/20"
            : "hover:border-primary/25 hover:shadow-md"
        } ${isOutOfStock ? "opacity-55 grayscale-[0.35]" : ""}`}
      >
        {isInCart && (
          <div className="absolute top-2 left-2 z-10 flex min-w-6 items-center justify-center rounded-full border border-primary-foreground/40 bg-primary px-1.5 py-0.5 text-[10px] font-black leading-none text-primary-foreground shadow-lg shadow-primary/25">
            {qtyInCart}
          </div>
        )}

        <div data-pos-product-image className="w-24 shrink-0 overflow-hidden bg-muted/20">
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
            <span className={`mt-1 inline-flex w-fit items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold ${
              product.stock > 0
                ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                : "border-destructive/20 bg-destructive/10 text-destructive"
            }`}>
              <HugeiconsIcon icon={product.stock > 0 ? PackageIcon : Alert02Icon} size={10} />
              {product.stock > 0 ? `${product.stock} ${product.unit}` : "Habis"}
            </span>
          </div>

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation()
              handleAdd(event)
            }}
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

      {/* --- MOBILE/TABLET CARD (HORIZONTAL LIST ITEM) --- */}
      <div
        role="button"
        tabIndex={isOutOfStock ? -1 : 0}
        data-pos-product-card
        onClick={handleAdd}
        onKeyDown={(event) => {
          if (event.key !== "Enter" && event.key !== " ") return

          event.preventDefault()
          handleAdd(event as unknown as React.MouseEvent<HTMLElement>)
        }}
        className={`group relative flex w-full items-center gap-3 rounded-2xl border bg-card p-3 text-left transition-all active:scale-[0.985] ${isOutOfStock ? "cursor-not-allowed" : "cursor-pointer"} xl:hidden ${
          isInCart
            ? "border-primary/45 bg-primary/[0.035] shadow-sm ring-1 ring-primary/20"
            : "border-border"
        } ${isOutOfStock ? "opacity-50" : ""}`}
      >
        {/* Product Image */}
        <div data-pos-product-image className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-muted/30">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="64px"
              className="object-contain"
            />
          ) : (
            <div className="flex size-full items-center justify-center bg-destructive/10 text-destructive">
              <HugeiconsIcon icon={PackageIcon} size={24} />
            </div>
          )}
          {/* Out of stock overlay */}
          {product.stock <= 0 && (
            <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/40">
              <div className="rounded-full bg-destructive/90 px-1.5 py-0.5 text-[8px] font-bold text-white">
                Habis
              </div>
            </div>
          )}
          {/* In-cart badge */}
          {isInCart && (
            <div className="absolute top-1 right-1 z-10 flex min-w-6 items-center justify-center rounded-full border border-primary-foreground/40 bg-primary px-1.5 py-0.5 text-[10px] font-black leading-none text-primary-foreground shadow-lg shadow-primary/25">
              {qtyInCart}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <span className="line-clamp-2 break-words text-[15px] font-semibold leading-5 text-foreground">
            {product.name}
          </span>
          {product.stock > 0 ? (
            <span className="inline-flex w-fit items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-400">
              <HugeiconsIcon icon={PackageIcon} size={10} />
              {product.stock} {product.unit}
            </span>
          ) : (
            <span className="inline-flex w-fit items-center gap-1 rounded-full border border-destructive/20 bg-destructive/10 px-2 py-0.5 text-[10px] font-bold text-destructive">
              <HugeiconsIcon icon={Alert02Icon} size={10} />
              Habis
            </span>
          )}
        </div>

        {/* Price */}
        <div className="shrink-0 self-center text-right">
          <span className="whitespace-nowrap text-sm font-bold leading-5 text-destructive">
            {formatRupiah(product.sellPrice)}
          </span>
        </div>

        {/* Add to Cart Button */}
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation()
            handleAdd(event)
          }}
          disabled={isOutOfStock}
          className={`flex size-10 shrink-0 items-center justify-center rounded-xl transition-all active:scale-95 ${
            isOutOfStock
              ? "cursor-not-allowed bg-muted/50 text-muted-foreground/50"
              : isInCart
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-muted/60 text-muted-foreground hover:bg-primary/10 hover:text-primary"
          }`}
          aria-label={`Tambah ${product.name}`}
        >
          {isOutOfStock ? (
            <HugeiconsIcon icon={Alert02Icon} size={18} />
          ) : (
            <HugeiconsIcon icon={ShoppingCartAdd01Icon} size={18} />
          )}
        </button>
      </div>
    </>
  )
}, (prev, next) => prev.product === next.product && prev.qtyInCart === next.qtyInCart && prev.addItem === next.addItem)

function ProductSkeleton() {
  return (
    <>
      {/* Desktop skeleton */}
      <div className="hidden animate-pulse flex-col gap-3 rounded-xl border bg-card p-3 xl:flex">
        <div className="h-24 w-full shrink-0 rounded-lg bg-muted" />
        <div className="flex w-full flex-col items-center gap-2">
          <div className="h-4 w-3/4 rounded bg-muted" />
          <div className="h-4 w-1/2 rounded bg-muted" />
          <div className="mt-1 h-3 w-1/3 rounded-full bg-muted" />
        </div>
      </div>
      {/* Mobile skeleton */}
      <div className="flex animate-pulse items-center gap-3 rounded-2xl border bg-card p-3 xl:hidden">
        <div className="size-16 shrink-0 rounded-xl bg-muted" />
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div className="h-4 w-3/4 rounded bg-muted" />
          <div className="h-3 w-1/3 rounded-full bg-muted" />
        </div>
        <div className="h-4 w-16 rounded bg-muted" />
        <div className="size-10 shrink-0 rounded-xl bg-muted" />
      </div>
    </>
  )
}

export function PosProductGrid({ products, isLoading }: PosProductGridProps) {
  const addItem = useCartStore((s) => s.addItem)
  const cartItems = useCartStore((s) => s.items)
  const cartQuantities = useMemo(() => {
    const quantities = new Map<string, number>()

    for (const item of cartItems) {
      quantities.set(item.productId, item.quantity)
    }

    return quantities
  }, [cartItems])

  if (isLoading) {
    return (
      <div className="relative min-h-0 flex-1">
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-6 bg-gradient-to-b from-background/75 to-transparent dark:from-background/25" />
        <div className="no-scrollbar h-full min-h-0 overflow-y-auto px-3 pt-2 pb-24 xl:px-0 xl:pr-2 xl:pb-4">
          {/* Desktop grid */}
          <div className="hidden grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-3 xl:grid xl:gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
          {/* Mobile list */}
          <div className="flex flex-col gap-2 xl:hidden">
            {Array.from({ length: 6 }).map((_, i) => (
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
        Tidak ada barang ditemukan
      </div>
    )
  }

  return (
    <div className="relative min-h-0 flex-1">
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-6 bg-gradient-to-b from-background/75 to-transparent dark:from-background/25" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 hidden h-6 bg-gradient-to-t from-background/75 to-transparent dark:from-background/25 xl:block" />
      <div className="scrollbar-thin h-full min-h-0 overflow-y-auto px-3 pt-2 pb-24 xl:px-0 xl:pr-2 xl:pb-4">
        {/* Desktop: Grid layout */}
        <div className="hidden grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-3 xl:grid xl:gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} qtyInCart={cartQuantities.get(product.id) ?? 0} addItem={addItem} />
          ))}
        </div>
        {/* Mobile/Tablet: Vertical list layout */}
        <div className="flex flex-col gap-2 xl:hidden">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} qtyInCart={cartQuantities.get(product.id) ?? 0} addItem={addItem} />
          ))}
        </div>
      </div>
    </div>
  )
}
