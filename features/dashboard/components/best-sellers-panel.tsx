import Link from "next/link"
import Image from "next/image"
import { formatRupiah } from "@/lib/format-currency"
import type { BestSellerItem } from "@/features/dashboard/hooks/use-dashboard-queries"

export function BestSellersPanel({ items }: { items: BestSellerItem[] }) {
  const bestSellers = items
  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold">Barang Terlaris</h3>
        <Link
          href="/admin/barang"
          className="text-xs font-medium text-primary hover:underline"
        >
          Lihat Semua
        </Link>
      </div>

      <div className="space-y-3">
        {bestSellers.length === 0 ? (
          <p className="py-6 text-center text-xs text-muted-foreground">Belum ada penjualan bulan ini</p>
        ) : null}
        {bestSellers.map((item) => (
          <div
            key={item.id}
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

            {/* Product Image */}
            {item.image ? (
              <Image
                src={item.image}
                alt={item.name}
                width={36}
                height={36}
                className="size-9 shrink-0 rounded-lg bg-white object-contain"
              />
            ) : (
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/5 text-sm font-bold text-primary">
                {item.name.charAt(0)}
              </div>
            )}

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium break-words">{item.name}</p>
              <p className="text-[11px] text-muted-foreground">
                Terjual {item.sold} {item.unit}
              </p>
            </div>

            {/* Revenue */}
            <div className="shrink-0 text-right">
              <p className="text-xs font-semibold text-primary break-words">
                {formatRupiah(item.revenue)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
