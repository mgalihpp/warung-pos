"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import { PlusSignIcon, ArrowRight01Icon } from "@hugeicons/core-free-icons"

const activities = [
  { type: "added", label: "Produk baru ditambahkan", product: "Deterjen Cair 1L", time: "10:30", iconBg: "bg-primary/10", iconColor: "text-primary" },
  { type: "stock", label: "Stok diperbarui", product: "Tepung Terigu 1kg (+15)", time: "09:45", iconBg: "bg-blue-500/10", iconColor: "text-blue-600" },
  { type: "price", label: "Harga diperbarui", product: "Minyak Goreng 1L", time: "09:15", iconBg: "bg-amber-500/10", iconColor: "text-amber-600" },
  { type: "deactivated", label: "Produk diaktifkan", product: "Susu Kental Manis 370g", time: "08:30", iconBg: "bg-primary/10", iconColor: "text-primary" },
]

export function ProdukAktivitas() {
  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold">Aktivitas Produk Terbaru</h3>
        <button className="text-xs font-medium text-primary hover:underline">Lihat Semua</button>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {activities.map((act, i) => (
          <div key={i} className="flex items-center gap-3 rounded-lg border border-border/50 bg-muted/20 px-3 py-2.5">
            <div className={`flex size-8 shrink-0 items-center justify-center rounded-full ${act.iconBg}`}>
              <HugeiconsIcon icon={act.type === "added" ? PlusSignIcon : ArrowRight01Icon} size={14} className={act.iconColor} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-medium text-muted-foreground">{act.label}</p>
              <p className="truncate text-xs font-medium">{act.product}</p>
            </div>
            <span className="shrink-0 text-[10px] text-muted-foreground">{act.time}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
