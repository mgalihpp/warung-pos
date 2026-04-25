import { HugeiconsIcon } from "@hugeicons/react"
import {
  UserIcon,
  ShoppingCart01Icon,
  MinusSignIcon,
  PlusSignIcon,
  Delete02Icon,
  Money01Icon,
  QrCodeIcon,
  BankIcon,
  UserAdd01Icon,
} from "@hugeicons/core-free-icons"
import { cartItems, formatCurrency } from "./pos-data"

export function PosCart() {
  const total = 160000

  return (
    <div className="w-[360px] xl:w-[400px] bg-card border rounded-xl flex flex-col shadow-sm shrink-0 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b flex items-center gap-2">
        <HugeiconsIcon icon={ShoppingCart01Icon} size={20} className="text-primary" />
        <h2 className="font-bold text-foreground">Keranjang Belanja</h2>
      </div>

      {/* Customer Select */}
      <div className="p-3 border-b flex items-center justify-between bg-muted/30">
        <div className="flex items-center gap-2">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground">
            <HugeiconsIcon icon={UserIcon} size={16} />
          </div>
          <span className="text-sm font-medium text-foreground">Pelanggan Umum</span>
        </div>
        <button className="text-xs font-semibold text-primary flex items-center gap-1 bg-primary/10 px-2 py-1.5 rounded-lg hover:bg-primary/20 transition-colors">
          <HugeiconsIcon icon={UserAdd01Icon} size={14} />
          Pelanggan
        </button>
      </div>

      {/* Cart Headers */}
      <div className="grid grid-cols-12 gap-2 px-4 py-2 border-b bg-muted/30 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
        <div className="col-span-5">Item</div>
        <div className="col-span-3 text-right">Harga</div>
        <div className="col-span-2 text-center">Qty</div>
        <div className="col-span-2 text-right">Subtotal</div>
      </div>

      {/* Cart Items List */}
      <div className="flex-1 overflow-y-auto p-2 scrollbar-hide">
        <div className="flex flex-col gap-2">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="grid grid-cols-12 gap-2 items-center p-2 rounded-lg hover:bg-accent group transition-colors"
            >
              {/* Item Info */}
              <div className="col-span-5 flex items-center gap-2">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-xl border bg-primary/10 border-primary/20 text-primary text-xs font-bold">
                  {item.name.charAt(0)}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-foreground line-clamp-1">{item.name}</span>
                  <span className="text-[10px] text-muted-foreground">{formatCurrency(item.price)}</span>
                </div>
              </div>

              {/* Price */}
              <div className="col-span-3 text-right text-xs font-medium text-muted-foreground">
                {formatCurrency(item.price)}
              </div>

              {/* Qty Controls */}
              <div className="col-span-2 flex items-center justify-center gap-1">
                <button className="flex size-5 items-center justify-center rounded-md border bg-card text-muted-foreground hover:bg-muted transition-colors">
                  <HugeiconsIcon icon={MinusSignIcon} size={12} />
                </button>
                <span className="text-xs font-semibold w-3 text-center text-foreground">{item.qty}</span>
                <button className="flex size-5 items-center justify-center rounded-md border bg-card text-muted-foreground hover:bg-muted transition-colors">
                  <HugeiconsIcon icon={PlusSignIcon} size={12} />
                </button>
              </div>

              {/* Subtotal & Delete */}
              <div className="col-span-2 flex items-center justify-end gap-1 relative">
                <span className="text-xs font-bold text-foreground group-hover:opacity-0 transition-opacity">
                  {formatCurrency(item.subtotal)}
                </span>
                <button className="absolute right-0 opacity-0 group-hover:opacity-100 text-destructive hover:text-destructive/80 transition-opacity">
                  <HugeiconsIcon icon={Delete02Icon} size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Totals Area */}
      <div className="p-4 border-t bg-muted/30">
        {/* Summary */}
        <div className="bg-card border rounded-xl p-4 flex flex-col gap-2 text-sm mb-3 shadow-sm">
          <div className="flex justify-between items-center">
            <span className="font-bold text-foreground text-base">Total Pembayaran</span>
            <span className="text-xl font-bold text-primary">{formatCurrency(total)}</span>
          </div>
        </div>

        {/* Payment Method */}
        <div className="mb-4">
          <span className="text-xs font-semibold text-muted-foreground mb-2 block">Metode Pembayaran</span>
          <div className="grid grid-cols-3 gap-2">
            <button className="flex items-center justify-center gap-1.5 py-2 border border-primary bg-primary/10 text-primary rounded-lg text-xs font-semibold transition-colors">
              <HugeiconsIcon icon={Money01Icon} size={14} />
              Tunai
            </button>
            <button className="flex items-center justify-center gap-1.5 py-2 border bg-card text-muted-foreground hover:bg-accent rounded-lg text-xs font-semibold transition-colors">
              <HugeiconsIcon icon={QrCodeIcon} size={14} />
              QRIS
            </button>
            <button className="flex items-center justify-center gap-1.5 py-2 border bg-card text-muted-foreground hover:bg-accent rounded-lg text-xs font-semibold transition-colors">
              <HugeiconsIcon icon={BankIcon} size={14} />
              Transfer
            </button>
          </div>
        </div>

        {/* Uang Diterima & Kembalian */}
        <div className="flex gap-3 mb-4">
          <div className="flex-1 flex flex-col">
            <span className="text-xs font-semibold text-muted-foreground mb-1">Uang Diterima</span>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium">Rp</span>
              <input
                type="text"
                className="w-full border bg-card text-foreground rounded-lg pl-8 pr-3 py-2 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                defaultValue="200.000"
              />
            </div>
          </div>
          <div className="flex-1 flex flex-col">
            <span className="text-xs font-semibold text-muted-foreground mb-1">Kembalian</span>
            <div className="w-full bg-primary/10 border border-primary/30 rounded-lg px-3 py-2 flex items-center justify-center text-sm font-bold text-primary">
              {formatCurrency(40000)}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2">
          <button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl py-3 flex items-center justify-center font-bold shadow-sm transition-colors">
            Bayar
          </button>
          <button className="w-full bg-card border border-destructive/20 hover:bg-destructive/10 text-destructive rounded-xl py-3 flex items-center justify-center gap-2 font-bold shadow-sm transition-colors">
            <HugeiconsIcon icon={Delete02Icon} size={18} />
            <span>Hapus Keranjang</span>
          </button>
        </div>
      </div>
    </div>
  )
}
