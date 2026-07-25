"use client"

import * as React from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  PencilEdit02Icon,
  Delete02Icon,
  Cancel01Icon,
  FloppyDiskIcon,
  Add01Icon,
  MinusSignIcon,
  InvoiceIcon,
  CreditCardIcon,
  NoteIcon,
  Alert02Icon,
} from "@hugeicons/core-free-icons"
import { toast } from "sonner"

import type { TransactionDetail } from "../hooks/use-transaksi-queries"
import { useUpdateTransaction, useDeleteTransaction } from "../hooks/use-transaksi-actions"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Field } from "@/features/shared/components/form-field"
import { PageShell } from "@/features/shared/components/page-shell"
import { formatRupiah } from "@/lib/format-currency"

// ── Payment method helpers ──

const PAYMENT_METHODS = [
  { value: "CASH" as const, label: "Tunai" },
  { value: "QRIS_MANUAL" as const, label: "QRIS" },
  { value: "MANUAL_TRANSFER" as const, label: "Transfer" },
]

function reverseMapPaymentMethod(uiLabel: string): "CASH" | "QRIS_MANUAL" | "MANUAL_TRANSFER" {
  switch (uiLabel) {
    case "Tunai":
      return "CASH"
    case "QRIS":
      return "QRIS_MANUAL"
    case "Transfer":
      return "MANUAL_TRANSFER"
    default:
      return "CASH"
  }
}

// ── Edit item type ──
type EditItem = {
  productId: string
  productName: string
  productImage: string | null
  unitPrice: number
  quantity: number
}

// ── Main Component ──

type TransaksiEditPageProps = {
  data: TransactionDetail
  basePath: string // "/admin/transaksi" or "/cashier/transaksi"
}

export function TransaksiEditPage({ data, basePath }: TransaksiEditPageProps) {
  const router = useRouter()
  const updateMutation = useUpdateTransaction()
  const deleteMutation = useDeleteTransaction()

  const [items, setItems] = React.useState<EditItem[]>(() =>
    data.items.map((item) => ({
      productId: item.productId,
      productName: item.productName,
      productImage: item.productImage,
      unitPrice: item.unitPrice,
      quantity: item.quantity,
    })),
  )
  const [paymentMethod, setPaymentMethod] = React.useState(
    reverseMapPaymentMethod(data.metode),
  )
  const [amountPaid, setAmountPaid] = React.useState(data.amountPaid)
  const [notes, setNotes] = React.useState(data.notes || "")
  const [deleteOpen, setDeleteOpen] = React.useState(false)

  React.useEffect(() => {
    const handleDeleteRequest = () => setDeleteOpen(true)
    window.addEventListener("transaksi-delete-request", handleDeleteRequest)
    return () => window.removeEventListener("transaksi-delete-request", handleDeleteRequest)
  }, [])

  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)
  const change = Math.max(0, amountPaid - subtotal)
  const isPaymentShort = paymentMethod === "CASH" && amountPaid < subtotal

  const updateQuantity = (index: number, delta: number) => {
    setItems((prev) =>
      prev.map((item, i) => {
        if (i !== index) return item
        const newQty = Math.max(1, item.quantity + delta)
        return { ...item, quantity: newQty }
      }),
    )
  }

  const setQuantity = (index: number, qty: number) => {
    setItems((prev) =>
      prev.map((item, i) => {
        if (i !== index) return item
        return { ...item, quantity: Math.max(1, qty) }
      }),
    )
  }

  const removeItem = (index: number) => {
    if (items.length <= 1) return
    setItems((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = () => {
    updateMutation.mutate(
      {
        id: data.id,
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
        paymentMethod,
        amountPaid,
        notes: notes || undefined,
      },
      {
        onSuccess: (result) => {
          if (result.success) {
            toast.success("Transaksi berhasil diperbarui")
            router.push(basePath)
            return
          }

          toast.error(result.error ?? "Transaksi gagal diperbarui")
        },
        onError: () => toast.error("Transaksi gagal diperbarui"),
      },
    )
  }

  return (
    <PageShell
      width="wide"
      className="h-full overflow-y-auto bg-slate-50 lg:bg-transparent"
      backHref={`${basePath}/${data.id}`}
      title="Edit Transaksi"
      subtitle={`${data.transactionNumber} — Ubah item, metode bayar, atau catatan`}
      actions={
        <>
          <Button
            type="button"
            variant="outline"
            className="gap-2 border-destructive/30 text-destructive hover:bg-destructive/5 hover:text-destructive"
            onClick={() => setDeleteOpen(true)}
          >
            <HugeiconsIcon icon={Delete02Icon} size={16} />
            <span className="hidden sm:inline">Hapus</span>
          </Button>
          <Button
            type="button"
            variant="outline"
            className="gap-2"
            onClick={() => router.push(`${basePath}/${data.id}`)}
          >
            <HugeiconsIcon icon={Cancel01Icon} size={14} />
            Batal
          </Button>
          <Button
            type="button"
            className="gap-2"
            onClick={handleSubmit}
            disabled={items.length === 0 || isPaymentShort}
            loading={updateMutation.isPending}
            loadingText="Menyimpan..."
          >
            <HugeiconsIcon icon={FloppyDiskIcon} size={16} />
            Simpan Perubahan
          </Button>
        </>
      }
      bottomBar={
        <Button
          type="button"
          className="h-12 w-full rounded-xl"
          onClick={handleSubmit}
          disabled={items.length === 0 || isPaymentShort}
          loading={updateMutation.isPending}
          loadingText="Menyimpan..."
        >
          <HugeiconsIcon icon={FloppyDiskIcon} size={18} />
          Simpan
        </Button>
      }
    >
      {/* ── Main Content ──────────────────────────────────────────────── */}
      <div className="flex w-full min-w-0 flex-col gap-6 lg:flex-row">
        {/* Left column: Items + Notes */}
        <div className="flex min-w-0 flex-1 flex-col gap-6">
          {/* Daftar Item */}
          <div className="rounded-2xl border bg-card p-4 shadow-sm lg:rounded-xl lg:p-5">
            <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold">
              <span className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <HugeiconsIcon icon={InvoiceIcon} size={14} />
              </span>
              Daftar Item ({items.length})
            </h2>

            <div className="space-y-3">
              {items.map((item, index) => (
                <div
                  key={`${item.productId}-${index}`}
                  className="flex flex-col items-stretch gap-3 rounded-xl border bg-background p-3 sm:flex-row sm:items-center lg:rounded-lg"
                >
                  <div className="relative size-12 shrink-0 overflow-hidden rounded-xl bg-muted">
                    {item.productImage ? (
                      <Image src={item.productImage} alt={item.productName} fill sizes="48px" className="object-cover" />
                    ) : (
                      <div className="flex size-full items-center justify-center text-muted-foreground">
                        <HugeiconsIcon icon={InvoiceIcon} size={20} />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{item.productName}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatRupiah(item.unitPrice)} / item
                    </p>
                  </div>

                  {/* Quantity controls */}
                  <div className="flex items-center justify-between gap-1.5 sm:justify-start">
                    <button
                      type="button"
                      onClick={() => updateQuantity(index, -1)}
                      disabled={item.quantity <= 1}
                      className="flex size-8 items-center justify-center rounded-md border bg-background text-muted-foreground transition-colors hover:bg-muted disabled:opacity-30"
                    >
                      <HugeiconsIcon icon={MinusSignIcon} size={14} />
                    </button>
                    <Input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) => setQuantity(index, Number(e.target.value) || 1)}
                      className="h-8 w-14 text-center text-sm font-bold tabular-nums"
                    />
                    <button
                      type="button"
                      onClick={() => updateQuantity(index, 1)}
                      className="flex size-8 items-center justify-center rounded-md border bg-background text-muted-foreground transition-colors hover:bg-muted"
                    >
                      <HugeiconsIcon icon={Add01Icon} size={14} />
                    </button>
                  </div>

                  {/* Subtotal + remove */}
                  <div className="flex items-center justify-between gap-2 border-t pt-3 sm:border-t-0 sm:pt-0">
                    <span className="text-right text-sm font-bold tabular-nums sm:w-24">
                      {formatRupiah(item.unitPrice * item.quantity)}
                    </span>
                    {items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="flex size-8 items-center justify-center rounded-md text-destructive/50 transition-colors hover:bg-destructive/10 hover:text-destructive"
                      >
                        <HugeiconsIcon icon={Delete02Icon} size={14} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Catatan */}
          <div className="rounded-2xl border bg-card p-4 shadow-sm lg:rounded-xl lg:p-5">
            <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold">
              <span className="flex size-7 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600">
                <HugeiconsIcon icon={NoteIcon} size={14} />
              </span>
              Catatan (opsional)
            </h2>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Tambahkan catatan untuk transaksi ini..."
              className="min-h-[80px] bg-input/30"
            />
          </div>
        </div>

        {/* Right column: Payment + Summary */}
        <div className="w-full space-y-6 lg:w-[340px]">
          {/* Metode Bayar */}
          <div className="rounded-2xl border bg-card p-4 shadow-sm lg:rounded-xl lg:p-5">
            <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold">
              <span className="flex size-7 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600">
                <HugeiconsIcon icon={CreditCardIcon} size={14} />
              </span>
              Pembayaran
            </h2>

            <div className="space-y-4">
              <Field label="Metode Bayar" required>
                <div className="flex gap-2">
                  {PAYMENT_METHODS.map((m) => (
                    <button
                      key={m.value}
                      type="button"
                      onClick={() => setPaymentMethod(m.value)}
                      className={`flex-1 rounded-lg border px-3 py-2.5 text-xs font-semibold transition-all ${paymentMethod === m.value
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border bg-background text-muted-foreground hover:border-border/80 hover:bg-muted/50"
                        }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </Field>

              <Field label="Jumlah Bayar" required error={isPaymentShort ? `Kurang ${formatRupiah(subtotal - amountPaid)}` : undefined}>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    Rp
                  </span>
                  <Input
                    type="number"
                    min={0}
                    value={amountPaid}
                    onChange={(e) => setAmountPaid(Number(e.target.value) || 0)}
                    className="bg-input/30 pl-8"
                  />
                </div>
              </Field>
            </div>
          </div>

          {/* Ringkasan */}
          <div className="rounded-2xl border bg-card p-4 shadow-sm lg:rounded-xl lg:p-5">
            <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold">
              <span className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <HugeiconsIcon icon={PencilEdit02Icon} size={14} />
              </span>
              Ringkasan
            </h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Item</span>
                <span className="font-medium text-foreground">
                  {items.reduce((sum, i) => sum + i.quantity, 0)} pcs
                </span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span className="break-words text-right font-medium text-foreground">{formatRupiah(subtotal)}</span>
              </div>
              <div className="flex justify-between border-t border-border/50 pt-3 text-base font-bold">
                <span>Total</span>
                <span className="break-words text-right text-primary">{formatRupiah(subtotal)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Dibayar</span>
                <span className="break-words text-right font-medium text-foreground">{formatRupiah(amountPaid)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Kembalian</span>
                <span
                  className={`break-words text-right font-medium ${isPaymentShort ? "text-destructive" : "text-foreground"
                    }`}
                >
                  {isPaymentShort
                    ? `Kurang ${formatRupiah(subtotal - amountPaid)}`
                    : formatRupiah(change)}
                </span>
              </div>
            </div>
          </div>

          {/* Info Transaksi */}
          <div className="rounded-xl border bg-muted/30 p-4">
            <div className="space-y-2 text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span>No. Transaksi</span>
                <span className="font-medium text-foreground">{data.transactionNumber}</span>
              </div>
              <div className="flex justify-between">
                <span>Kasir</span>
                <span className="font-medium text-foreground">{data.kasir}</span>
              </div>
              <div className="flex justify-between">
                <span>Waktu</span>
                <span className="font-medium text-foreground">{data.waktu}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete confirmation — matches barang delete dialog */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent className="sm:max-w-[400px]">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
              <HugeiconsIcon icon={Alert02Icon} size={20} />
              Hapus Transaksi?
            </AlertDialogTitle>
            <AlertDialogDescription className="pt-2 leading-relaxed">
              Anda yakin ingin menghapus transaksi{" "}
              <strong className="font-semibold text-foreground">
                {data.transactionNumber}
              </strong>
              ? Tindakan ini permanen.
              {data.status === "Selesai" && (
                <>
                  <br /><br />
                  *Stok barang yang terkait akan otomatis dikembalikan.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter className="gap-2 pt-4">
            <AlertDialogCancel
              onClick={() => setDeleteOpen(false)}
              className="mt-0 w-full sm:w-auto"
            >
              Batal
            </AlertDialogCancel>
            <Button
              type="button"
              variant="destructive"
              className="w-full sm:w-auto"
              loading={deleteMutation.isPending}
              loadingText="Menghapus..."
              onClick={() => {
                deleteMutation.mutate(data.id, {
                  onSuccess: (result) => {
                    if (result.success) {
                      toast.success("Transaksi berhasil dihapus")
                      setDeleteOpen(false)
                      router.push(basePath)
                      return
                    }

                    toast.error(result.error ?? "Transaksi gagal dihapus")
                  },
                  onError: () => toast.error("Transaksi gagal dihapus"),
                })
              }}
            >
              Hapus
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PageShell>
  )
}
