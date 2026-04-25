import Link from "next/link"
import { formatRupiah } from "@/lib/format"

const popularProducts = [
  { rank: 1, name: "Beras Premium 5kg", sold: 124, unit: "pcs", revenue: 9300000, emoji: "🌾" },
  { rank: 2, name: "Minyak Goreng 1L", sold: 98, unit: "pcs", revenue: 5486000, emoji: "🫗" },
  { rank: 3, name: "Mie Instan Goreng", sold: 210, unit: "pcs", revenue: 735000, emoji: "🍜" },
  { rank: 4, name: "Gula Pasir 1kg", sold: 76, unit: "pcs", revenue: 1216000, emoji: "🧂" },
  { rank: 5, name: "Air Mineral 600ml", sold: 180, unit: "pcs", revenue: 720000, emoji: "💧" },
]

export function ProdukPopuler() {
  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold">Produk Populer</h3>
        <Link href="/admin/produk" className="text-xs font-medium text-primary hover:underline">Lihat Semua</Link>
      </div>
      <div className="space-y-3">
        {popularProducts.map((item) => (
          <div key={item.rank} className="flex items-center gap-3 rounded-lg border border-border/50 bg-muted/20 px-3 py-2.5 transition-colors hover:bg-muted/40">
            <div className={`flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${item.rank <= 3 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
              {item.rank}
            </div>
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary/5 text-lg">{item.emoji}</div>
            <div className="flex-1 min-w-0">
              <p className="truncate text-xs font-medium">{item.name}</p>
              <p className="text-[11px] text-muted-foreground">Terjual {item.sold} {item.unit}</p>
            </div>
            <div className="shrink-0 text-right">
              <p className="text-xs font-semibold text-primary">{formatRupiah(item.revenue)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
