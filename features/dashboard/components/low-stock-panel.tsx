import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import type { LowStockItem } from "@/features/dashboard/hooks/use-dashboard-queries"

export function LowStockPanel({ items }: { items: LowStockItem[] }) {
  const lowStockItems = items
  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold">Stok Menipis</h3>
          <Badge className="bg-destructive/10 text-destructive hover:bg-destructive/20">
            {lowStockItems.length}
          </Badge>
        </div>
        <Link
          href="/admin/laporan/stok"
          className="text-xs font-medium text-primary hover:underline"
        >
          Lihat Semua
        </Link>
      </div>

      <div className="space-y-3">
        {lowStockItems.length === 0 ? (
          <p className="py-6 text-center text-xs text-muted-foreground">Semua stok aman 🎉</p>
        ) : null}
        {lowStockItems.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between rounded-lg border border-border/50 bg-muted/20 px-3 py-2.5 transition-colors hover:bg-muted/40"
          >
            <div className="flex items-center gap-3 min-w-0">
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
              <div className="flex-1 min-w-0">
                <p className="truncate text-xs font-medium">{item.name}</p>
                <p className="text-[11px] text-muted-foreground">Stok: {item.stock}</p>
              </div>
            </div>
            <Badge
              variant="secondary"
              className={
                item.urgency === "danger"
                  ? "bg-destructive/10 text-destructive hover:bg-destructive/20"
                  : "bg-amber-500/10 text-amber-700 hover:bg-amber-500/20"
              }
            >
              {item.stock} {item.unit}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  )
}
