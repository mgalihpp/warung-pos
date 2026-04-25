import Link from "next/link"
import { formatRupiah } from "@/lib/format"

const bestSellers = [
  {
    rank: 1,
    name: "Beras 5kg",
    sold: 128,
    unit: "pcs",
    revenue: 1920000,
    emoji: "🌾",
  },
  {
    rank: 2,
    name: "Minyak Goreng 1L",
    sold: 96,
    unit: "pcs",
    revenue: 1440000,
    emoji: "🫗",
  },
  {
    rank: 3,
    name: "Gula Pasir 1kg",
    sold: 88,
    unit: "pcs",
    revenue: 880000,
    emoji: "🧂",
  },
  {
    rank: 4,
    name: "Mie Instan (Karton)",
    sold: 72,
    unit: "karton",
    revenue: 720000,
    emoji: "🍜",
  },
  {
    rank: 5,
    name: "Telur Ayam Ras 1kg",
    sold: 60,
    unit: "kg",
    revenue: 660000,
    emoji: "🥚",
  },
]

export function BestSellersPanel() {
  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold">Produk Terlaris</h3>
        <Link
          href="/admin/produk"
          className="text-xs font-medium text-primary hover:underline"
        >
          Lihat Semua
        </Link>
      </div>

      <div className="space-y-3">
        {bestSellers.map((item) => (
          <div
            key={item.rank}
            className="flex items-center gap-3 rounded-lg border border-border/50 bg-muted/20 px-3 py-2.5 transition-colors hover:bg-muted/40"
          >
            {/* Rank Badge */}
            <div
              className={`flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                item.rank === 1
                  ? "bg-primary text-primary-foreground"
                  : item.rank === 2
                    ? "bg-primary/70 text-primary-foreground"
                    : item.rank === 3
                      ? "bg-primary/50 text-primary-foreground"
                      : "bg-muted text-muted-foreground"
              }`}
            >
              {item.rank}
            </div>

            {/* Emoji Icon */}
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary/5 text-lg">
              {item.emoji}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="truncate text-xs font-medium">{item.name}</p>
              <p className="text-[11px] text-muted-foreground">
                Terjual {item.sold} {item.unit}
              </p>
            </div>

            {/* Revenue */}
            <div className="shrink-0 text-right">
              <p className="text-xs font-semibold text-primary">
                {formatRupiah(item.revenue)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
