"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  PackageIcon,
  Cancel01Icon,
  Delete02Icon,
  FloppyDiskIcon,
} from "@hugeicons/core-free-icons"
import { toast } from "sonner"

import {
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
  useAdjustStock,
} from "../hooks/use-barang-actions"
import { CategoryCombobox, UnitCombobox } from "./barang-header"
import { ImageUpload } from "./barang-image-upload"

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import type { BarangCategory, BarangItem, BarangStats } from "../types"

// ─── Field helper ────────────────────────────────────────────────────────────

function Field({
  label,
  required,
  children,
  error,
  asLabel = true,
}: {
  label: string
  required?: boolean
  children: React.ReactNode
  error?: string[]
  asLabel?: boolean
}) {
  const Wrapper = asLabel ? "label" : "div"

  return (
    <Wrapper className="grid gap-1.5 text-xs font-medium">
      <span>
        {label}
        {required && <span className="ml-0.5 text-destructive">*</span>}
      </span>
      {children}
      {error?.[0] && (
        <span className="text-[10px] font-normal text-destructive">
          {error[0]}
        </span>
      )}
    </Wrapper>
  )
}

// ─── Types ───────────────────────────────────────────────────────────────────

type BarangFormPageProps =
  | {
      mode: "create"
      product?: undefined
      categories: BarangCategory[]
      units: string[]
      stats: BarangStats
    }
  | {
      mode: "edit"
      product: BarangItem
      categories: BarangCategory[]
      units: string[]
      stats: BarangStats
    }

// ─── Main Component ─────────────────────────────────────────────────────────

export function BarangFormPage(props: BarangFormPageProps) {
  const { mode, categories, units } = props
  const product = mode === "edit" ? props.product : undefined
  const router = useRouter()
  const formRef = React.useRef<HTMLFormElement>(null)

  const createMutation = useCreateProduct()
  const updateMutation = useUpdateProduct()
  const deleteMutation = useDeleteProduct()
  const adjustStockMutation = useAdjustStock()
  const mutation = mode === "create" ? createMutation : updateMutation
  const errors = mutation.data?.success === false ? (mutation.data.errors ?? null) : null
  const isPending = mutation.isPending || adjustStockMutation.isPending

  const [imageUrl, setImageUrl] = React.useState<string | null>(
    product?.image ?? null
  )
  const [deleteOpen, setDeleteOpen] = React.useState(false)
  // no mobile action menu anymore (replaced by fixed bottom bar)

  function collectFormData(): Record<string, unknown> & { id?: string } {
    const fd = new FormData(formRef.current!)
    const data: Record<string, unknown> = {
      name: String(fd.get("name") ?? "").trim(),
      categoryName: String(fd.get("categoryName") ?? "").trim(),
      unit: String(fd.get("unit") ?? "").trim(),
      minStock: Number(fd.get("minStock") ?? 0),
      buyPrice: Number(fd.get("buyPrice") ?? 0),
      sellPrice: Number(fd.get("sellPrice") ?? 0),
      description: String(fd.get("description") ?? "").trim(),
      isActive: fd.get("isActive") as string,
      image: imageUrl,
    }
    if (mode === "create") data.stock = Number(fd.get("stock") ?? 0)
    if (product) data.id = product.id
    return data as Record<string, unknown> & { id?: string }
  }

  function collectStockAdjustment() {
    if (mode !== "edit" || !product) return null

    const fd = new FormData(formRef.current!)
    const rawQuantity = String(fd.get("stockAdjustmentQuantity") ?? "").trim()
    if (!rawQuantity) return null

    const adjustmentMode = String(fd.get("stockAdjustmentMode") ?? "add")
    const quantity = Number(rawQuantity)
    if (!Number.isFinite(quantity) || quantity < 0) return null
    if (adjustmentMode === "add" && quantity === 0) return null

    return {
      productId: product.id,
      mode: adjustmentMode,
      quantity,
      reason: String(fd.get("stockAdjustmentReason") ?? "").trim() || undefined,
    }
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const data = collectFormData()

    if (mode === "create") {
      createMutation.mutate(data, {
        onSuccess: (result) => {
          if (result.success) {
            toast.success("Barang berhasil ditambahkan")
            router.push("/admin/barang")
            return
          }

          toast.error(result.error ?? "Barang gagal ditambahkan")
        },
        onError: () => toast.error("Barang gagal ditambahkan"),
      })
    } else {
      const stockAdjustment = collectStockAdjustment()

      updateMutation.mutate(data as Record<string, unknown> & { id: string }, {
        onSuccess: (result) => {
          if (!result.success) {
            toast.error(result.error ?? "Barang gagal diperbarui")
            return
          }

          if (stockAdjustment) {
            adjustStockMutation.mutate(stockAdjustment, {
              onSuccess: (adjustResult) => {
                if (adjustResult.success) {
                  toast.success("Barang dan stok berhasil diperbarui")
                  router.push("/admin/barang")
                  return
                }

                toast.error(adjustResult.error ?? "Stok gagal diperbarui")
              },
              onError: () => toast.error("Stok gagal diperbarui"),
            })
            return
          }

          toast.success("Barang berhasil diperbarui")
          router.push("/admin/barang")
        },
        onError: () => toast.error("Barang gagal diperbarui"),
      })
    }
  }

  function handleDelete() {
    if (!product) return
    deleteMutation.mutate(product.id, {
      onSuccess: (result) => {
        if (result.success) {
          toast.success("Barang berhasil dihapus")
          router.push("/admin/barang")
          return
        }

        toast.error(result.error ?? "Barang gagal dihapus")
      },
      onError: () => toast.error("Barang gagal dihapus"),
    })
  }

  return (
    <div className="flex min-w-0 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="mx-auto hidden w-full max-w-5xl flex-col gap-4 lg:flex lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight lg:text-2xl">
            {mode === "create" ? "Tambah Barang" : "Edit Barang"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {mode === "create"
              ? "Tambahkan barang baru ke katalog warung Anda"
              : "Perbarui detail barang dan pengaturan penjualannya"}
          </p>
        </div>
        <div className="hidden flex-wrap items-center gap-2 lg:flex">
          {mode === "edit" && (
            <Button
              type="button"
              variant="outline"
              className="gap-2 border-destructive/30 text-destructive hover:bg-destructive/5 hover:text-destructive"
              onClick={() => setDeleteOpen(true)}
            >
              <HugeiconsIcon icon={Delete02Icon} size={16} />
              <span className="hidden sm:inline">Hapus Barang</span>
            </Button>
          )}
          <Button
            type="button"
            variant="outline"
            className="gap-2"
            onClick={() => router.push("/admin/barang")}
          >
            <HugeiconsIcon icon={Cancel01Icon} size={14} />
            Batal
          </Button>
          <Button
            type="submit"
            form="barang-form"
            className="gap-2"
            disabled={isPending}
          >
            <HugeiconsIcon icon={FloppyDiskIcon} size={16} />
            {isPending
              ? "Menyimpan..."
              : mode === "create"
                ? "Simpan Barang"
                : "Simpan Perubahan"}
          </Button>
        </div>
      </div>

      {/* ── Main: Form + Preview ───────────────────────────────────────── */}
      <div className="mx-auto flex w-full max-w-5xl min-w-0 flex-col gap-6 pb-32 lg:pb-0">
        {/* Left: Form */}
        <form
          id="barang-form"
          ref={formRef}
          onSubmit={handleSubmit}
          autoComplete="off"
          className="flex min-w-0 flex-1 flex-col gap-6"
        >
          {/* Informasi Barang */}
          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold">
              <span className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <HugeiconsIcon icon={PackageIcon} size={14} />
              </span>
              Informasi Barang
            </h2>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Field label="Foto Barang" asLabel={false}>
                <input type="hidden" name="image" value={imageUrl ?? ""} />
                <ImageUpload value={imageUrl} onChange={setImageUrl} />
              </Field>

              <Field label="Nama Barang" required error={errors?.name}>
                <Input
                  name="name"
                  required
                  defaultValue={product?.name}
                  placeholder="Contoh: Beras Premium 5kg"
                  className="bg-input/30"
                />
              </Field>

              <Field label="Kategori" required error={errors?.categoryId}>
                <CategoryCombobox
                  categories={categories}
                  defaultValue={product?.category}
                />
              </Field>

              <Field label="Satuan" required error={errors?.unit}>
                <UnitCombobox units={units} defaultValue={product?.unit} />
              </Field>

              <Field label="Status">
                <Select
                  name="isActive"
                  defaultValue={product?.isActive === false ? "off" : "on"}
                >
                  <SelectTrigger className="w-full bg-input/30">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="on">Aktif</SelectItem>
                    <SelectItem value="off">Nonaktif</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </div>
          </div>

          {/* Harga & Stok */}
          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold">
              <span className="flex size-7 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600">
                <HugeiconsIcon icon={PackageIcon} size={14} />
              </span>
              {mode === "create" ? "Harga & Persediaan Awal" : "Harga & Stok"}
            </h2>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Field label="Harga Beli" required error={errors?.buyPrice}>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    Rp
                  </span>
                  <Input
                    name="buyPrice"
                    type="number"
                    min="0"
                    required
                    defaultValue={product?.buyPrice}
                    placeholder="0"
                    className="bg-input/30 pl-8"
                  />
                </div>
              </Field>

              <Field label="Harga Jual" required error={errors?.sellPrice}>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    Rp
                  </span>
                  <Input
                    name="sellPrice"
                    type="number"
                    min="0"
                    required
                    defaultValue={product?.sellPrice}
                    placeholder="0"
                    className="bg-input/30 pl-8 font-medium text-primary"
                  />
                </div>
              </Field>

              {mode === "create" ? (
                <Field label="Stok Awal" required error={errors?.stock}>
                  <Input
                    name="stock"
                    type="number"
                    min="0"
                    required
                    defaultValue={0}
                    className="bg-input/30"
                  />
                </Field>
              ) : null}

              <Field label="Stok Minimum" required error={errors?.minStock}>
                <Input
                  name="minStock"
                  type="number"
                  min="0"
                  required
                  defaultValue={product?.minStock ?? 5}
                  className="bg-input/30"
                />
              </Field>

              {mode === "edit" && (
                <div className="sm:col-span-2 lg:col-span-3">
                  <div className="rounded-xl bg-muted/25 p-4">
                    <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm font-semibold text-foreground">Penyesuaian Stok</p>
                        <p className="text-xs font-normal text-muted-foreground">
                          Opsional. Kosongkan jumlah kalau stok tidak berubah.
                        </p>
                      </div>
                      <p className="text-xs font-medium text-muted-foreground">
                        Stok saat ini:{" "}
                        <span className="font-bold text-primary">
                          {product?.stock ?? 0} {product?.unit}
                        </span>
                      </p>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1.5fr]">
                      <Field label="Jenis Penyesuaian">
                        <Select name="stockAdjustmentMode" defaultValue="add">
                          <SelectTrigger className="w-full bg-background">
                            <SelectValue placeholder="Pilih aksi" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="add">Stok Masuk (+)</SelectItem>
                            <SelectItem value="set">Ubah Total Stok (=)</SelectItem>
                          </SelectContent>
                        </Select>
                      </Field>

                      <Field label="Jumlah">
                        <Input
                          name="stockAdjustmentQuantity"
                          type="number"
                          min="0"
                          placeholder="Contoh: 12"
                          className="bg-background"
                        />
                      </Field>

                      <Field label="Keterangan">
                        <Input
                          name="stockAdjustmentReason"
                          placeholder="Contoh: Restok dari supplier"
                          className="bg-background"
                        />
                      </Field>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold">Deskripsi (opsional)</h2>
            <Textarea
              name="description"
              defaultValue={product?.description ?? ""}
              className="min-h-[100px] bg-input/30"
              placeholder="Tambahkan deskripsi barang untuk membantu pelanggan memahami barang ini..."
            />
          </div>

        </form>
      </div>

      {/* Bottom Bar for Mobile/Tablet */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/95 px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] shadow-[0_-12px_30px_rgba(15,23,42,0.12)] backdrop-blur lg:hidden">
        <div className="mx-auto max-w-md">
          <Button
            type="button"
            className="h-12 w-full rounded-xl gap-2"
            onClick={() => formRef.current?.requestSubmit()}
            disabled={isPending}
          >
            <HugeiconsIcon icon={FloppyDiskIcon} size={18} />
            {isPending
              ? "Menyimpan..."
              : mode === "create"
                ? "Simpan Barang"
                : "Simpan Barang"}
          </Button>
        </div>
      </div>

      {/* Delete confirmation dialog */}
      {mode === "edit" && (
        <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Hapus Barang?</AlertDialogTitle>
              <AlertDialogDescription>
                Barang &ldquo;{product?.name}&rdquo; akan dihapus secara
                permanen. Jika barang sudah memiliki riwayat transaksi, barang
                akan dinonaktifkan sebagai gantinya.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Batal</AlertDialogCancel>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? "Menghapus..." : "Ya, Hapus"}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  )
}
