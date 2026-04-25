import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowRight01Icon } from "@hugeicons/core-free-icons"
import { recentTransactions, formatCurrency, type RecentTransaction } from "./pos-data"

type PosRecentTransactionsProps = {
  items?: RecentTransaction[]
}

export function PosRecentTransactions({ items = recentTransactions }: PosRecentTransactionsProps) {
  return (
    <div className="bg-card rounded-xl p-4 border shrink-0">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-foreground">Transaksi Terakhir</h3>
        <button className="text-xs font-semibold text-primary flex items-center gap-1 hover:underline">
          Lihat Semua
          <HugeiconsIcon icon={ArrowRight01Icon} size={12} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {items.map((trx) => (
          <div
            key={trx.id}
            className="flex items-center justify-between p-2 rounded-lg bg-muted/50 border border-border"
          >
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-foreground">{trx.id}</span>
              <span className="text-[10px] text-muted-foreground">{trx.user}</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-xs font-bold text-primary">{formatCurrency(trx.total)}</span>
              <span className="text-[10px] text-muted-foreground">{trx.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
