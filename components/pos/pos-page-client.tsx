"use client"

import { useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ShoppingCart01Icon,
  UserIcon,
  UserAdd01Icon,
  MinusSignIcon,
  PlusSignIcon,
  Delete02Icon,
  Money01Icon,
  QrCodeIcon,
  BankIcon,
  ArrowLeft01Icon,
} from "@hugeicons/core-free-icons"
import { PosInfoBar } from "./pos-info-bar"
import { PosCategoryFilter } from "./pos-category-filter"
import { PosProductGrid } from "./pos-product-grid"
import { PosRecentTransactions } from "./pos-recent-transactions"
import { PosCart } from "./pos-cart"
import { cartItems, formatCurrency } from "./pos-data"

type MobileTab = "produk" | "keranjang"

export function PosPageClient() {
  const [mobileTab, setMobileTab] = useState<MobileTab>("produk")
  const itemCount = cartItems.reduce((sum, i) => sum + i.qty, 0)
  const total = 160000

  return (
    <>
      <div className="hidden xl:flex h-[calc(100vh-3.5rem)] bg-muted/40 p-4 gap-4 overflow-hidden">
        <div className="flex-1 flex flex-col gap-4 overflow-hidden">
          <PosInfoBar />
          <PosCategoryFilter />
          <PosProductGrid />
          <PosRecentTransactions />
        </div>
        <PosCart />
      </div>

      <div className="flex xl:hidden flex-col h-[calc(100dvh-3.5rem)] bg-muted/40 overflow-hidden">

        {/* Mobile Top Bar */}
        <div className="bg-card border-b px-3 py-2 shrink-0">
          <div className="flex items-center justify-between gap-2">
            {/* Left: kasir + trx info */}
            <div className="flex items-center gap-2 min-w-0">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <HugeiconsIcon icon={UserIcon} size={16} />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] text-muted-foreground leading-none">Kasir: <strong className="text-foreground">Siti</strong></span>
                <span className="text-xs font-bold text-primary truncate">TRX-240524-019</span>
              </div>
            </div>

          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-hidden relative">

          {/* ── Tab: Produk ─────────────────────────────────────────── */}
          <div className={`absolute inset-0 flex flex-col gap-3 transition-transform duration-300 ${mobileTab === "produk" ? "translate-x-0" : "-translate-x-full pointer-events-none"}`}>
            {/* Category filter */}
            <div className="px-3 pt-3 shrink-0">
              <PosCategoryFilter />
            </div>

            {/* Product grid */}
            <div className="flex-1 overflow-y-auto px-3 pb-28 scrollbar-hide">
              <div className="grid grid-cols-2 gap-3">
                {/* Inline mini product cards optimized for mobile touch */}
                {[
                  { id: 1, name: "Beras 5kg", price: 75000, stock: 24 },
                  { id: 2, name: "Gula Pasir 1kg", price: 16000, stock: 36 },
                  { id: 3, name: "Minyak Goreng 1L", price: 18000, stock: 28 },
                  { id: 4, name: "Telur Ayam 1kg", price: 28000, stock: 40 },
                  { id: 5, name: "Mie Instan", price: 3500, stock: 120 },
                  { id: 6, name: "Tepung Terigu 1kg", price: 14000, stock: 30 },
                  { id: 7, name: "Kecap Manis", price: 12000, stock: 22 },
                  { id: 8, name: "Air Mineral 600ml", price: 4000, stock: 100 },
                  { id: 9, name: "Kopi Sachet", price: 2500, stock: 80 },
                  { id: 10, name: "Sabun Mandi", price: 5500, stock: 45 },
                  { id: 11, name: "Deterjen 800g", price: 18000, stock: 25 },
                  { id: 12, name: "Susu Kental Manis", price: 11000, stock: 32 },
                ].map((product) => (
                  <div key={product.id} className="bg-card border rounded-xl p-3 flex flex-col active:scale-[0.98] transition-transform">
                    {/* Product avatar */}
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary text-xl font-bold border border-primary/20 mb-2">
                      {product.name.charAt(0)}
                    </div>
                    <span className="text-sm font-semibold text-foreground line-clamp-2 leading-tight mb-1">
                      {product.name}
                    </span>
                    <span className="text-sm font-bold text-primary mb-1">
                      {formatCurrency(product.price)}
                    </span>
                    <span className="text-[10px] text-muted-foreground mb-3">Stok {product.stock}</span>
                    <button className="w-full py-2 flex items-center justify-center gap-1 border border-primary/30 text-primary rounded-lg text-xs font-semibold hover:bg-primary/10 active:bg-primary/20 transition-colors mt-auto">
                      <HugeiconsIcon icon={PlusSignIcon} size={14} />
                      Tambah
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Sticky Cart Peek Bar */}
            <div className="absolute bottom-0 left-0 right-0 px-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
              <button
                onClick={() => setMobileTab("keranjang")}
                className="w-full bg-primary text-primary-foreground rounded-xl px-4 py-3.5 flex items-center justify-between shadow-lg active:bg-primary/90 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <HugeiconsIcon icon={ShoppingCart01Icon} size={20} />
                    <span className="absolute -top-2 -right-2 flex size-4 items-center justify-center rounded-full bg-primary-foreground text-primary text-[9px] font-bold">
                      {itemCount}
                    </span>
                  </div>
                  <span className="font-semibold text-sm">Lihat Keranjang</span>
                </div>
                <span className="font-bold text-sm">{formatCurrency(total)}</span>
              </button>
            </div>
          </div>

          {/* ── Tab: Keranjang ──────────────────────────────────────── */}
          <div className={`absolute inset-0 flex flex-col bg-muted/40 transition-transform duration-300 ${mobileTab === "keranjang" ? "translate-x-0" : "translate-x-full pointer-events-none"}`}>
            {/* Cart mobile header */}
            <div className="bg-card border-b px-4 py-3 flex items-center gap-3 shrink-0">
              <button
                onClick={() => setMobileTab("produk")}
                className="flex size-8 items-center justify-center rounded-lg border hover:bg-accent transition-colors shrink-0"
              >
                <HugeiconsIcon icon={ArrowLeft01Icon} size={16} />
              </button>
              <div className="flex items-center gap-2 flex-1">
                <HugeiconsIcon icon={ShoppingCart01Icon} size={18} className="text-primary" />
                <h2 className="font-bold text-foreground">Keranjang Belanja</h2>
              </div>
              <span className="text-xs bg-primary/10 text-primary font-bold px-2 py-0.5 rounded-full">
                {itemCount} item
              </span>
            </div>

            {/* Customer row */}
            <div className="px-4 py-2.5 border-b bg-card flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                  <HugeiconsIcon icon={UserIcon} size={16} />
                </div>
                <span className="text-sm font-medium text-foreground">Pelanggan Umum</span>
              </div>
              <button className="text-xs font-semibold text-primary flex items-center gap-1 bg-primary/10 px-2.5 py-1.5 rounded-lg hover:bg-primary/20 transition-colors">
                <HugeiconsIcon icon={UserAdd01Icon} size={14} />
                Pilih
              </button>
            </div>

            {/* Cart items */}
            <div className="flex-1 overflow-y-auto px-3 py-2 scrollbar-hide">
              <div className="flex flex-col gap-2">
                {cartItems.map((item) => (
                  <div key={item.id} className="bg-card border rounded-xl p-3 flex items-center gap-3 group">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border bg-primary/10 border-primary/20 text-primary font-bold">
                      {item.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{item.name}</p>
                      <p className="text-xs text-primary font-bold">{formatCurrency(item.price)}</p>
                    </div>
                    {/* Qty controls */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button className="flex size-7 items-center justify-center rounded-lg border bg-muted hover:bg-muted/80 transition-colors">
                        <HugeiconsIcon icon={MinusSignIcon} size={14} />
                      </button>
                      <span className="text-sm font-bold text-foreground w-5 text-center">{item.qty}</span>
                      <button className="flex size-7 items-center justify-center rounded-lg border bg-muted hover:bg-muted/80 transition-colors">
                        <HugeiconsIcon icon={PlusSignIcon} size={14} />
                      </button>
                    </div>
                    <div className="text-right shrink-0 min-w-[64px]">
                      <p className="text-sm font-bold text-foreground">{formatCurrency(item.subtotal)}</p>
                      <button className="text-destructive hover:text-destructive/80 mt-0.5">
                        <HugeiconsIcon icon={Delete02Icon} size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Footer */}
            <div className="bg-card border-t px-4 pt-3 pb-[calc(1rem+env(safe-area-inset-bottom))] shrink-0">
              {/* Summary */}
              <div className="bg-card border rounded-xl p-3.5 flex flex-col gap-1.5 text-sm mb-3 shadow-sm">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-foreground text-base">Total Pembayaran</span>
                  <span className="text-lg font-bold text-primary">{formatCurrency(160000)}</span>
                </div>
              </div>

              {/* Payment method */}
              <div className="grid grid-cols-3 gap-2 mb-3">
                <button className="flex items-center justify-center gap-1.5 py-2.5 border border-primary bg-primary/10 text-primary rounded-xl text-xs font-semibold">
                  <HugeiconsIcon icon={Money01Icon} size={14} />
                  Tunai
                </button>
                <button className="flex items-center justify-center gap-1.5 py-2.5 border bg-card text-muted-foreground hover:bg-accent rounded-xl text-xs font-semibold">
                  <HugeiconsIcon icon={QrCodeIcon} size={14} />
                  QRIS
                </button>
                <button className="flex items-center justify-center gap-1.5 py-2.5 border bg-card text-muted-foreground hover:bg-accent rounded-xl text-xs font-semibold">
                  <HugeiconsIcon icon={BankIcon} size={14} />
                  Transfer
                </button>
              </div>

              {/* Uang & Kembalian */}
              <div className="flex gap-2 mb-3">
                <div className="flex-1">
                  <span className="text-[10px] font-semibold text-muted-foreground mb-1 block">Uang Diterima</span>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium">Rp</span>
                    <input
                      type="text"
                      className="w-full border bg-card text-foreground rounded-lg pl-8 pr-3 py-2.5 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      defaultValue="200.000"
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <span className="text-[10px] font-semibold text-muted-foreground mb-1 block">Kembalian</span>
                  <div className="w-full h-[42px] bg-primary/10 border border-primary/30 rounded-lg flex items-center justify-center text-sm font-bold text-primary">
                    {formatCurrency(40000)}
                  </div>
                </div>
              </div>

              {/* CTA */}
              <button className="w-full bg-primary hover:bg-primary/90 active:bg-primary/80 text-primary-foreground rounded-xl py-3.5 flex items-center justify-center font-bold shadow-sm transition-colors mb-2">
                Bayar
              </button>
              <button className="w-full bg-card border border-destructive/20 hover:bg-destructive/10 text-destructive rounded-xl py-3.5 flex items-center justify-center gap-2 font-bold shadow-sm transition-colors">
                <HugeiconsIcon icon={Delete02Icon} size={18} />
                <span>Hapus Keranjang</span>
              </button>
            </div>
          </div>
        </div>


      </div>
    </>
  )
}
