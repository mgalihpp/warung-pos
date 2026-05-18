"use client"

import { useEffect, useMemo, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Cancel01Icon,
  Search01Icon,
  ShoppingCart01Icon,
  Alert02Icon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons"
import { toast } from "sonner"

import { formatRupiah } from "@/lib/format-currency"
import {
  useCartItemCount,
  useCartStore,
  useCartTotal,
} from "@/features/pos/hooks/use-cart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { PosCart } from "./pos-cart"
import { PosProductGrid, type PosProduct } from "./pos-product-grid"
import { PosReceiptDialog, type TransactionReceipt } from "./pos-receipt-dialog"
import { PosRecentTransactions } from "./pos-recent-transactions"
import { PosSearchBar } from "./pos-search-bar"
import { PosMobileCheckout } from "./pos-mobile-checkout"
import { PosMobilePayment } from "./pos-mobile-payment"

type MobileTab = "barang" | "keranjang" | "pembayaran"

export function PosPageClient() {
  const queryClient = useQueryClient()
  const [mobileTab, setMobileTab] = useState<MobileTab>("barang")
  const [searchQuery, setSearchQuery] = useState("")
  const [isMobileSearchActive, setIsMobileSearchActive] = useState(false)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [receiptData, setReceiptData] = useState<TransactionReceipt | null>(null)

  const cartItems = useCartStore((s) => s.items)
  const clearCart = useCartStore((s) => s.clearCart)
  const cartTotal = useCartTotal()
  const itemCount = useCartItemCount()
  const paymentMethod = useCartStore((s) => s.paymentMethod)
  const amountPaid = useCartStore((s) => s.amountPaid)
  const notes = useCartStore((s) => s.notes)

  const { data, isLoading } = useQuery({
    queryKey: ["kasir", "barang"],
    queryFn: async () => {
      const res = await fetch("/api/kasir/barang")
      if (!res.ok) throw new Error("Gagal memuat barang")
      return res.json()
    },
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
            : result.error ?? "Gagal memproses transaksi"
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
      const matchCategory = activeCategory ? p.categoryId === activeCategory : true
      const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase())
      return matchCategory && matchSearch
    })
  }, [data?.products, activeCategory, searchQuery])

  const categories = (data?.categories ?? []) as { id: string; name: string }[]
  const lowStockCount = (data?.lowStockCount ?? 0) as number

  const handlePayment = () => payMutation.mutate()

  const handleNewTransaction = () => {
    setReceiptData(null)
    clearCart()
    setMobileTab("barang")
  }

  useEffect(() => {
    document.body.dataset.posMobileTab = mobileTab
    const event = new CustomEvent("pos-mobile-tab-change", { detail: { tab: mobileTab } })
    window.dispatchEvent(event)
    const timeout = window.setTimeout(() => { window.dispatchEvent(event) }, 0)
    return () => {
      window.clearTimeout(timeout)
      document.body.dataset.posMobileTab = "barang"
      window.dispatchEvent(new CustomEvent("pos-mobile-tab-change", { detail: { tab: "barang" } }))
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

    return () => window.removeEventListener("pos-mobile-tab-request", handleTabRequest)
  }, [])

  return (
    <>
      {/* ===== DESKTOP LAYOUT ===== */}
      <div className="hidden h-full gap-4 overflow-hidden bg-muted/40 p-4 xl:flex">
        <div className="flex flex-1 flex-col gap-3 overflow-hidden">
          <div className="relative shrink-0">
            <div className="flex h-11 w-fit items-center overflow-hidden rounded-xl border bg-card shadow-sm">
              <div className="h-full w-[320px] shrink-0">
                <PosSearchBar value={searchQuery} onChange={setSearchQuery} className="h-full rounded-none border-0 bg-transparent focus:ring-0" />
              </div>
              <div className="h-6 w-px shrink-0 bg-border" />
              <div className="flex h-full w-[200px] shrink-0 items-center">
                <Select value={activeCategory || "all"} onValueChange={(val) => setActiveCategory(val === "all" ? null : val)}>
                  <SelectTrigger className="h-full w-full rounded-none border-0 bg-transparent shadow-none focus:ring-0 focus:ring-offset-0"><SelectValue placeholder="Semua Kategori" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Kategori</SelectItem>
                    {categories.map((c) => (<SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <PosProductGrid products={filteredProducts} isLoading={isLoading} />
          <PosRecentTransactions />
        </div>
        <PosCart onPayment={handlePayment} isProcessing={payMutation.isPending} />
      </div>

      {/* ===== MOBILE/TABLET LAYOUT (3-tab) ===== */}
      <div className="flex h-full flex-col overflow-hidden bg-muted/40 xl:hidden">
        <div className="relative flex-1 overflow-hidden">

          {/* TAB 1: BARANG */}
          <div className={`absolute inset-0 flex flex-col transition-transform duration-300 ${mobileTab === "barang" ? "translate-x-0" : "pointer-events-none -translate-x-full"}`}>
            {/* Low Stock Banner */}
            {lowStockCount > 0 && (
              <div className="mx-3 mt-3 flex items-center gap-3 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-400 px-4 py-3 text-white shadow-sm">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-white/20">
                  <HugeiconsIcon icon={Alert02Icon} size={20} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold">Stok Hampir Habis!</p>
                  <p className="text-xs opacity-90">{lowStockCount} produk perlu restock</p>
                </div>
                <HugeiconsIcon icon={ArrowRight01Icon} size={18} className="opacity-70" />
              </div>
            )}

            {/* Cart Summary Banner */}
            <button
              onClick={() => setMobileTab("keranjang")}
              data-pos-cart-target
              className="mx-3 mt-2 flex items-center gap-3 rounded-2xl bg-gradient-to-r from-primary to-primary/85 px-4 py-3 text-primary-foreground shadow-md transition-all active:scale-[0.98]"
            >
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-foreground/15">
                <HugeiconsIcon icon={ShoppingCart01Icon} size={24} />
              </div>
              <div className="min-w-0 flex-1 text-left">
                <div className="flex items-center gap-2">
                  <span className="rounded-md bg-primary-foreground/20 px-2 py-0.5 text-[11px] font-bold">
                    {itemCount} Item
                  </span>
                  <span className="text-xs font-medium opacity-80">Total Belanja</span>
                </div>
                <p className="mt-0.5 text-xl font-extrabold tracking-tight">
                  {formatRupiah(cartTotal)}
                </p>
              </div>
              <HugeiconsIcon icon={ArrowRight01Icon} size={20} className="opacity-70" />
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
                      <Select value={activeCategory || "all"} onValueChange={(val) => setActiveCategory(val === "all" ? null : val)}>
                        <SelectTrigger className="mt-1 h-full w-full rounded-none border-0 bg-transparent shadow-none focus:ring-0 focus:ring-offset-0 focus-visible:ring-0">
                          <SelectValue placeholder="Semua Kategori" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Semua Kategori</SelectItem>
                          {categories.map((c) => (<SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>))}
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                ) : (
                  <div className="flex h-full flex-1 items-center px-2">
                    <HugeiconsIcon icon={Search01Icon} size={16} className="ml-2 shrink-0 text-muted-foreground" />
                    <input
                      autoFocus
                      type="text"
                      placeholder="Cari barang..."
                      className="h-full flex-1 bg-transparent px-3 text-[13px] outline-none"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button
                      onClick={() => { setIsMobileSearchActive(false); setSearchQuery("") }}
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
          <div className={`absolute inset-0 flex flex-col bg-background transition-transform duration-300 ${mobileTab === "keranjang" ? "translate-x-0" : mobileTab === "barang" ? "pointer-events-none translate-x-full" : "pointer-events-none -translate-x-full"}`}>
            <div className="min-h-0 flex-1">
              <PosMobileCheckout onProceed={() => setMobileTab("pembayaran")} />
            </div>
          </div>

          {/* TAB 3: PEMBAYARAN */}
          <div className={`absolute inset-0 flex flex-col bg-background transition-transform duration-300 ${mobileTab === "pembayaran" ? "translate-x-0" : "pointer-events-none translate-x-full"}`}>
            <div className="min-h-0 flex-1">
              <PosMobilePayment onPayment={handlePayment} isProcessing={payMutation.isPending} />
            </div>
          </div>

        </div>
      </div>

      <PosReceiptDialog
        open={!!receiptData}
        onOpenChange={(open) => { if (!open) handleNewTransaction() }}
        transaction={receiptData}
        onNewTransaction={handleNewTransaction}
      />
    </>
  )
}
