import Link from "next/link"
import { Badge } from "@/components/ui/badge"

const lowStockItems = [
  {
    name: "Beras 5kg",
    stock: 6,
    unit: "pcs",
    urgency: "warning" as const,
  },
  {
    name: "Gula Pasir 1kg",
    stock: 4,
    unit: "pcs",
    urgency: "danger" as const,
  },
  {
    name: "Minyak Goreng 1L",
    stock: 3,
    unit: "pcs",
    urgency: "danger" as const,
  },
  {
    name: "Telur Ayam Ras 1kg",
    stock: 8,
    unit: "kg",
    urgency: "warning" as const,
  },
  {
    name: "Mie Instan (Karton)",
    stock: 2,
    unit: "karton",
    urgency: "danger" as const,
  },
]

export function LowStockPanel() {
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
          href="/admin/stok"
          className="text-xs font-medium text-primary hover:underline"
        >
          Lihat Semua
        </Link>
      </div>

      <div className="space-y-3">
        {lowStockItems.map((item) => (
          <div
            key={item.name}
            className="flex items-center justify-between rounded-lg border border-border/50 bg-muted/20 px-3 py-2.5 transition-colors hover:bg-muted/40"
          >
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-lg bg-primary/5 text-lg">
                {item.name.includes("Beras") && "🌾"}
                {item.name.includes("Gula") && "🧂"}
                {item.name.includes("Minyak") && "🫗"}
                {item.name.includes("Telur") && "🥚"}
                {item.name.includes("Mie") && "🍜"}
              </div>
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
