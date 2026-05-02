import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowRight01Icon } from "@hugeicons/core-free-icons"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { formatRupiah } from "@/lib/format-currency"
import type { RecentTransactionItem } from "@/features/dashboard/hooks/use-dashboard-queries"

export function RecentTransactions({ transactions }: { transactions: RecentTransactionItem[] }) {
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

      <div className="hidden overflow-x-auto md:block">
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
            {transactions.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-xs text-muted-foreground">
                  Belum ada transaksi
                </td>
              </tr>
            ) : null}
            {transactions.map((tx) => (
              <tr key={tx.id} className="border-b border-border/50 last:border-0">
                <td className="py-3 pr-3 text-muted-foreground">{tx.no}</td>
                <td className="py-3 pr-3 whitespace-nowrap text-xs text-muted-foreground">
                  {tx.waktu}
                </td>
                <td className="py-3 pr-3">
                  <div className="flex items-center gap-2">
                    <Avatar className="size-6">
                      {tx.kasirImage ? (
                        <AvatarImage src={tx.kasirImage} alt={tx.kasir} />
                      ) : null}
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
                        : tx.status === "Pending"
                          ? "bg-amber-500/10 text-amber-700 hover:bg-amber-500/20"
                          : "bg-destructive/10 text-destructive hover:bg-destructive/20"
                    }
                  >
                    {tx.status}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Mobile/Tablet Card List (<md) ── */}
      <div className="flex flex-col gap-2 md:hidden">
        {transactions.length === 0 ? (
          <div className="py-6 text-center text-xs text-muted-foreground">
            Belum ada transaksi
          </div>
        ) : (
          transactions.map((tx) => (
            <div
              key={tx.id}
              className="flex items-center gap-3 rounded-lg border border-border/50 bg-background p-3"
            >
              <Avatar className="size-8 shrink-0">
                {tx.kasirImage ? (
                  <AvatarImage src={tx.kasirImage} alt={tx.kasir} />
                ) : null}
                <AvatarFallback className="bg-primary/10 text-[10px] font-semibold text-primary">
                  {tx.initials}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-xs font-semibold">{tx.kasir}</p>
                  <p className="shrink-0 text-xs font-bold">{formatRupiah(tx.total)}</p>
                </div>
                <div className="mt-0.5 flex items-center justify-between gap-2">
                  <p className="truncate text-[11px] text-muted-foreground">{tx.items}</p>
                  <Badge
                    variant={tx.status === "Selesai" ? "default" : "secondary"}
                    className={`shrink-0 text-[9px] px-1.5 py-0 ${
                      tx.status === "Selesai"
                        ? "bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/20"
                        : tx.status === "Pending"
                          ? "bg-amber-500/10 text-amber-700 hover:bg-amber-500/20"
                          : "bg-destructive/10 text-destructive hover:bg-destructive/20"
                    }`}
                  >
                    {tx.status}
                  </Badge>
                </div>
                <p className="mt-0.5 text-[10px] text-muted-foreground">{tx.waktu}</p>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-3 text-center">
        <Link
          href="/admin/transaksi"
          className="inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          Lihat Semua Transaksi
          <HugeiconsIcon icon={ArrowRight01Icon} size={12} />
        </Link>
      </div>
    </div>
  )
}
