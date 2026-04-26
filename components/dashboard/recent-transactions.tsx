import Link from "next/link"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { formatRupiah } from "@/lib/format-currency"

const transactions = [
  {
    no: 1,
    waktu: "24 Mei 2025 09:42",
    kasir: "Siti",
    initials: "SI",
    items: "Beras 5kg, Minyak 1L, Gula 1kg",
    total: 125000,
    status: "Selesai" as const,
  },
  {
    no: 2,
    waktu: "24 Mei 2025 09:15",
    kasir: "Doni",
    initials: "DO",
    items: "Mie Instan, Telur 1kg, Kecap",
    total: 78000,
    status: "Selesai" as const,
  },
  {
    no: 3,
    waktu: "24 Mei 2025 08:50",
    kasir: "Siti",
    initials: "SI",
    items: "Beras 2.5kg, Gula 1kg",
    total: 60000,
    status: "Selesai" as const,
  },
  {
    no: 4,
    waktu: "24 Mei 2025 08:23",
    kasir: "Doni",
    initials: "DO",
    items: "Sabun, Shampoo, Pasta Gigi",
    total: 45000,
    status: "Selesai" as const,
  },
  {
    no: 5,
    waktu: "24 Mei 2025 07:58",
    kasir: "Siti",
    initials: "SI",
    items: "Minyak 1L, Tepung 1kg, Garam",
    total: 68000,
    status: "Pending" as const,
  },
]

export function RecentTransactions() {
  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold">Transaksi Terbaru</h3>
        <Link
          href="/admin/transaksi"
          className="text-xs font-medium text-primary hover:underline"
        >
          Lihat Semua
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-xs text-muted-foreground">
              <th className="pb-2.5 pr-3 font-medium">No</th>
              <th className="pb-2.5 pr-3 font-medium">Waktu</th>
              <th className="pb-2.5 pr-3 font-medium">Kasir</th>
              <th className="pb-2.5 pr-3 font-medium">Item</th>
              <th className="pb-2.5 pr-3 text-right font-medium">Total</th>
              <th className="pb-2.5 text-center font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.no} className="border-b border-border/50 last:border-0">
                <td className="py-3 pr-3 text-muted-foreground">{tx.no}</td>
                <td className="py-3 pr-3 whitespace-nowrap text-xs text-muted-foreground">
                  {tx.waktu}
                </td>
                <td className="py-3 pr-3">
                  <div className="flex items-center gap-2">
                    <Avatar className="size-6">
                      <AvatarFallback className="bg-primary/10 text-[10px] font-semibold text-primary">
                        {tx.initials}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs font-medium">{tx.kasir}</span>
                  </div>
                </td>
                <td className="max-w-[180px] truncate py-3 pr-3 text-xs text-muted-foreground">
                  {tx.items}
                </td>
                <td className="py-3 pr-3 text-right text-xs font-semibold">
                  {formatRupiah(tx.total)}
                </td>
                <td className="py-3 text-center">
                  <Badge
                    variant={tx.status === "Selesai" ? "default" : "secondary"}
                    className={
                      tx.status === "Selesai"
                        ? "bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/20"
                        : "bg-amber-500/10 text-amber-700 hover:bg-amber-500/20"
                    }
                  >
                    {tx.status === "Selesai" ? "✓" : "⏳"} {tx.status}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-3 text-center">
        <Link
          href="/admin/transaksi"
          className="inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          Lihat Semua Transaksi ▾
        </Link>
      </div>
    </div>
  )
}
