import Link from "next/link"
import { formatRupiah } from "@/lib/format"
import type { ProdukPopularItem } from "./types"

type ProdukPopulerProps = {
  products: ProdukPopularItem[]
}

export function ProdukPopuler({ products }: ProdukPopulerProps) {
  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold">Produk Populer</h3>
        <Link
          href="/admin/produk"
          className="text-xs font-medium text-primary hover:underline"
        >
          Lihat Semua
        </Link>
      </div>
      <div className="space-y-3">
        {products.length === 0 && (
          <div className="rounded-lg border border-dashed p-4 text-center text-xs text-muted-foreground">
            Belum ada transaksi produk.
          </div>
        )}
        {products.map((item) => (
          <div
            key={item.rank}
            className="flex items-center gap-3 rounded-lg border border-border/50 bg-muted/20 px-3 py-2.5 transition-colors hover:bg-muted/40"
          >
            <div
              className={`flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${item.rank <= 3 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
            >
              {item.rank}
            </div>
            {item.image ? (
              <img
                src={item.image}
                alt={item.name}
                className="size-9 shrink-0 rounded-lg bg-white object-contain"
                loading="lazy"
              />
            ) : (
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/5 text-sm font-bold text-primary">
                {item.name.charAt(0)}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium">{item.name}</p>
              <p className="text-[11px] text-muted-foreground">
                Terjual {item.sold} {item.unit}
              </p>
            </div>
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
