"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  InvoiceIcon,
  ViewIcon,
} from "@hugeicons/core-free-icons"

import { useIsMobile } from "@/hooks/use-mobile"
import { useTransactionDetail } from "../hooks/use-transaksi-queries"
import type { TransactionStatus, PaymentMethod } from "../hooks/use-transaksi-queries"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { formatRupiah } from "@/lib/format-currency"

// ── Badge helpers ──

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

// ── Loading skeleton ──

function DetailSkeleton() {
  return (
    <div className="grid gap-4 py-2">
      {/* Info row */}
      <div className="grid grid-cols-3 gap-3 rounded-xl border bg-muted/20 p-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-3 w-12 rounded-full" />
            <Skeleton className="h-4 w-20 rounded-full" />
          </div>
        ))}
      </div>
      {/* Items */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-24 rounded-full" />
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between rounded-lg border p-3">
            <div className="space-y-1.5">
              <Skeleton className="h-3.5 w-32 rounded-full" />
              <Skeleton className="h-3 w-20 rounded-full" />
            </div>
            <Skeleton className="h-4 w-16 rounded-full" />
          </div>
        ))}
      </div>
      {/* Summary */}
      <div className="space-y-2 rounded-xl border p-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex justify-between">
            <Skeleton className="h-3 w-20 rounded-full" />
            <Skeleton className="h-3 w-24 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Detail content ──

function TransactionDetailContent({ transactionId }: { transactionId: string }) {
  const { data, isLoading, error } = useTransactionDetail(transactionId)

  if (isLoading || !data) return <DetailSkeleton />

  if (error) {
    return (
      <div className="py-8 text-center text-sm text-destructive">
        Gagal memuat detail transaksi.
      </div>
    )
  }

  return (
    <div className="grid gap-4 py-2">
      {/* Info grid */}
      <div className="grid grid-cols-2 gap-4 rounded-xl border bg-card p-4 shadow-sm sm:grid-cols-3">
        <div className="space-y-1">
          <p className="text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
            Waktu
          </p>
          <p className="text-xs font-medium leading-snug">{data.waktu}</p>
        </div>
        <div className="space-y-1">
          <p className="text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
            Kasir
          </p>
          <div className="flex items-center gap-2">
            <Avatar className="size-6">
              {data.kasirImage ? (
                <AvatarImage src={data.kasirImage} alt={data.kasir} />
              ) : null}
              <AvatarFallback className="bg-blue-500/10 text-[10px] font-bold text-blue-600">
                {data.kasir.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs font-semibold">{data.kasir}</span>
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
            Metode Bayar
          </p>
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${getMetodeBadgeClass(data.metode)}`}
          >
            {data.metode}
          </span>
        </div>
      </div>

      {/* Item list */}
      <div>
        <p className="mb-2 text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
          Daftar Item ({data.items.length})
        </p>
        <div className="rounded-xl border bg-card shadow-sm">
          {data.items.map((item, index) => (
            <div
              key={item.id}
              className={`flex items-center justify-between gap-3 px-4 py-2.5 ${
                index < data.items.length - 1 ? "border-b border-border/50" : ""
              }`}
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold">{item.productName}</p>
                <p className="text-[11px] text-muted-foreground">
                  {formatRupiah(item.unitPrice)} × {item.quantity}
                </p>
              </div>
              <p className="shrink-0 text-xs font-bold">
                {formatRupiah(item.subtotal)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Payment summary */}
      <div className="rounded-xl border bg-card p-4 shadow-sm">
        <div className="space-y-2 text-xs">
          <div className="flex justify-between text-muted-foreground">
            <span>Subtotal</span>
            <span className="font-medium text-foreground">{formatRupiah(data.subtotal)}</span>
          </div>
          <div className="flex justify-between border-t border-border/50 pt-2 text-sm font-bold">
            <span>Total</span>
            <span className="text-primary">{formatRupiah(data.total)}</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Dibayar</span>
            <span className="font-medium text-foreground">{formatRupiah(data.amountPaid)}</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Kembalian</span>
            <span className="font-medium text-foreground">{formatRupiah(data.change)}</span>
          </div>
        </div>
      </div>

      {/* Notes */}
      {data.notes && (
        <div className="rounded-xl border bg-muted/30 p-4">
          <p className="mb-1 text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
            Catatan
          </p>
          <p className="text-sm leading-relaxed text-foreground/80">
            {data.notes}
          </p>
        </div>
      )}
    </div>
  )
}

// ── Main component ──

type TransaksiDetailDialogProps = {
  transactionId: string
  transactionNumber: string
  status: TransactionStatus
  /** Optional custom trigger — defaults to the eye icon button */
  trigger?: React.ReactNode
}

export function TransaksiDetailDialog({
  transactionId,
  transactionNumber,
  status,
  trigger,
}: TransaksiDetailDialogProps) {
  const [open, setOpen] = React.useState(false)
  const isMobile = useIsMobile()

  const defaultTrigger = (
    <button
      onClick={() => setOpen(true)}
      className="flex min-h-10 min-w-10 items-center justify-center rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground active:bg-muted"
      title="Lihat Detail"
    >
      <HugeiconsIcon icon={ViewIcon} size={15} />
    </button>
  )

  const headerIcon = (
    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
      <HugeiconsIcon icon={InvoiceIcon} size={20} />
    </span>
  )

  const titleContent = (
    <span className="flex items-center gap-3">
      {headerIcon}
      <span className="flex flex-col gap-0.5">
        <span className="truncate text-base font-semibold">{transactionNumber}</span>
        <span
          className={`w-fit inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${getStatusBadgeClass(status)}`}
        >
          {status}
        </span>
      </span>
    </span>
  )

  if (isMobile) {
    return (
      <>
        {trigger ? (
          <span onClick={() => setOpen(true)}>{trigger}</span>
        ) : (
          defaultTrigger
        )}
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerContent className="max-h-[92vh] overflow-hidden border-0">
            <DrawerHeader>
              <DrawerTitle className="text-left">
                {titleContent}
              </DrawerTitle>
              <DrawerDescription>
                Detail lengkap informasi transaksi.
              </DrawerDescription>
            </DrawerHeader>
            <div className="scrollbar-thin min-h-0 flex-1 overflow-y-auto px-4 pb-6">
              <TransactionDetailContent transactionId={transactionId} />
            </div>
          </DrawerContent>
        </Drawer>
      </>
    )
  }

  return (
    <>
      {trigger ? (
        <span onClick={() => setOpen(true)}>{trigger}</span>
      ) : (
        defaultTrigger
      )}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {titleContent}
            </DialogTitle>
            <DialogDescription>
              Detail lengkap informasi transaksi.
            </DialogDescription>
          </DialogHeader>
          <TransactionDetailContent transactionId={transactionId} />
        </DialogContent>
      </Dialog>
    </>
  )
}
