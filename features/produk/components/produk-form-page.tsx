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
} from "../hooks/use-produk-actions"
import { CategoryCombobox, UnitCombobox } from "./produk-header"
import { ImageUpload } from "./produk-image-upload"

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
import type { ProdukCategory, ProdukItem, ProdukStats } from "../types"

// ─── Field helper ────────────────────────────────────────────────────────────

function Field({
  label,
  required,
  children,
  error,
}: {
  label: string
  required?: boolean
  children: React.ReactNode
  error?: string[]
}) {
  return (
    <label className="grid gap-1.5 text-xs font-medium">
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
    </label>
  )
}

// ─── Types ───────────────────────────────────────────────────────────────────

type ProdukFormPageProps =
  | {
      mode: "create"
      product?: undefined
      categories: ProdukCategory[]
      units: string[]
      stats: ProdukStats
    }
  | {
      mode: "edit"
      product: ProdukItem
      categories: ProdukCategory[]
      units: string[]
      stats: ProdukStats
    }

// ─── Main Component ─────────────────────────────────────────────────────────

export function ProdukFormPage(props: ProdukFormPageProps) {
  const { mode, categories, units } = props
  const product = mode === "edit" ? props.product : undefined
  const router = useRouter()
  const formRef = React.useRef<HTMLFormElement>(null)

  const createMutation = useCreateProduct()
  const updateMutation = useUpdateProduct()
  const deleteMutation = useDeleteProduct()
  const mutation = mode === "create" ? createMutation : updateMutation
  const errors = mutation.data?.success === false ? (mutation.data.errors ?? null) : null

  const [imageUrl, setImageUrl] = React.useState<string | null>(
    product?.image ?? null
  )
  const [deleteOpen, setDeleteOpen] = React.useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)

  function collectFormData(): Record<string, unknown> & { id?: string } {
    const fd = new FormData(formRef.current!)
    const data: Record<string, unknown> = {
      name: String(fd.get("name") ?? "").trim(),
      categoryName: String(fd.get("categoryName") ?? "").trim(),
      unit: String(fd.get("unit") ?? "").trim(),
      stock: Number(fd.get("stock") ?? 0),
      minStock: Number(fd.get("minStock") ?? 0),
      buyPrice: Number(fd.get("buyPrice") ?? 0),
      sellPrice: Number(fd.get("sellPrice") ?? 0),
      description: String(fd.get("description") ?? "").trim(),
      isActive: fd.get("isActive") as string,
      image: imageUrl,
    }
    if (product) data.id = product.id
    return data as Record<string, unknown> & { id?: string }
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const data = collectFormData()

    if (mode === "create") {
      createMutation.mutate(data, {
        onSuccess: (result) => {
            if (result.success) {
              toast.success("Produk berhasil ditambahkan")
            router.push("/admin/produk")
          }
        },
      })
    } else {
      updateMutation.mutate(data as Record<string, unknown> & { id: string }, {
        onSuccess: (result) => {
          if (result.success) {
            toast.success("Produk berhasil diperbarui")
            router.push("/admin/produk")
          }
        },
      })
    }
  }

  function handleDelete() {
    if (!product) return
    deleteMutation.mutate(product.id, {
      onSuccess: (result) => {
        if (result.success) {
          toast.success("Produk berhasil dihapus")
          router.push("/admin/produk")
        }
      },
    })
  }

  return (
    <div className="flex min-w-0 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight lg:text-2xl">
            {mode === "create" ? "Tambah Produk" : "Edit Produk"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {mode === "create"
              ? "Tambahkan produk baru ke katalog warung Anda"
              : "Perbarui detail produk dan pengaturan penjualannya"}
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
              <span className="hidden sm:inline">Hapus Produk</span>
            </Button>
          )}
          <Button
            type="button"
            variant="outline"
            className="gap-2"
            onClick={() => router.push("/admin/produk")}
          >
            <HugeiconsIcon icon={Cancel01Icon} size={14} />
            Batal
          </Button>
          <Button
            type="submit"
            form="produk-form"
            className="gap-2"
            disabled={mutation.isPending}
          >
            <HugeiconsIcon icon={FloppyDiskIcon} size={16} />
            {mutation.isPending
              ? "Menyimpan..."
              : mode === "create"
                ? "Simpan Produk"
                : "Simpan Perubahan"}
          </Button>
        </div>
      </div>

      {/* ── Main: Form + Preview ───────────────────────────────────────── */}
      <div className="mx-auto flex w-full max-w-5xl min-w-0 flex-col gap-6 pb-24 lg:pb-0">
        {/* Left: Form */}
        <form
          id="produk-form"
          ref={formRef}
          onSubmit={handleSubmit}
          autoComplete="off"
          className="flex min-w-0 flex-1 flex-col gap-6"
        >
          {/* Informasi Produk */}
          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold">
              <span className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <HugeiconsIcon icon={PackageIcon} size={14} />
              </span>
              Informasi Produk
            </h2>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Field label="Foto Produk">
                <input type="hidden" name="image" value={imageUrl ?? ""} />
                <ImageUpload value={imageUrl} onChange={setImageUrl} />
              </Field>

              <Field label="Nama Produk" required error={errors?.name}>
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

              <Field
                label={mode === "create" ? "Stok Awal" : "Stok Saat Ini"}
                required
                error={errors?.stock}
              >
                <Input
                  name="stock"
                  type="number"
                  min="0"
                  required
                  defaultValue={product?.stock ?? 0}
                  className="bg-input/30"
                />
              </Field>

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
            </div>
          </div>

          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold">Deskripsi (opsional)</h2>
            <Textarea
              name="description"
              defaultValue={product?.description ?? ""}
              className="min-h-[100px] bg-input/30"
              placeholder="Tambahkan deskripsi produk untuk membantu pelanggan memahami produk ini..."
            />
          </div>

        </form>
      </div>

      {/* Floating Action Button for Mobile/Tablet */}
      <div className="lg:hidden">
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
        <div className="fixed right-6 bottom-24 z-40 flex flex-col items-end gap-3">
          <div
            className={`flex flex-col items-end gap-3 transition-all duration-200 ${isMobileMenuOpen ? "translate-y-0 scale-100 opacity-100" : "pointer-events-none translate-y-4 scale-95 opacity-0"}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <Button
              type="button"
              className="h-12 rounded-full px-5 shadow-lg"
              onClick={() => formRef.current?.requestSubmit()}
              disabled={mutation.isPending}
            >
              <HugeiconsIcon icon={FloppyDiskIcon} size={18} />
              {mutation.isPending ? "Menyimpan..." : "Simpan"}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-12 rounded-full px-5 shadow-lg"
              onClick={() => router.push("/admin/produk")}
            >
              <HugeiconsIcon icon={Cancel01Icon} size={16} />
              Batal
            </Button>
            {mode === "edit" && (
              <Button
                type="button"
                variant="outline"
                className="h-12 rounded-full border-destructive/30 px-5 text-destructive shadow-lg hover:bg-destructive/5 hover:text-destructive"
                onClick={() => setDeleteOpen(true)}
              >
                <HugeiconsIcon icon={Delete02Icon} size={16} />
                Hapus
              </Button>
            )}
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`flex size-14 items-center justify-center rounded-full shadow-lg transition-all duration-200 active:scale-95 ${isMobileMenuOpen ? "border bg-card text-foreground" : "bg-primary text-primary-foreground"}`}
          >
            <HugeiconsIcon
              icon={FloppyDiskIcon}
              size={22}
              className={`transition-transform duration-200 ${isMobileMenuOpen ? "rotate-45" : ""}`}
            />
          </button>
        </div>
      </div>

      {/* Delete confirmation dialog */}
      {mode === "edit" && (
        <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Hapus Produk?</AlertDialogTitle>
              <AlertDialogDescription>
                Produk &ldquo;{product?.name}&rdquo; akan dihapus secara
                permanen. Jika produk sudah memiliki riwayat transaksi, produk
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
