"use client"

import Link from "next/link"
import { useState } from "react"
import { usePathname } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowDown01Icon, ArrowUp01Icon } from "@hugeicons/core-free-icons"
import { formatRupiah } from "@/lib/format-currency"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Button } from "@/components/ui/button"
import type { RecentTransaction } from "@/features/pos/types"

type PosRecentTransactionsProps = {
  initialTransactions: RecentTransaction[]
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function PosRecentTransactions({
  initialTransactions,
}: PosRecentTransactionsProps) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const transaksiHref = pathname.startsWith("/admin")
    ? "/admin/transaksi"
    : "/cashier/transaksi"
  const { data, isLoading } = useQuery<{
    transactions: RecentTransaction[]
  }>({
    queryKey: ["kasir", "transaksi-recent"],
    queryFn: async () => {
      const res = await fetch("/api/kasir/transaksi?limit=5")
      if (!res.ok) throw new Error("Gagal memuat transaksi")
      return res.json()
    },
    initialData: { transactions: initialTransactions },
    refetchInterval: 30000, // refresh every 30s
    refetchOnWindowFocus: true,
  })

  const transactions = data?.transactions ?? []

  const content = isLoading ? (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="animate-pulse rounded-lg border bg-muted/50 p-2"
        >
          <div className="mb-1 h-4 w-2/3 rounded bg-muted" />
          <div className="h-3 w-1/3 rounded bg-muted" />
        </div>
      ))}
    </div>
  ) : transactions.length === 0 ? (
    <p className="text-xs text-muted-foreground">
      Belum ada transaksi hari ini
    </p>
  ) : (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
      {transactions.map((trx) => (
        <div
          key={trx.id}
          className="flex items-center justify-between rounded-lg border border-border bg-muted/50 p-2"
        >
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-foreground">
              {trx.transactionNumber}
            </span>
            <span className="text-[10px] text-muted-foreground">
              {trx.itemCount} item
            </span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-xs font-bold text-primary">
              {formatRupiah(trx.total)}
            </span>
            <span className="text-[10px] text-muted-foreground">
              {formatTime(trx.createdAt)}
            </span>
          </div>
        </div>
      ))}
    </div>
  )

  return (
    <div className="relative shrink-0 rounded-xl border bg-card p-4">
      <Collapsible open={open} onOpenChange={setOpen}>
        <div
          className={
            open
              ? "mb-3 flex items-center justify-between"
              : "flex items-center justify-between"
          }
        >
          <h3 className="text-sm font-bold text-foreground">
            Transaksi Terakhir
          </h3>
          <div className="flex items-center gap-1">
            <Link
              href={transaksiHref}
              className="px-2 text-xs font-medium text-primary hover:underline"
            >
              Lihat semua
            </Link>
            <CollapsibleTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                className="text-muted-foreground hover:text-foreground"
                aria-label={
                  open ? "Tutup transaksi terakhir" : "Buka transaksi terakhir"
                }
              >
                <HugeiconsIcon
                  icon={open ? ArrowDown01Icon : ArrowUp01Icon}
                  size={14}
                />
              </Button>
            </CollapsibleTrigger>
          </div>
        </div>
        <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
          {content}
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}
