"use client"

import * as React from "react"
import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  SearchIcon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
  ViewIcon,
} from "@hugeicons/core-free-icons"
import { formatRupiah } from "@/lib/format-currency"
import { useSearchParamsState } from "@/hooks/use-search-param"
import { TransaksiDetailDialog } from "./transaksi-detail-dialog"
import { TransaksiActionMenu } from "./transaksi-action-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type {
  TransactionItem,
  TransactionStatus,
  PaymentMethod,
} from "../hooks/use-transaksi-queries"

// ── Status badge styles ──
function getStatusBadgeClass(status: TransactionStatus) {
  switch (status) {
    case "Selesai":
      return "bg-primary/10 text-primary"
    case "Pending":
      return "bg-amber-500/10 text-amber-600"
    case "Dibatalkan":
      return "bg-red-500/10 text-red-600"
    default:
      return "bg-muted text-muted-foreground"
  }
}

// ── Payment method badge styles ──
function getMetodeBadgeClass(metode: PaymentMethod) {
  switch (metode) {
    case "Tunai":
      return "bg-emerald-500/10 text-emerald-600"
    case "QRIS":
      return "bg-blue-500/10 text-blue-600"
    case "Transfer":
      return "bg-violet-500/10 text-violet-600"
    default:
      return "bg-muted text-muted-foreground"
  }
}

const ITEMS_PER_PAGE = 10

type Props = {
  transactions: TransactionItem[]
  cashierList: string[]
  detailBasePath?: string
  actionBasePath?: string
}

export function TransaksiTable({
  transactions,
  cashierList,
  detailBasePath,
  actionBasePath,
}: Props) {
  const { values, setParams } = useSearchParamsState({
    search: "",
    page: "1",
    status: "all",
    method: "all",
    cashier: "all",
  })
  const searchQuery = values.search
  const currentPage = Number(values.page)
  const statusFilter = values.status
  const methodFilter = values.method
  const cashierFilter = values.cashier

  const filteredTransactions = React.useMemo(() => {
    const query = searchQuery.toLowerCase()
    return transactions.filter(
      (t) =>
        (statusFilter === "all" || t.status === statusFilter) &&
        (methodFilter === "all" || t.metode === methodFilter) &&
        (cashierFilter === "all" || t.kasir === cashierFilter) &&
        (!query ||
          t.transactionNumber.toLowerCase().includes(query) ||
          t.kasir.toLowerCase().includes(query) ||
          t.item.toLowerCase().includes(query))
    )
  }, [transactions, searchQuery, statusFilter, methodFilter, cashierFilter])

  const totalPages = Math.max(
    1,
    Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE)
  )
  const safePage = Math.min(currentPage, totalPages)
  const paginatedTransactions = filteredTransactions.slice(
    (safePage - 1) * ITEMS_PER_PAGE,
    safePage * ITEMS_PER_PAGE
  )

  const startItem =
    filteredTransactions.length === 0 ? 0 : (safePage - 1) * ITEMS_PER_PAGE + 1
  const endItem = Math.min(
    safePage * ITEMS_PER_PAGE,
    filteredTransactions.length
  )

  // Build pagination buttons
  const paginationButtons = React.useMemo(() => {
    const pages: (number | "...")[] = []
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      pages.push(1)
      if (safePage > 3) pages.push("...")
      const start = Math.max(2, safePage - 1)
      const end = Math.min(totalPages - 1, safePage + 1)
      for (let i = start; i <= end; i++) pages.push(i)
      if (safePage < totalPages - 2) pages.push("...")
      pages.push(totalPages)
    }
    return pages
  }, [totalPages, safePage])

  return (
    <div className="flex flex-col gap-3 lg:gap-4">
      {/* Search */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
        <div className="relative flex-1">
          <HugeiconsIcon
            icon={SearchIcon}
            size={16}
            className="absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="text"
            placeholder="Cari no. transaksi, kasir, atau item..."
            value={searchQuery}
            onChange={(e) => {
              setParams({ search: e.target.value, page: "1" })
            }}
            className="h-9 w-full rounded-lg border bg-background pr-3 pl-9 text-sm ring-ring transition-colors outline-none placeholder:text-muted-foreground focus:ring-1"
          />
        </div>
        <div className="hidden flex-wrap items-center gap-2 lg:flex">
          <Select
            value={statusFilter}
            onValueChange={(value) => {
              setParams({ status: value, page: "1" })
            }}
          >
            <SelectTrigger className="w-full lg:w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua status</SelectItem>
              <SelectItem value="Selesai">Selesai</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Dibatalkan">Dibatalkan</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={methodFilter}
            onValueChange={(value) => {
              setParams({ method: value, page: "1" })
            }}
          >
            <SelectTrigger className="w-full lg:w-[160px]">
              <SelectValue placeholder="Metode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua metode</SelectItem>
              <SelectItem value="Tunai">Tunai</SelectItem>
              <SelectItem value="QRIS">QRIS</SelectItem>
              <SelectItem value="Transfer">Transfer</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={cashierFilter}
            onValueChange={(value) => {
              setParams({ cashier: value, page: "1" })
            }}
          >
            <SelectTrigger className="w-full lg:w-[180px]">
              <SelectValue placeholder="Kasir" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua kasir</SelectItem>
              {cashierList.map((cashier) => (
                <SelectItem key={cashier} value={cashier}>
                  {cashier}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="hidden overflow-x-auto rounded-xl border bg-card shadow-sm lg:block">
        <table className="w-full min-w-[900px] text-left">
          <thead>
            <tr className="border-b bg-muted/30">
              <th className="px-4 py-3 text-xs font-medium text-muted-foreground">
                No. Transaksi
              </th>
              <th className="px-4 py-3 text-xs font-medium text-muted-foreground">
                Waktu
              </th>
              <th className="px-4 py-3 text-xs font-medium text-muted-foreground">
                Kasir
              </th>
              <th className="px-4 py-3 text-xs font-medium text-muted-foreground">
                Item
              </th>
              <th className="px-4 py-3 text-xs font-medium text-muted-foreground">
                Metode
              </th>
              <th className="px-4 py-3 text-xs font-medium text-muted-foreground">
                Total
              </th>
              <th className="px-4 py-3 text-xs font-medium text-muted-foreground">
                Status
              </th>
              <th className="px-4 py-3 text-xs font-medium text-muted-foreground">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedTransactions.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="px-4 py-12 text-center text-sm text-muted-foreground"
                >
                  {searchQuery
                    ? "Tidak ada transaksi yang cocok."
                    : "Belum ada data transaksi."}
                </td>
              </tr>
            ) : (
              paginatedTransactions.map((trx) => (
                <tr
                  key={trx.id}
                  className="border-b transition-colors last:border-0 hover:bg-muted/20"
                >
                  <td className="px-4 py-3">
                    <span className="text-sm font-medium">
                      {trx.transactionNumber}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm whitespace-nowrap text-muted-foreground">
                    {trx.waktu}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Avatar className="size-7">
                        {trx.kasirImage ? (
                          <AvatarImage src={trx.kasirImage} alt={trx.kasir} />
                        ) : null}
                        <AvatarFallback className="bg-blue-500/10 text-[11px] font-bold text-blue-600">
                          {trx.kasir.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{trx.kasir}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="block max-w-[200px] truncate text-sm text-muted-foreground">
                      {trx.item}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold whitespace-nowrap ${getMetodeBadgeClass(trx.metode)}`}
                    >
                      {trx.metode}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm font-semibold">
                      {formatRupiah(trx.total)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold whitespace-nowrap ${getStatusBadgeClass(trx.status)}`}
                    >
                      {trx.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      {detailBasePath ? (
                        <Link
                          href={`${detailBasePath}/${trx.id}`}
                          className="flex min-h-10 min-w-10 items-center justify-center rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground active:bg-muted"
                          title="Lihat Detail"
                        >
                          <HugeiconsIcon icon={ViewIcon} size={15} />
                        </Link>
                      ) : (
                        <TransaksiDetailDialog
                          transactionId={trx.id}
                          transactionNumber={trx.transactionNumber}
                          status={trx.status}
                        />
                      )}
                      {actionBasePath ? (
                        <TransaksiActionMenu
                          transactionId={trx.id}
                          transactionNumber={trx.transactionNumber}
                          currentStatus={trx.status}
                          basePath={actionBasePath}
                        />
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ── Mobile/Tablet Card List (<lg) ── */}
      <div className="flex flex-col gap-3 lg:hidden">
        {paginatedTransactions.length === 0 ? (
          <div className="rounded-xl border bg-card px-4 py-10 text-center text-sm text-muted-foreground shadow-sm">
            {searchQuery
              ? "Tidak ada transaksi yang cocok."
              : "Belum ada data transaksi."}
          </div>
        ) : (
          paginatedTransactions.map((trx) => (
            <div
              key={trx.id}
              className="rounded-xl border bg-card p-3.5 shadow-sm transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="text-sm leading-tight font-semibold">
                    {trx.transactionNumber}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {trx.waktu}
                  </p>
                </div>
                <span
                  className={`inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-[10px] font-semibold whitespace-nowrap ${getStatusBadgeClass(trx.status)}`}
                >
                  {trx.status}
                </span>
              </div>

              <div className="mt-2.5 flex items-center gap-2">
                <Avatar className="size-6">
                  {trx.kasirImage ? (
                    <AvatarImage src={trx.kasirImage} alt={trx.kasir} />
                  ) : null}
                  <AvatarFallback className="bg-blue-500/10 text-[10px] font-bold text-blue-600">
                    {trx.kasir.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs font-medium">{trx.kasir}</span>
              </div>
              <p className="mt-1.5 truncate text-xs text-muted-foreground">
                {trx.item}
              </p>

              <div className="mt-3 flex items-center justify-between gap-2 border-t border-border/50 pt-3">
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${getMetodeBadgeClass(trx.metode)}`}
                  >
                    {trx.metode}
                  </span>
                  <span className="text-sm font-bold">
                    {formatRupiah(trx.total)}
                  </span>
                </div>
                <div className="relative z-10 flex items-center gap-1">
                  {detailBasePath ? (
                    <Link
                      href={`${detailBasePath}/${trx.id}`}
                      className="flex min-h-10 min-w-10 items-center justify-center rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground active:bg-muted"
                      title="Lihat Detail"
                    >
                      <HugeiconsIcon icon={ViewIcon} size={15} />
                    </Link>
                  ) : (
                    <TransaksiDetailDialog
                      transactionId={trx.id}
                      transactionNumber={trx.transactionNumber}
                      status={trx.status}
                    />
                  )}
                  {actionBasePath ? (
                    <TransaksiActionMenu
                      transactionId={trx.id}
                      transactionNumber={trx.transactionNumber}
                      currentStatus={trx.status}
                      basePath={actionBasePath}
                    />
                  ) : null}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      <div className="flex flex-col items-center justify-between gap-3 lg:flex-row">
        <p className="text-xs text-muted-foreground">
          Menampilkan {startItem}–{endItem} dari {filteredTransactions.length}{" "}
          transaksi
        </p>
        {totalPages > 1 && (
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={safePage <= 1}
              onClick={() =>
                setParams({ page: String(Math.max(1, safePage - 1)) })
              }
              className="flex size-8 items-center justify-center rounded-lg border text-muted-foreground transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-40"
            >
              <HugeiconsIcon icon={ArrowLeft01Icon} size={14} />
            </button>
            {paginationButtons.map((page, idx) =>
              page === "..." ? (
                <span
                  key={`ellipsis-${idx}`}
                  className="px-1 text-xs text-muted-foreground"
                >
                  ...
                </span>
              ) : (
                <button
                  type="button"
                  key={page}
                  onClick={() => setParams({ page: String(page) })}
                  className={`flex size-8 items-center justify-center rounded-lg text-xs font-medium transition-colors ${
                    safePage === page
                      ? "bg-primary text-primary-foreground"
                      : "border text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {page}
                </button>
              )
            )}
            <button
              type="button"
              disabled={safePage >= totalPages}
              onClick={() =>
                setParams({
                  page: String(Math.min(totalPages, safePage + 1)),
                })
              }
              className="flex size-8 items-center justify-center rounded-lg border text-muted-foreground transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-40"
            >
              <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
