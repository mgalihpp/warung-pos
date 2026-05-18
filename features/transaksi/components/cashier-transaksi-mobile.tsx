"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Calendar02Icon,
  InvoiceIcon,
  MoneyReceiveSquareIcon,
  SearchIcon,
  ArrowRight01Icon,
  MoneyReceiveFlowIcon,
  TickDouble01Icon,
} from "@hugeicons/core-free-icons"
import { formatRupiah } from "@/lib/format-currency"
import type { TransactionItem, TransactionStats, PaymentMethod } from "../hooks/use-transaksi-queries"
import { CashierTransaksiDetailMobile } from "./cashier-transaksi-detail-mobile"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"

function getMetodeBadgeClass(metode: PaymentMethod) {
  switch (metode) {
    case "Tunai":
      return "bg-emerald-100 text-emerald-700"
    case "QRIS":
      return "bg-blue-100 text-blue-700"
    case "Transfer":
      return "bg-violet-100 text-violet-700"
    default:
      return "bg-muted text-muted-foreground"
  }
}

type Period = 'today' | 'week' | 'month' | 'all'

function getPeriodLabel(period: Period) {
  switch (period) {
    case 'today': return 'Hari Ini'
    case 'week': return 'Minggu Ini'
    case 'month': return 'Bulan Ini'
    case 'all': return 'Semua Waktu'
  }
}

function getPeriodDateRange(period: Period) {
  const now = new Date()
  const fmt = new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short", year: "numeric" })

  if (period === 'all') return 'Semua Transaksi'
  if (period === 'today') return fmt.format(now)

  if (period === 'week') {
    // Start from Monday
    const day = now.getDay()
    const diff = now.getDate() - day + (day === 0 ? -6 : 1)
    const startOfWeek = new Date(now.setDate(diff))
    // Reset `now` to actual current date for the end range
    const endOfWeek = new Date()
    return `${fmt.format(startOfWeek)} - ${fmt.format(endOfWeek)}`
  }

  if (period === 'month') {
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    return `${fmt.format(startOfMonth)} - ${fmt.format(now)}`
  }
}

type Props = {
  transactions: TransactionItem[]
  stats: TransactionStats
}

export function CashierTransaksiMobile({ transactions }: Props) {
  const [selectedTransactionId, setSelectedTransactionId] = React.useState<string | null>(null)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [period, setPeriod] = React.useState<Period>('month')
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false)

  const filteredTransactions = React.useMemo(() => {
    let filtered = transactions

    // Filter by period
    if (period !== 'all') {
      const now = new Date()
      filtered = filtered.filter((t) => {
        const tDate = new Date(t.createdAt)

        if (period === 'today') {
          return tDate.toDateString() === now.toDateString()
        }

        if (period === 'month') {
          return tDate.getMonth() === now.getMonth() && tDate.getFullYear() === now.getFullYear()
        }

        if (period === 'week') {
          const day = now.getDay()
          const diff = now.getDate() - day + (day === 0 ? -6 : 1)
          const startOfWeek = new Date(new Date().setDate(diff))
          startOfWeek.setHours(0, 0, 0, 0)
          return tDate >= startOfWeek
        }

        return true
      })
    }

    // Filter by search query
    const query = searchQuery.toLowerCase()
    if (query) {
      filtered = filtered.filter(t =>
        t.transactionNumber.toLowerCase().includes(query) ||
        t.item.toLowerCase().includes(query)
      )
    }

    return filtered
  }, [transactions, searchQuery, period])

  // When detail is open, swap view
  if (selectedTransactionId) {
    return (
      <CashierTransaksiDetailMobile
        transactionId={selectedTransactionId}
        onBack={() => setSelectedTransactionId(null)}
      />
    )
  }

  return (
    <div className="flex h-full min-h-0 flex-col gap-4 overflow-hidden">
      {/* ── Summary Card (blue gradient) ── */}
      <div className="relative overflow-hidden rounded-2xl bg-primary p-4 text-primary-foreground shadow-lg">
        {/* Top: Periode */}
        <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
          <DrawerTrigger asChild>
            <button className="flex w-full items-center justify-between text-left transition-opacity hover:opacity-80 active:opacity-70">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-primary-foreground/15">
                  <HugeiconsIcon icon={Calendar02Icon} size={20} />
                </div>
                <div>
                  <p className="text-[11px] font-medium opacity-80">Periode: {getPeriodLabel(period)}</p>
                  <p className="text-sm font-bold">{getPeriodDateRange(period)}</p>
                </div>
              </div>
              <div className="flex size-8 items-center justify-center rounded-full bg-primary-foreground/10">
                 <HugeiconsIcon icon={ArrowRight01Icon} size={18} />
              </div>
            </button>
          </DrawerTrigger>
          <DrawerContent>
            <div className="mx-auto w-full max-w-sm">
              <DrawerHeader className="text-left">
                <DrawerTitle className="text-lg font-bold">Pilih Periode</DrawerTitle>
              </DrawerHeader>
              <div className="p-4 pb-8 flex flex-col gap-2">
                {(['today', 'week', 'month', 'all'] as Period[]).map((p) => (
                  <button
                    key={p}
                    onClick={() => {
                      setPeriod(p)
                      setIsDrawerOpen(false)
                    }}
                    className={`flex items-center justify-between rounded-xl border p-4 text-left transition-colors ${
                      period === p
                        ? "border-primary bg-primary/5 font-semibold text-primary"
                        : "border-border/50 bg-white hover:bg-slate-50"
                    }`}
                  >
                    <div>
                      <p className="text-base">{getPeriodLabel(p)}</p>
                      <p className={`text-xs ${period === p ? "text-primary/70" : "text-muted-foreground"}`}>
                        {getPeriodDateRange(p)}
                      </p>
                    </div>
                    {period === p && (
                      <HugeiconsIcon icon={TickDouble01Icon} size={20} className="text-primary" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </DrawerContent>
        </Drawer>

        {/* Bottom: Stats row */}
        <div className="mt-4 grid grid-cols-1 gap-3 border-t border-primary-foreground/20 pt-4 min-[360px]:grid-cols-2 min-[360px]:gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 opacity-80">
              <HugeiconsIcon icon={InvoiceIcon} size={14} />
              <p className="text-[10px] font-medium">Total Transaksi</p>
            </div>
            <p className="mt-1 text-2xl font-bold">{filteredTransactions.length}</p>
          </div>
          <div className="min-w-0 border-t border-primary-foreground/20 pt-3 min-[360px]:border-t-0 min-[360px]:border-l min-[360px]:pt-0 min-[360px]:pl-4">
            <div className="flex items-center gap-1.5 opacity-80">
              <HugeiconsIcon icon={MoneyReceiveSquareIcon} size={14} />
              <p className="text-[10px] font-medium">Total Penjualan</p>
            </div>
            <p className="mt-1 truncate text-xl font-bold tracking-tight min-[360px]:text-2xl">
              {formatRupiah(filteredTransactions.reduce((sum, t) => sum + t.total, 0))}
            </p>
          </div>
        </div>
      </div>

      {/* ── Search Bar ── */}
      <div className="relative shrink-0">
        <HugeiconsIcon
          icon={SearchIcon}
          size={18}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <input
          type="text"
          placeholder="Cari nomor transaksi..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-12 w-full rounded-xl border border-border/60 bg-white pl-10 pr-4 text-sm shadow-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary"
        />
      </div>

      {/* ── Transaction Card List ── */}
      <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto pb-6">
        {filteredTransactions.length === 0 ? (
          <div className="rounded-xl border border-dashed bg-white p-10 text-center text-sm text-muted-foreground">
            Tidak ada transaksi yang ditemukan.
          </div>
        ) : (
          filteredTransactions.map((trx) => (
            <button
              key={trx.id}
              type="button"
              onClick={() => setSelectedTransactionId(trx.id)}
              className="flex w-full items-center gap-3.5 rounded-xl border border-border/50 bg-white p-4 text-left shadow-sm transition-all active:scale-[0.98] active:bg-slate-50"
            >
              {/* Left: Money icon */}
              <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50">
                <HugeiconsIcon icon={MoneyReceiveFlowIcon} size={24} className="text-emerald-600" />
              </div>

              {/* Center content */}
              <div className="min-w-0 flex-1">
                {/* Amount */}
                <p className="text-base font-bold text-slate-800">{formatRupiah(trx.total)}</p>

                {/* Payment badge */}
                <span className={`mt-1 inline-flex rounded px-1.5 py-0.5 text-[10px] font-bold ${getMetodeBadgeClass(trx.metode)}`}>
                  {trx.metode}
                </span>

                {/* Date & ID */}
                <div className="mt-1.5 space-y-0.5 text-[11px] text-muted-foreground">
                  <p>⏱ {trx.waktu}</p>
                  <p># ID: {trx.transactionNumber}</p>
                </div>
              </div>

              {/* Right: chevron */}
              <HugeiconsIcon icon={ArrowRight01Icon} size={18} className="shrink-0 text-slate-400" />
            </button>
          ))
        )}
      </div>
    </div>
  )
}
