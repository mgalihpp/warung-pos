"use client"

import * as React from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Edit02Icon,
  InformationCircleIcon,
  PackageIcon,
  Wallet02Icon,
  ShoppingBag02Icon,
} from "@hugeicons/core-free-icons"
import { useTransactionDetail } from "../hooks/use-transaksi-queries"
import type {
  TransactionStatus,
  PaymentMethod,
  TransactionDetail,
} from "../hooks/use-transaksi-queries"
import { Button } from "@/components/ui/button"
import { formatRupiah } from "@/lib/format-currency"

function getStatusBadgeClass(status: TransactionStatus) {
  switch (status) {
    case "Selesai":
      return "bg-emerald-100 text-emerald-700"
    case "Pending":
      return "bg-amber-100 text-amber-700"
    case "Dibatalkan":
      return "bg-red-100 text-red-600"
    default:
      return "bg-muted text-muted-foreground"
  }
}

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

// ── Loading skeleton ──
function DetailSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="animate-pulse rounded-xl border bg-card p-4">
          <div className="mb-3 h-4 w-32 rounded bg-muted" />
          <div className="space-y-2.5">
            <div className="flex justify-between">
              <div className="h-3.5 w-24 rounded bg-muted" />
              <div className="h-3.5 w-28 rounded bg-muted" />
            </div>
            <div className="flex justify-between">
              <div className="h-3.5 w-20 rounded bg-muted" />
              <div className="h-3.5 w-24 rounded bg-muted" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

type Props = {
  transactionId: string
  onBack: () => void
  actionBasePath?: string
  initialData?: TransactionDetail
}

export function CashierTransaksiDetailMobile({
  transactionId,
  onBack,
  actionBasePath,
  initialData,
}: Props) {
  const router = useRouter()
  const containerRef = React.useRef<HTMLDivElement>(null)
  const { data, isLoading, error } = useTransactionDetail(
    transactionId,
    initialData
  )
  const canManage = !!actionBasePath

  React.useLayoutEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const scroller = containerRef.current?.closest("main")

      scroller?.scrollTo({ top: 0, left: 0, behavior: "auto" })
      window.scrollTo({ top: 0, left: 0, behavior: "auto" })
    })

    return () => window.cancelAnimationFrame(frame)
  }, [transactionId])

  // Signal the layout header to show "Detail Transaksi" + back arrow
  React.useEffect(() => {
    document.body.dataset.transaksiDetail = "true"
    window.dispatchEvent(new Event("transaksi-detail-change"))

    const handleBackRequest = () => onBack()
    window.addEventListener("transaksi-detail-back", handleBackRequest)

    return () => {
      delete document.body.dataset.transaksiDetail
      window.dispatchEvent(new Event("transaksi-detail-change"))
      window.removeEventListener("transaksi-detail-back", handleBackRequest)
    }
  }, [canManage, onBack])

  if (isLoading || !data) {
    return <DetailSkeleton />
  }

  if (error) {
    return (
      <div className="flex flex-1 items-center justify-center p-4">
        <p className="text-sm text-destructive">
          Gagal memuat detail transaksi.
        </p>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className={canManage ? "space-y-4 pb-28" : "space-y-4 pb-6"}
    >
      {/* ── Informasi Transaksi ── */}
      <div className="rounded-xl border bg-card p-4 shadow-sm">
        <div className="mb-4 flex items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <HugeiconsIcon icon={InformationCircleIcon} size={18} />
          </div>
          <h2 className="text-sm font-bold">Informasi Transaksi</h2>
        </div>

        <div className="space-y-3.5 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">ID Transaksi</span>
            <span className="font-semibold">{data.transactionNumber}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Tanggal</span>
            <span className="font-medium">{data.waktu}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Status</span>
            <span
              className={`inline-flex rounded-md px-2 py-0.5 text-xs font-bold tracking-wide ${getStatusBadgeClass(data.status)}`}
            >
              {data.status}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Metode Pembayaran</span>
            <span
              className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-bold ${getMetodeBadgeClass(data.metode)}`}
            >
              <HugeiconsIcon icon={Wallet02Icon} size={14} />
              {data.metode}
            </span>
          </div>
        </div>
      </div>

      {/* ── Rincian Pembayaran ── */}
      <div className="rounded-xl border bg-card p-4 shadow-sm">
        <div className="mb-4 flex items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <HugeiconsIcon icon={Wallet02Icon} size={18} />
          </div>
          <h2 className="text-sm font-bold">Rincian Pembayaran</h2>
        </div>

        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-medium">{formatRupiah(data.subtotal)}</span>
          </div>
          <div className="border-t border-dashed" />
          <div className="flex items-center justify-between">
            <span className="font-bold">Total</span>
            <span className="text-base font-bold text-primary">
              {formatRupiah(data.total)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Uang Diterima</span>
            <span className="font-medium">{formatRupiah(data.amountPaid)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Kembalian</span>
            <span className="font-medium">{formatRupiah(data.change)}</span>
          </div>
        </div>
      </div>

      {/* ── Detail Pesanan ── */}
      <div className="rounded-xl border bg-card p-4 shadow-sm">
        <div className="mb-4 flex items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <HugeiconsIcon icon={ShoppingBag02Icon} size={18} />
          </div>
          <h2 className="text-sm font-bold">Detail Pesanan</h2>
        </div>

        <div className="space-y-2.5">
          {data.items.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-3 rounded-xl bg-muted/50 p-2.5"
            >
              <div className="relative size-12 shrink-0 overflow-hidden rounded-xl bg-card ring-1 ring-border">
                {item.productImage ? (
                  <Image
                    src={item.productImage}
                    alt={item.productName}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex size-full items-center justify-center text-muted-foreground">
                    <HugeiconsIcon icon={PackageIcon} size={20} />
                  </div>
                )}
                <span className="absolute right-1 bottom-1 rounded-md bg-slate-900/75 px-1.5 py-0.5 text-[10px] font-bold text-white">
                  {item.quantity}x
                </span>
              </div>

              {/* Name & unit price */}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">
                  {item.productName}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatRupiah(item.unitPrice)}
                </p>
              </div>

              {/* Subtotal */}
              <span className="shrink-0 text-sm font-bold text-primary">
                {formatRupiah(item.subtotal)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {canManage ? (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t bg-background/95 px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] shadow-[0_-12px_30px_rgba(15,23,42,0.12)] backdrop-blur lg:hidden">
          <div className="mx-auto flex max-w-md">
            <Button
              type="button"
              className="h-12 w-full rounded-xl"
              onClick={() =>
                router.push(`${actionBasePath}/${transactionId}/edit`)
              }
            >
              <HugeiconsIcon icon={Edit02Icon} size={18} />
              Edit
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
