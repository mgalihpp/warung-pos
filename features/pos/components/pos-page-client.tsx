"use client"

import { useEffect, useMemo, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Cancel01Icon,
  ArrowDown01Icon,
  Search01Icon,
  ShoppingCart01Icon,
  Alert02Icon,
  ArrowRight01Icon,
  Tick02Icon,
} from "@hugeicons/core-free-icons"
import { toast } from "sonner"

import { formatRupiah } from "@/lib/format-currency"
import type { PosPageData } from "@/features/pos/types"
import {
  useCartItemCount,
  useCartStore,
  useCartTotal,
} from "@/features/pos/hooks/use-cart"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"

import { PosCart } from "./pos-cart"
import { PosProductGrid, type PosProduct } from "./pos-product-grid"
import { PosReceiptDialog, type TransactionReceipt } from "./pos-receipt-dialog"
import { PosRecentTransactions } from "./pos-recent-transactions"
import { PosSearchBar } from "./pos-search-bar"
import { PosMobileCheckout } from "./pos-mobile-checkout"
import { PosMobilePayment } from "./pos-mobile-payment"

type MobileTab = "barang" | "keranjang" | "pembayaran"

type PosProductsQueryData = Pick<
  PosPageData,
  "products" | "categories" | "lowStockCount"
>

type PosPageClientProps = {
  initialData: PosPageData
  stockReportHref?: string
}

export function PosPageClient({
  initialData,
  stockReportHref,
}: PosPageClientProps) {
  const queryClient = useQueryClient()
  const [mobileTab, setMobileTab] = useState<MobileTab>("barang")
  const [searchQuery, setSearchQuery] = useState("")
  const [isMobileSearchActive, setIsMobileSearchActive] = useState(false)
  const [isMobileCategoryOpen, setIsMobileCategoryOpen] = useState(false)
  const [mobileCategorySnap, setMobileCategorySnap] = useState<number | string | null>(0.5)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [receiptData, setReceiptData] = useState<TransactionReceipt | null>(
    null
  )

  const cartItems = useCartStore((s) => s.items)
  const clearCart = useCartStore((s) => s.clearCart)
  const cartTotal = useCartTotal()
  const itemCount = useCartItemCount()
  const paymentMethod = useCartStore((s) => s.paymentMethod)
  const amountPaid = useCartStore((s) => s.amountPaid)
  const notes = useCartStore((s) => s.notes)

  const initialProductsData: PosProductsQueryData = {
    products: initialData.products,
    categories: initialData.categories,
    lowStockCount: initialData.lowStockCount,
  }

  const { data, isLoading } = useQuery<PosProductsQueryData>({
    queryKey: ["kasir", "barang"],
    queryFn: async () => {
      const res = await fetch("/api/kasir/barang")
      if (!res.ok) throw new Error("Gagal memuat barang")
      return res.json()
    },
    initialData: initialProductsData,
    refetchInterval: 10000,
    refetchOnWindowFocus: true,
  })

  const payMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        items: cartItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
        paymentMethod,
        amountPaid: paymentMethod === "CASH" ? amountPaid : cartTotal,
        notes,
      }
      const res = await fetch("/api/kasir/transaksi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const result = await res.json()
      if (!res.ok) {
        throw new Error(
          result.errors
            ? JSON.stringify(result.errors)
            : (result.error ?? "Gagal memproses transaksi")
        )
      }
      return result
    },
    onSuccess: (result) => {
      setReceiptData(result.transaction)
      queryClient.invalidateQueries({ queryKey: ["kasir", "barang"] })
      queryClient.invalidateQueries({ queryKey: ["kasir", "transaksi-recent"] })
    },
    onError: (error) => {
      try {
        const errors = JSON.parse(error.message)
        const firstErrorMsg = Object.values(errors)[0] as string[]
        toast.error(firstErrorMsg[0])
      } catch {
        toast.error(error.message)
      }
    },
  })

  const filteredProducts = useMemo(() => {
    const products = (data?.products ?? []) as PosProduct[]
    return products.filter((p) => {
      const matchCategory = activeCategory
        ? p.categoryId === activeCategory
        : true
      const matchSearch = p.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
      return matchCategory && matchSearch
    })
  }, [data?.products, activeCategory, searchQuery])

  const categories = (data?.categories ?? []) as { id: string; name: string }[]
  const lowStockCount = (data?.lowStockCount ?? 0) as number
  const activeCategoryName = activeCategory
    ? categories.find((category) => category.id === activeCategory)?.name ?? "Semua Kategori"
    : "Semua Kategori"

  const handlePayment = () => payMutation.mutate()

  const handleNewTransaction = () => {
    setReceiptData(null)
    clearCart()
    setMobileTab("barang")
  }

  useEffect(() => {
    document.body.dataset.posMobileTab = mobileTab
    const event = new CustomEvent("pos-mobile-tab-change", {
      detail: { tab: mobileTab },
    })
    window.dispatchEvent(event)
    const timeout = window.setTimeout(() => {
      window.dispatchEvent(event)
    }, 0)
    return () => {
      window.clearTimeout(timeout)
      document.body.dataset.posMobileTab = "barang"
      window.dispatchEvent(
        new CustomEvent("pos-mobile-tab-change", { detail: { tab: "barang" } })
      )
    }
  }, [mobileTab])

  useEffect(() => {
    const handleTabRequest = (event: Event) => {
      const tab = (event as CustomEvent<{ tab?: MobileTab }>).detail?.tab

      if (tab === "barang" || tab === "keranjang" || tab === "pembayaran") {
        setMobileTab(tab)
      }
    }

    window.addEventListener("pos-mobile-tab-request", handleTabRequest)

    return () =>
      window.removeEventListener("pos-mobile-tab-request", handleTabRequest)
  }, [])

  return (
    <>
      {/* ===== DESKTOP LAYOUT ===== */}
      <div className="hidden h-full gap-4 overflow-hidden bg-background p-4 xl:flex">
        <div className="flex flex-1 flex-col gap-3 overflow-hidden">
          <div className="relative shrink-0">
            <div className="flex h-11 w-full items-center overflow-hidden rounded-xl border bg-card shadow-sm">
              <div className="h-full min-w-0 flex-1">
                <PosSearchBar
                  value={searchQuery}
                  onChange={setSearchQuery}
                  className="h-full rounded-none border-0 bg-transparent focus:ring-0"
                />
              </div>
              <div className="h-6 w-px shrink-0 bg-border" />
              <div className="flex h-full w-[220px] shrink-0 items-center">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className="flex h-full w-full items-center justify-between gap-2 bg-transparent px-3 text-left text-sm outline-none transition-colors hover:bg-muted/50 focus:ring-0"
                    >
                      <span className="truncate">{activeCategoryName}</span>
                      <HugeiconsIcon icon={ArrowDown01Icon} size={14} className="shrink-0 text-muted-foreground" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem onSelect={() => setActiveCategory(null)}>
                      <span>Semua Kategori</span>
                      {!activeCategory && <HugeiconsIcon icon={Tick02Icon} size={16} className="ml-auto" />}
                    </DropdownMenuItem>
                    {categories.map((category) => (
                      <DropdownMenuItem
                        key={category.id}
                        onSelect={() => setActiveCategory(category.id)}
                      >
                        <span>{category.name}</span>
                        {activeCategory === category.id && (
                          <HugeiconsIcon icon={Tick02Icon} size={16} className="ml-auto" />
                        )}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
          <PosProductGrid products={filteredProducts} isLoading={isLoading} />
          <PosRecentTransactions
            initialTransactions={initialData.recentTransactions}
          />
        </div>
        <PosCart
          onPayment={handlePayment}
          isProcessing={payMutation.isPending}
        />
      </div>

      {/* ===== MOBILE/TABLET LAYOUT (3-tab) ===== */}
      <div className="flex h-full flex-col overflow-hidden bg-background xl:hidden">
        <div className="relative flex-1 overflow-hidden">
          {/* TAB 1: BARANG */}
          <div
            className={`absolute inset-0 flex flex-col transition-transform duration-300 ${mobileTab === "barang" ? "translate-x-0" : "pointer-events-none -translate-x-full"}`}
          >
            {/* Low Stock Banner */}
            {lowStockCount > 0 && (
              stockReportHref ? (
                <Link
                  href={stockReportHref}
                  className="mx-3 mt-3 flex min-h-[76px] items-center gap-3 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-400 px-4 py-3 text-white shadow-sm transition-transform active:scale-[0.98]"
                >
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/20">
                    <HugeiconsIcon icon={Alert02Icon} size={22} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold leading-5">Stok Hampir Habis!</p>
                    <p className="text-xs leading-4 opacity-90">
                      {lowStockCount} barang perlu restock
                    </p>
                  </div>
                  <HugeiconsIcon
                    icon={ArrowRight01Icon}
                    size={18}
                    className="opacity-70"
                  />
                </Link>
              ) : (
                <div className="mx-3 mt-3 flex min-h-[76px] items-center gap-3 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-400 px-4 py-3 text-white shadow-sm">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/20">
                    <HugeiconsIcon icon={Alert02Icon} size={22} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold leading-5">Stok Hampir Habis!</p>
                    <p className="text-xs leading-4 opacity-90">
                      {lowStockCount} barang perlu restock
                    </p>
                  </div>
                  <HugeiconsIcon
                    icon={ArrowRight01Icon}
                    size={18}
                    className="opacity-70"
                  />
                </div>
              )
            )}

            {/* Cart Summary Banner */}
            <button
              onClick={() => setMobileTab("keranjang")}
              data-pos-cart-target
              className="mx-3 mt-2 flex min-h-[76px] items-center gap-3 rounded-2xl bg-gradient-to-r from-primary to-primary/85 px-4 py-3 text-primary-foreground shadow-md transition-all active:scale-[0.98]"
            >
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-foreground/15">
                <HugeiconsIcon icon={ShoppingCart01Icon} size={24} />
              </div>
              <div className="min-w-0 flex-1 text-left">
                <div className="flex items-center gap-2">
                  <span className="rounded-md bg-primary-foreground/20 px-2 py-0.5 text-[11px] font-bold">
                    {itemCount} Item
                  </span>
                  <span className="text-xs font-medium opacity-80">
                    Total Belanja
                  </span>
                </div>
                <p className="mt-0.5 text-xl font-extrabold leading-6 tracking-tight">
                  {formatRupiah(cartTotal)}
                </p>
              </div>
              <HugeiconsIcon
                icon={ArrowRight01Icon}
                size={20}
                className="opacity-70"
              />
            </button>

            {/* Search & Filter */}
            <div className="relative shrink-0 px-3 pt-3">
              <div className="flex h-[46px] items-center overflow-hidden rounded-xl border bg-card shadow-sm">
                {!isMobileSearchActive ? (
                  <>
                    <button
                      onClick={() => setIsMobileSearchActive(true)}
                      className="flex h-full w-12 items-center justify-center text-muted-foreground transition-colors hover:bg-muted/50"
                    >
                      <HugeiconsIcon icon={Search01Icon} size={18} />
                    </button>
                    <div className="h-6 w-px bg-border" />
                    <div className="relative h-full flex-1">
                      <button
                        type="button"
                        onClick={() => setIsMobileCategoryOpen(true)}
                        className="flex h-full w-full items-center justify-between gap-2 bg-transparent px-3 text-left text-[13px] outline-none transition-colors hover:bg-muted/50 focus:ring-0"
                      >
                        <span className="truncate">{activeCategoryName}</span>
                        <HugeiconsIcon icon={ArrowDown01Icon} size={14} className="shrink-0 text-muted-foreground" />
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="flex h-full flex-1 items-center px-2">
                    <HugeiconsIcon
                      icon={Search01Icon}
                      size={16}
                      className="ml-2 shrink-0 text-muted-foreground"
                    />
                    <input
                      autoFocus
                      type="text"
                      placeholder="Cari barang..."
                      className="h-full flex-1 bg-transparent px-3 text-[13px] outline-none"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button
                      onClick={() => {
                        setIsMobileSearchActive(false)
                        setSearchQuery("")
                      }}
                      className="flex h-full w-10 items-center justify-center text-muted-foreground hover:text-foreground"
                    >
                      <HugeiconsIcon icon={Cancel01Icon} size={16} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            <PosProductGrid products={filteredProducts} isLoading={isLoading} />
          </div>

          {/* TAB 2: CHECKOUT/KERANJANG */}
          <div
            className={`absolute inset-0 flex flex-col bg-background transition-transform duration-300 ${mobileTab === "keranjang" ? "translate-x-0" : mobileTab === "barang" ? "pointer-events-none translate-x-full" : "pointer-events-none -translate-x-full"}`}
          >
            <div className="min-h-0 flex-1">
              <PosMobileCheckout onProceed={() => setMobileTab("pembayaran")} />
            </div>
          </div>

          {/* TAB 3: PEMBAYARAN */}
          <div
            className={`absolute inset-0 flex flex-col bg-background transition-transform duration-300 ${mobileTab === "pembayaran" ? "translate-x-0" : "pointer-events-none translate-x-full"}`}
          >
            <div className="min-h-0 flex-1">
              <PosMobilePayment
                onPayment={handlePayment}
                isProcessing={payMutation.isPending}
              />
            </div>
          </div>
        </div>
      </div>

      <Drawer
        open={isMobileCategoryOpen}
        onOpenChange={(open) => {
          setIsMobileCategoryOpen(open)
          if (open) setMobileCategorySnap(0.5)
        }}
        snapPoints={[0.5, 1]}
        activeSnapPoint={mobileCategorySnap}
        setActiveSnapPoint={setMobileCategorySnap}
      >
        <DrawerContent
          className="h-[100dvh] max-h-[100dvh] overflow-hidden p-3 pb-4 !mt-0 !max-h-[100dvh] xl:hidden"
        >
          <DrawerHeader className="px-4 pt-4 pb-3 text-left">
            <DrawerTitle className="text-base font-bold">Pilih Kategori</DrawerTitle>
            <DrawerDescription className="text-xs">
              Tampilkan barang berdasarkan kategori.
            </DrawerDescription>
          </DrawerHeader>
          <div className="scrollbar-thin min-h-0 flex-1 overflow-y-auto px-4 pb-2">
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => {
                  setActiveCategory(null)
                  setIsMobileCategoryOpen(false)
                }}
                className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-left transition-colors ${
                  !activeCategory
                    ? "border-primary/30 bg-primary/10 text-primary"
                    : "border-border bg-card text-foreground hover:bg-muted/50"
                }`}
              >
                <span className="text-sm font-semibold">Semua Kategori</span>
                {!activeCategory && <HugeiconsIcon icon={Tick02Icon} size={18} />}
              </button>

              {categories.map((category) => {
                const isActive = activeCategory === category.id

                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => {
                      setActiveCategory(category.id)
                      setIsMobileCategoryOpen(false)
                    }}
                    className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-left transition-colors ${
                      isActive
                        ? "border-primary/30 bg-primary/10 text-primary"
                        : "border-border bg-card text-foreground hover:bg-muted/50"
                    }`}
                  >
                    <span className="truncate text-sm font-semibold">{category.name}</span>
                    {isActive && <HugeiconsIcon icon={Tick02Icon} size={18} />}
                  </button>
                )
              })}
            </div>
          </div>
        </DrawerContent>
      </Drawer>

      <PosReceiptDialog
        open={!!receiptData}
        onOpenChange={(open) => {
          if (!open) handleNewTransaction()
        }}
        transaction={receiptData}
        onNewTransaction={handleNewTransaction}
      />
    </>
  )
}
