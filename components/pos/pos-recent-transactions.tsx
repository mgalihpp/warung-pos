"use client"

import Link from "next/link"
import { useState } from "react"
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

type RecentTransaction = {
  id: string
  invoiceNumber: string
  total: number
  cashierName: string
  createdAt: string
  itemCount: number
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function PosRecentTransactions() {
  const [open, setOpen] = useState(false)
  const { data, isLoading } = useQuery<{
    transactions: RecentTransaction[]
  }>({
    queryKey: ["kasir", "transaksi-recent"],
    queryFn: async () => {
      const res = await fetch("/api/kasir/transaksi?limit=5")
      if (!res.ok) throw new Error("Gagal memuat transaksi")
      return res.json()
    },
    refetchInterval: 30000, // refresh every 30s
  })

  const transactions = data?.transactions ?? []

  const content = isLoading ? (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="p-2 rounded-lg bg-muted/50 border animate-pulse">
          <div className="h-4 bg-muted rounded w-2/3 mb-1" />
          <div className="h-3 bg-muted rounded w-1/3" />
        </div>
      ))}
    </div>
  ) : transactions.length === 0 ? (
    <p className="text-xs text-muted-foreground">Belum ada transaksi hari ini</p>
  ) : (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      {transactions.map((trx) => (
        <div
          key={trx.id}
          className="flex items-center justify-between p-2 rounded-lg bg-muted/50 border border-border"
        >
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-foreground">{trx.invoiceNumber}</span>
            <span className="text-[10px] text-muted-foreground">{trx.itemCount} item</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-xs font-bold text-primary">{formatRupiah(trx.total)}</span>
            <span className="text-[10px] text-muted-foreground">{formatTime(trx.createdAt)}</span>
          </div>
        </div>
      ))}
    </div>
  )

  return (
    <div className="bg-card rounded-xl p-4 border shrink-0">
      <Collapsible open={open} onOpenChange={setOpen}>
        <div className={open ? "mb-3 flex items-center justify-between" : "flex items-center justify-between"}>
          <h3 className="text-sm font-bold text-foreground">Transaksi Terakhir</h3>
          <div className="flex items-center gap-1">
            <Link
              href="/cashier/transaksi"
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
                aria-label={open ? "Tutup transaksi terakhir" : "Buka transaksi terakhir"}
              >
                <HugeiconsIcon icon={open ? ArrowDown01Icon : ArrowUp01Icon} size={14} />
              </Button>
            </CollapsibleTrigger>
          </div>
        </div>
        <CollapsibleContent className="overflow-hidden data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
          {content}
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}
