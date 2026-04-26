"use client"

import { useState, useMemo } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ShoppingCart01Icon,
  ArrowLeft01Icon,
  Search01Icon,
  Cancel01Icon,
} from "@hugeicons/core-free-icons"
import { formatRupiah } from "@/lib/format-currency"
import { PosProductGrid, type PosProduct } from "./pos-product-grid"
import { PosRecentTransactions } from "./pos-recent-transactions"
import { PosCart } from "./pos-cart"
import { PosSearchBar } from "./pos-search-bar"
import { PosReceiptDialog, type TransactionReceipt } from "./pos-receipt-dialog"
import { useCartStore, useCartTotal, useCartItemCount } from "@/hooks/use-cart"
import { toast } from "sonner"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type MobileTab = "produk" | "keranjang"

type PosPageClientProps = {
  cashierName: string
  cashierId: string
}

export function PosPageClient({ cashierName }: PosPageClientProps) {
  const queryClient = useQueryClient()
  const [mobileTab, setMobileTab] = useState<MobileTab>("produk")
  const [searchQuery, setSearchQuery] = useState("")
  const [isMobileSearchActive, setIsMobileSearchActive] = useState(false)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [receiptData, setReceiptData] = useState<TransactionReceipt | null>(
    null
  )

  // Cart state
  const cartItems = useCartStore((s) => s.items)
  const clearCart = useCartStore((s) => s.clearCart)
  const cartTotal = useCartTotal()
  const itemCount = useCartItemCount()
  const paymentMethod = useCartStore((s) => s.paymentMethod)
  const amountPaid = useCartStore((s) => s.amountPaid)
  const notes = useCartStore((s) => s.notes)

  // Data fetching
  const { data, isLoading } = useQuery({
    queryKey: ["kasir", "produk"],
    queryFn: async () => {
      const res = await fetch("/api/kasir/produk")
      if (!res.ok) throw new Error("Gagal memuat produk")
      return res.json()
    },
  })

  // Transaction mutation
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
      if (!res.ok)
        throw new Error(
          result.errors
            ? JSON.stringify(result.errors)
            : result.error
              ? result.error
              : "Gagal memproses transaksi"
        )
      return result
    },
    onSuccess: (data) => {
      toast.success("Transaksi berhasil!")
      setReceiptData(data.transaction)
      queryClient.invalidateQueries({ queryKey: ["kasir", "produk"] })
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

  // Filtering
  const products = (data?.products ?? []) as PosProduct[]
  const categories = (data?.categories ?? []) as { id: string; name: string }[]

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchCategory = activeCategory
        ? p.categoryId === activeCategory
        : true
      const matchSearch = p.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
      return matchCategory && matchSearch
    })
  }, [products, activeCategory, searchQuery])

  const handlePayment = () => {
    payMutation.mutate()
  }

  const handleNewTransaction = () => {
    setReceiptData(null)
    clearCart()
    setMobileTab("produk")
  }

  return (
    <>
      {/* Desktop Layout */}
      <div className="hidden h-full gap-4 overflow-hidden bg-muted/40 p-4 xl:flex">
        <div className="flex flex-1 flex-col gap-4 overflow-hidden">
          <div className="flex h-11 w-fit shrink-0 items-center overflow-hidden rounded-xl border bg-card shadow-sm">
            <div className="h-full w-[320px] shrink-0">
              <PosSearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                className="h-full rounded-none border-0 bg-transparent focus:ring-0"
              />
            </div>
            <div className="h-6 w-px shrink-0 bg-border" />
            <div className="flex h-full w-[200px] shrink-0 items-center">
              <Select
                value={activeCategory || "all"}
                onValueChange={(val) =>
                  setActiveCategory(val === "all" ? null : val)
                }
              >
                <SelectTrigger className="h-full w-full rounded-none border-0 bg-transparent shadow-none focus:ring-0 focus:ring-offset-0">
                  <SelectValue placeholder="Semua Kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Kategori</SelectItem>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <PosProductGrid products={filteredProducts} isLoading={isLoading} />
          <PosRecentTransactions />
        </div>
        <PosCart
          onPayment={handlePayment}
          isProcessing={payMutation.isPending}
        />
      </div>

      {/* Mobile Layout */}
      <div className="flex h-full flex-col overflow-hidden bg-muted/40 xl:hidden">
        {/* Tab Content */}
        <div className="relative flex-1 overflow-hidden">
          {/* Tab: Produk */}
          <div
            className={`absolute inset-0 flex flex-col gap-3 transition-transform duration-300 ${
              mobileTab === "produk"
                ? "translate-x-0"
                : "pointer-events-none -translate-x-full"
            }`}
          >
            {/* Mobile Header: Category Dropdown & Search Icon */}
            <div className="shrink-0 px-3 pt-3">
              <div className="flex h-[46px] items-center overflow-hidden rounded-xl border bg-card shadow-sm">
                {!isMobileSearchActive ? (
                  <>
                    <div className="relative h-full flex-1">
                      <Select
                        value={activeCategory || "all"}
                        onValueChange={(val) =>
                          setActiveCategory(val === "all" ? null : val)
                        }
                      >
                        <SelectTrigger className="mt-1 h-full w-full rounded-none border-0 bg-transparent shadow-none focus:ring-0 focus:ring-offset-0 focus-visible:ring-0">
                          <SelectValue placeholder="Pilih kategori" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Semua Produk</SelectItem>
                          {categories.map((c) => (
                            <SelectItem key={c.id} value={c.id}>
                              {c.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="h-6 w-px bg-border" />
                    <button
                      onClick={() => setIsMobileSearchActive(true)}
                      className="flex h-full w-12 items-center justify-center text-muted-foreground transition-colors hover:bg-muted/50"
                    >
                      <HugeiconsIcon icon={Search01Icon} size={18} />
                    </button>
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
                      placeholder="Cari produk..."
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

            {/* Sticky Cart Peek Bar */}
            <div className="pointer-events-none absolute right-0 bottom-0 left-0 bg-gradient-to-t from-background via-background to-transparent px-3 pt-6 pb-4">
              <button
                onClick={() => setMobileTab("keranjang")}
                className="pointer-events-auto flex w-full items-center justify-between rounded-xl bg-primary px-4 py-3.5 text-primary-foreground shadow-lg transition-all active:scale-[0.98]"
              >
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <HugeiconsIcon icon={ShoppingCart01Icon} size={20} />
                    {itemCount > 0 && (
                      <span className="absolute -top-2 -right-2 flex size-4 items-center justify-center rounded-full bg-primary-foreground text-[9px] font-bold text-primary">
                        {itemCount}
                      </span>
                    )}
                  </div>
                  <span className="text-sm font-semibold">Lihat Keranjang</span>
                </div>
                <span className="text-sm font-bold">
                  {formatRupiah(cartTotal)}
                </span>
              </button>
            </div>
          </div>

          {/* Tab: Keranjang */}
          <div
            className={`absolute inset-0 flex flex-col bg-muted/40 transition-transform duration-300 ${
              mobileTab === "keranjang"
                ? "translate-x-0"
                : "pointer-events-none translate-x-full"
            }`}
          >
            {/* Cart mobile header */}
            <div className="flex shrink-0 items-center gap-3 border-b bg-card px-4 py-3">
              <button
                onClick={() => setMobileTab("produk")}
                className="flex size-8 shrink-0 items-center justify-center rounded-lg border transition-colors hover:bg-accent"
              >
                <HugeiconsIcon icon={ArrowLeft01Icon} size={16} />
              </button>
              <div className="flex flex-1 items-center gap-2">
                <HugeiconsIcon
                  icon={ShoppingCart01Icon}
                  size={18}
                  className="text-primary"
                />
                <h2 className="font-bold text-foreground">Keranjang Belanja</h2>
              </div>
              {itemCount > 0 && (
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">
                  {itemCount} item
                </span>
              )}
            </div>

            {/* Reusing desktop cart UI in mobile container */}
            <div className="flex-1 overflow-y-auto">
              <div className="w-full max-w-none rounded-none border-none shadow-none">
                <PosCart
                  onPayment={handlePayment}
                  isProcessing={payMutation.isPending}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

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
