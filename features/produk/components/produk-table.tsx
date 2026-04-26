"use client"

import * as React from "react"
import Image from "next/image"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowDown01Icon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
  Delete02Icon,
  Edit02Icon,
  FilterIcon,
  MoreVerticalCircle01Icon,
  PackageIcon,
  SearchIcon,
  Tick02Icon,
  ViewIcon,
  Alert02Icon,
} from "@hugeicons/core-free-icons"

import { useIsMobile } from "@/hooks/use-mobile"
import {
  useUpdateProduct,
  useDeleteProduct,
  useToggleProductActive,
  useAdjustStock,
} from "../hooks/use-produk-actions"
import { ImageUpload } from "./produk-image-upload"
import { CategoryCombobox, UnitCombobox } from "./produk-header"
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
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { formatRupiah } from "@/lib/format-currency"
import { cn } from "@/lib/utils"
import type { ProdukCategory, ProdukItem } from "../types"

const statusOptions = ["Semua Status", "Aktif", "Stok Menipis", "Nonaktif"]
const sortOptions = [
  "Nama A-Z",
  "Nama Z-A",
  "Harga Tertinggi",
  "Harga Terendah",
  "Stok Terbanyak",
  "Stok Tersedikit",
]
const pageSize = 8

type ProdukTableProps = {
  products: ProdukItem[]
  categories: ProdukCategory[]
}

function FilterDropdown({
  value,
  options,
  onChange,
}: {
  value: string
  options: string[]
  onChange: (value: string) => void
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="w-full justify-between font-normal"
        >
          <span className="truncate">{value}</span>
          <HugeiconsIcon
            icon={ArrowDown01Icon}
            size={16}
            className="shrink-0 text-muted-foreground"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="w-[var(--radix-dropdown-menu-trigger-width)] max-h-72 overflow-y-auto"
      >
        {options.map((option) => (
          <DropdownMenuItem
            key={option}
            onSelect={() => onChange(option)}
            className="cursor-pointer justify-between"
          >
            <span className="truncate">{option}</span>
            {value === option && (
              <HugeiconsIcon
                icon={Tick02Icon}
                size={14}
                className="shrink-0 text-primary"
              />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function Field({
  label,
  children,
  error,
}: {
  label: string
  children: React.ReactNode
  error?: string[]
}) {
  return (
    <label className="grid gap-1.5 text-xs font-medium">
      <span>{label}</span>
      {children}
      {error && error[0] && (
        <span className="text-[10px] font-normal text-destructive">
          {error[0]}
        </span>
      )}
    </label>
  )
}

function getStatus(product: ProdukItem) {
  if (!product.isActive) return "Nonaktif"
  if (product.stock <= product.minStock) return "Stok Menipis"
  return "Aktif"
}

function ProductEditForm({
  product,
  categories,
  stickyFooter = false,
  closeButton,
  onSubmit,
  isPending,
  errors,
}: {
  product: ProdukItem
  categories: ProdukCategory[]
  stickyFooter?: boolean
  closeButton?: React.ReactNode
  onSubmit: (data: Record<string, unknown> & { id: string }) => void
  isPending: boolean
  errors: Record<string, string[]> | null
}) {
  const [imageUrl, setImageUrl] = React.useState<string | null>(product.image)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    onSubmit({
      id: product.id,
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
    })
  }

  const fields = (
    <>
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-4">
          <div className="mb-2 flex items-center gap-2 border-b pb-2">
            <h4 className="text-sm font-semibold">Informasi Dasar</h4>
          </div>

          <div className="flex flex-col items-start gap-3">
            <ImageUpload value={imageUrl} onChange={setImageUrl} />
            <Field label="Nama produk" error={errors?.name}>
              <Input
                name="name"
                required
                autoComplete="off"
                defaultValue={product.name}
                className="bg-muted/50"
              />
            </Field>
          </div>
          <input type="hidden" name="image" value={imageUrl ?? ""} />
          <Field label="Kategori" error={errors?.categoryId}>
            <CategoryCombobox
              categories={categories}
              defaultValue={product.category}
            />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Satuan" error={errors?.unit}>
              <UnitCombobox defaultValue={product.unit} />
            </Field>
            <Field label="Status">
              <Select
                name="isActive"
                defaultValue={product.isActive ? "on" : "off"}
              >
                <SelectTrigger className="w-full bg-muted/50">
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

        <div className="space-y-4">
          <div className="mb-2 flex items-center gap-2 border-b pb-2">
            <h4 className="text-sm font-semibold">Harga & Stok</h4>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Harga Beli" error={errors?.buyPrice}>
              <div className="relative">
                <span className="absolute top-1/2 left-3 -translate-y-1/2 text-sm text-muted-foreground">
                  Rp
                </span>
                <Input
                  name="buyPrice"
                  type="number"
                  min="0"
                  required
                  defaultValue={product.buyPrice}
                  className="bg-muted/50 pl-8"
                />
              </div>
            </Field>
            <Field label="Harga Jual" error={errors?.sellPrice}>
              <div className="relative">
                <span className="absolute top-1/2 left-3 -translate-y-1/2 text-sm text-muted-foreground">
                  Rp
                </span>
                <Input
                  name="sellPrice"
                  type="number"
                  min="0"
                  required
                  defaultValue={product.sellPrice}
                  className="bg-muted/50 pl-8 font-medium text-primary"
                />
              </div>
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Stok Saat Ini" error={errors?.stock}>
              <Input
                name="stock"
                type="number"
                min="0"
                required
                defaultValue={product.stock}
                className="bg-muted/50"
              />
            </Field>
            <Field label="Stok Minimum" error={errors?.minStock}>
              <Input
                name="minStock"
                type="number"
                min="0"
                required
                defaultValue={product.minStock}
                className="bg-muted/50"
              />
            </Field>
          </div>
        </div>
      </div>

      <div className="pt-2">
        <Field label="Deskripsi Produk" error={errors?.description}>
          <Textarea
            name="description"
            defaultValue={product.description ?? ""}
            className="min-h-[80px] bg-muted/50"
            placeholder="Opsional: Tambahkan deskripsi produk di sini..."
          />
        </Field>
      </div>
    </>
  )

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "flex flex-col gap-0 pt-2",
        stickyFooter && "min-h-0 flex-1"
      )}
      autoComplete="off"
    >
      <input type="hidden" name="id" value={product.id} />
      <div
        className={cn(
          "scrollbar-thin min-h-0 flex-1 overflow-y-auto px-2 pt-2 pb-2",
          !stickyFooter && "max-h-[55vh] sm:max-h-[60vh]"
        )}
      >
        {fields}
      </div>

      <DialogFooter
        className={cn(
          "shrink-0 gap-2 pt-2",
          stickyFooter
            ? "-mx-2 -mb-2 shrink-0 rounded-b-3xl bg-popover px-4 pt-3 pb-4"
            : "bg-popover/50 px-0 pt-3"
        )}
      >
        {closeButton}
        <Button type="submit" className="w-full sm:w-auto" disabled={isPending}>
          {isPending ? "Menyimpan..." : "Simpan Perubahan"}
        </Button>
      </DialogFooter>
    </form>
  )
}

function ProductEditDialog({
  product,
  categories,
}: {
  product: ProdukItem
  categories: ProdukCategory[]
}) {
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [drawerOpen, setDrawerOpen] = React.useState(false)
  const updateMutation = useUpdateProduct()
  const errors = updateMutation.errors ?? null

  return (
    <>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <button
            className="hidden rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground lg:inline-flex"
            aria-label="Edit produk"
          >
            <HugeiconsIcon icon={Edit02Icon} size={15} />
          </button>
        </DialogTrigger>
        <DialogContent className="scrollbar-thin max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl">Edit Produk</DialogTitle>
            <DialogDescription>
              Perubahan data produk langsung tersimpan setelah disimpan.
            </DialogDescription>
          </DialogHeader>
          <ProductEditForm
            product={product}
            categories={categories}
            errors={errors}
            isPending={updateMutation.isPending}
            onSubmit={(data) =>
              updateMutation.mutate(data, {
                onSuccess: (result) => {
                  if (result.success) setDialogOpen(false)
                },
              })
            }
            closeButton={
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="mt-2 w-full sm:mt-0 sm:w-auto"
                >
                  Batal
                </Button>
              </DialogClose>
            }
          />
        </DialogContent>
      </Dialog>

      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        <DrawerTrigger asChild>
          <button
            className="inline-flex rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground lg:hidden"
            aria-label="Edit produk"
          >
            <HugeiconsIcon icon={Edit02Icon} size={15} />
          </button>
        </DrawerTrigger>
        <DrawerContent className="max-h-[92vh] overflow-hidden border-0">
          <DrawerHeader>
            <DrawerTitle>Edit Produk</DrawerTitle>
            <DrawerDescription>
              Perubahan data produk langsung tersimpan setelah disimpan.
            </DrawerDescription>
          </DrawerHeader>
          <ProductEditForm
            product={product}
            categories={categories}
            stickyFooter
            errors={errors}
            isPending={updateMutation.isPending}
            onSubmit={(data) =>
              updateMutation.mutate(data, {
                onSuccess: (result) => {
                  if (result.success) setDrawerOpen(false)
                },
              })
            }
            closeButton={
              <DrawerClose asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="mt-2 w-full sm:mt-0 sm:w-auto"
                >
                  Batal
                </Button>
              </DrawerClose>
            }
          />
        </DrawerContent>
      </Drawer>
    </>
  )
}

function ProductDetailContent({ product }: { product: ProdukItem }) {
  return (
    <div className="grid gap-4 py-2">
      {product.image && (
        <div className="overflow-hidden rounded-xl bg-muted">
          <Image
            src={product.image}
            alt={product.name}
            width={400}
            height={160}
            className="h-40 w-full object-contain"
          />
        </div>
      )}
      <div className="grid grid-cols-2 gap-4 rounded-xl border bg-card p-4 shadow-sm">
        <div className="space-y-1">
          <p className="text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
            Kategori
          </p>
          <p className="font-medium">{product.category}</p>
        </div>
        <div className="space-y-1">
          <p className="text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
            Status
          </p>
          <div>
            <span
              className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${getStatus(product) === "Aktif" ? "bg-primary/10 text-primary ring-primary/20" : getStatus(product) === "Stok Menipis" ? "bg-amber-500/10 text-amber-600 ring-amber-500/20" : "bg-slate-500/10 text-slate-600 ring-slate-500/20"}`}
            >
              {getStatus(product)}
            </span>
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
            Harga Beli
          </p>
          <p className="font-medium text-muted-foreground">
            {formatRupiah(product.buyPrice)}
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
            Harga Jual
          </p>
          <p className="font-semibold text-primary">
            {formatRupiah(product.sellPrice)}
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
            Stok / Satuan
          </p>
          <p className="font-medium">
            {product.stock}{" "}
            <span className="text-muted-foreground">{product.unit}</span>
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
            Stok Minimum
          </p>
          <p className="font-medium">{product.minStock}</p>
        </div>
      </div>

      {product.description && (
        <div className="rounded-xl border bg-muted/30 p-4">
          <p className="mb-2 text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
            Deskripsi
          </p>
          <p className="text-sm leading-relaxed text-foreground/80">
            {product.description}
          </p>
        </div>
      )}
    </div>
  )
}

function ProductDetailDialog({ product }: { product: ProdukItem }) {
  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <button
            className="hidden rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground lg:inline-flex"
            aria-label="Lihat detail"
          >
            <HugeiconsIcon icon={ViewIcon} size={15} />
          </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 font-heading text-xl font-medium text-foreground">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <HugeiconsIcon icon={PackageIcon} size={20} />
              </span>
              <span className="truncate">{product.name}</span>
            </DialogTitle>
            <DialogDescription>
              Detail lengkap informasi produk.
            </DialogDescription>
          </DialogHeader>
          <ProductDetailContent product={product} />
        </DialogContent>
      </Dialog>

      <Drawer>
        <DrawerTrigger asChild>
          <button
            className="inline-flex rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground lg:hidden"
            aria-label="Lihat detail"
          >
            <HugeiconsIcon icon={ViewIcon} size={15} />
          </button>
        </DrawerTrigger>
        <DrawerContent className="max-h-[92vh] overflow-hidden border-0">
          <DrawerHeader>
            <DrawerTitle className="flex items-center gap-3 font-heading text-xl font-medium text-foreground">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <HugeiconsIcon icon={PackageIcon} size={20} />
              </span>
              <span className="truncate">{product.name}</span>
            </DrawerTitle>
            <DrawerDescription>
              Detail lengkap informasi produk.
            </DrawerDescription>
          </DrawerHeader>
          <div className="scrollbar-thin min-h-0 flex-1 overflow-y-auto px-4 pb-4">
            <ProductDetailContent product={product} />
          </div>
        </DrawerContent>
      </Drawer>
    </>
  )
}

function StockForm({
  product,
  isMobile,
  onSubmit,
  isPending,
}: {
  product: ProdukItem
  isMobile?: boolean
  onSubmit: (payload: {
    productId: string
    mode: string
    quantity: number
    reason?: string
  }) => void
  isPending: boolean
}) {
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const quantity = Number(formData.get("quantity"))
    if (!quantity || isNaN(quantity) || quantity < 0) return
    onSubmit({
      productId: product.id,
      mode: formData.get("mode") as string,
      quantity,
      reason: formData.get("reason") as string | undefined,
    })
  }

  const fields = (
    <div className="space-y-4">
      <Field label="Jenis Penyesuaian">
        <Select name="mode" defaultValue="add">
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
          name="quantity"
          type="number"
          min="0"
          required
          placeholder="Masukkan angka..."
          className="bg-background text-lg font-semibold placeholder:text-sm placeholder:font-normal"
        />
      </Field>
      <Field label="Keterangan (Opsional)">
        <Input
          name="reason"
          placeholder="Cth: Barang baru datang"
          className="bg-background"
        />
      </Field>
    </div>
  )

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "grid gap-4 pt-2",
        isMobile && "flex min-h-0 flex-1 flex-col gap-0 pt-0"
      )}
    >
      <input type="hidden" name="productId" value={product.id} />
      {isMobile ? (
        <div className="scrollbar-thin min-h-0 flex-1 overflow-y-auto px-2 pt-2 pb-6">
          {fields}
        </div>
      ) : (
        fields
      )}

      {isMobile ? (
        <DialogFooter className="-mx-2 -mb-2 shrink-0 gap-2 rounded-b-3xl bg-popover px-4 pt-2 pb-4">
          <DrawerClose asChild>
            <Button
              type="button"
              variant="outline"
              className="w-full sm:w-auto"
            >
              Batal
            </Button>
          </DrawerClose>
          <Button
            type="submit"
            className="w-full sm:w-auto"
            disabled={isPending}
          >
            {isPending ? "Menyimpan..." : "Simpan Stok"}
          </Button>
        </DialogFooter>
      ) : (
        <DialogFooter className="gap-2 pt-2">
          <DialogClose asChild>
            <Button
              type="button"
              variant="outline"
              className="w-full sm:w-auto"
            >
              Batal
            </Button>
          </DialogClose>
          <Button
            type="submit"
            className="w-full sm:w-auto"
            disabled={isPending}
          >
            {isPending ? "Menyimpan..." : "Simpan Stok"}
          </Button>
        </DialogFooter>
      )}
    </form>
  )
}

function ProductActionMenu({ product }: { product: ProdukItem }) {
  const [stockOpen, setStockOpen] = React.useState(false)
  const [deleteOpen, setDeleteOpen] = React.useState(false)
  const adjustMutation = useAdjustStock()
  const toggleMutation = useToggleProductActive()
  const deleteMutation = useDeleteProduct()
  const isMobile = useIsMobile()

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Aksi lainnya"
          >
            <HugeiconsIcon icon={MoreVerticalCircle01Icon} size={15} />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48 rounded-xl p-2">
          <DropdownMenuItem
            onSelect={() => setStockOpen(true)}
            className="cursor-pointer gap-2 rounded-lg py-2"
          >
            <HugeiconsIcon
              icon={PackageIcon}
              size={16}
              className="text-muted-foreground"
            />
            Update Stok
          </DropdownMenuItem>
          <DropdownMenuSeparator className="my-1" />
          <DropdownMenuItem
            onSelect={() =>
              toggleMutation.mutate({
                id: product.id,
                isActive: product.isActive,
              })
            }
            disabled={toggleMutation.isPending}
            className={`cursor-pointer gap-2 rounded-lg px-2 py-2 text-sm transition-colors outline-none hover:bg-accent ${product.isActive ? "text-amber-600 hover:text-amber-600" : "text-primary hover:text-primary"}`}
          >
            <div
              className={cn(
                "flex size-4 items-center justify-center rounded-full border",
                product.isActive
                  ? "border-amber-600 text-amber-600"
                  : "border-primary text-primary"
              )}
            >
              <div
                className={cn(
                  "size-2 rounded-full",
                  product.isActive ? "bg-amber-600" : "bg-primary"
                )}
              />
            </div>
            {product.isActive ? "Nonaktifkan" : "Aktifkan"}
          </DropdownMenuItem>
          <DropdownMenuSeparator className="my-1" />
          <DropdownMenuItem
            variant="destructive"
            onSelect={() => setDeleteOpen(true)}
            className="cursor-pointer gap-2 rounded-lg py-2"
          >
            <HugeiconsIcon icon={Delete02Icon} size={16} />
            Hapus Produk
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {isMobile ? (
        <Drawer open={stockOpen} onOpenChange={setStockOpen}>
          <DrawerContent className="max-h-[92vh] overflow-hidden border-0">
            <DrawerHeader>
              <DrawerTitle>Kelola Stok</DrawerTitle>
              <DrawerDescription>
                Sisa stok{" "}
                <strong className="font-semibold text-foreground">
                  {product.name}
                </strong>
                :{" "}
                <span className="font-bold text-primary">
                  {product.stock} {product.unit}
                </span>
              </DrawerDescription>
            </DrawerHeader>
            <StockForm
              product={product}
              isMobile
              isPending={adjustMutation.isPending}
              onSubmit={(payload) =>
                adjustMutation.mutate(payload, {
                  onSuccess: (data) => {
                    if (data.success) setStockOpen(false)
                  },
                })
              }
            />
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog open={stockOpen} onOpenChange={setStockOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Kelola Stok</DialogTitle>
              <DialogDescription>
                Sisa stok{" "}
                <strong className="font-semibold text-foreground">
                  {product.name}
                </strong>
                :{" "}
                <span className="font-bold text-primary">
                  {product.stock} {product.unit}
                </span>
              </DialogDescription>
            </DialogHeader>
            <StockForm
              product={product}
              isPending={adjustMutation.isPending}
              onSubmit={(payload) =>
                adjustMutation.mutate(payload, {
                  onSuccess: (data) => {
                    if (data.success) setStockOpen(false)
                  },
                })
              }
            />
          </DialogContent>
        </Dialog>
      )}

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent className="sm:max-w-[400px]">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
              <HugeiconsIcon icon={Alert02Icon} size={20} />
              Hapus Produk?
            </AlertDialogTitle>
            <AlertDialogDescription className="pt-2 leading-relaxed">
              Anda yakin ingin menghapus{" "}
              <strong className="font-semibold text-foreground">
                {product.name}
              </strong>
              ? Tindakan ini permanen. <br />
              <br />
              *Jika produk memiliki riwayat transaksi, produk otomatis hanya
              dinonaktifkan untuk menjaga validitas laporan.
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
              disabled={deleteMutation.isPending}
              onClick={() => {
                deleteMutation.mutate(product.id)
                setDeleteOpen(false)
              }}
            >
              {deleteMutation.isPending ? "Menghapus..." : "Hapus"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export function ProdukTable({ products, categories }: ProdukTableProps) {
  const [activeCategory, setActiveCategory] = React.useState("Semua")
  const [activeStatus, setActiveStatus] = React.useState("Semua Status")
  const [activeSort, setActiveSort] = React.useState("Nama A-Z")
  const [searchQuery, setSearchQuery] = React.useState("")
  const [currentPage, setCurrentPage] = React.useState(1)
  const [isFilterOpen, setIsFilterOpen] = React.useState(false)

  const categoryOptions = [
    "Semua",
    ...categories.map((category) => category.name),
  ]

  const filteredProducts = React.useMemo(() => {
    return products
      .filter((product) => {
        const matchCategory =
          activeCategory === "Semua" || product.category === activeCategory
        const matchSearch = product.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
        const matchStatus =
          activeStatus === "Semua Status" || getStatus(product) === activeStatus
        return matchCategory && matchSearch && matchStatus
      })
      .sort((a, b) => {
        if (activeSort === "Nama Z-A") return b.name.localeCompare(a.name)
        if (activeSort === "Harga Tertinggi") return b.sellPrice - a.sellPrice
        if (activeSort === "Harga Terendah") return a.sellPrice - b.sellPrice
        if (activeSort === "Stok Terbanyak") return b.stock - a.stock
        if (activeSort === "Stok Tersedikit") return a.stock - b.stock
        return a.name.localeCompare(b.name)
      })
  }, [activeCategory, activeSort, activeStatus, products, searchQuery])

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize))
  const safePage = Math.min(currentPage, totalPages)
  const pageProducts = filteredProducts.slice(
    (safePage - 1) * pageSize,
    safePage * pageSize
  )
  const startItem =
    filteredProducts.length === 0 ? 0 : (safePage - 1) * pageSize + 1
  const endItem = Math.min(safePage * pageSize, filteredProducts.length)
  const activeFilterCount =
    (activeCategory !== "Semua" ? 1 : 0) +
    (activeStatus !== "Semua Status" ? 1 : 0) +
    (activeSort !== "Nama A-Z" ? 1 : 0)
  const hasActiveFilters = activeFilterCount > 0

  const resetFilters = () => {
    setActiveCategory("Semua")
    setActiveStatus("Semua Status")
    setActiveSort("Nama A-Z")
  }

  return (
    <div className="flex flex-col gap-3 lg:gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Daftar Produk</h3>
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
        <div className="relative flex-1 p-[3px]">
          <HugeiconsIcon
            icon={SearchIcon}
            size={16}
            className="absolute top-1/2 left-[15px] -translate-y-1/2 text-muted-foreground"
          />
          <Input
            type="text"
            placeholder="Cari nama produk..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            className="h-9 rounded-lg bg-background pr-3 pl-9 text-sm"
          />
        </div>

        <Drawer open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <DrawerTrigger asChild>
            <Button
              variant={hasActiveFilters ? "default" : "outline"}
              className="justify-start gap-2 lg:hidden"
            >
              <HugeiconsIcon icon={FilterIcon} size={16} />
              Filter & Urutkan
              {hasActiveFilters && (
                <span className="ml-auto flex size-5 items-center justify-center rounded-full bg-primary-foreground text-[10px] font-bold text-primary">
                  {activeFilterCount}
                </span>
              )}
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Filter & Urutkan</DrawerTitle>
            </DrawerHeader>
            <div className="grid gap-4 px-4 pb-2">
              <Field label="Kategori">
                <FilterDropdown
                  value={activeCategory}
                  options={categoryOptions}
                  onChange={setActiveCategory}
                />
              </Field>
              <Field label="Status">
                <FilterDropdown
                  value={activeStatus}
                  options={statusOptions}
                  onChange={setActiveStatus}
                />
              </Field>
              <Field label="Urutkan">
                <FilterDropdown
                  value={activeSort}
                  options={sortOptions}
                  onChange={setActiveSort}
                />
              </Field>
            </div>
            <DrawerFooter>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={resetFilters}
                >
                  Reset
                </Button>
                <DrawerClose asChild>
                  <Button type="button" className="flex-1">
                    Terapkan
                  </Button>
                </DrawerClose>
              </div>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>

        <div className="hidden flex-wrap items-center gap-2 lg:flex">
          <Select value={activeCategory} onValueChange={setActiveCategory}>
            <SelectTrigger className="w-full lg:w-[180px]">
              <SelectValue placeholder="Kategori" />
            </SelectTrigger>
            <SelectContent>
              {categoryOptions.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={activeStatus} onValueChange={setActiveStatus}>
            <SelectTrigger className="w-full lg:w-[160px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={activeSort} onValueChange={setActiveSort}>
            <SelectTrigger className="w-full lg:w-[180px]">
              <SelectValue placeholder="Urutkan" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((sort) => (
                <SelectItem key={sort} value={sort}>
                  {sort}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border bg-card shadow-sm">
        <table className="w-full min-w-[860px] text-left">
          <thead>
            <tr className="border-b bg-muted/30">
              <th className="px-4 py-3 text-xs font-medium text-muted-foreground">
                Produk
              </th>
              <th className="px-4 py-3 text-xs font-medium text-muted-foreground">
                Kategori
              </th>
              <th className="px-4 py-3 text-xs font-medium text-muted-foreground">
                Stok
              </th>
              <th className="px-4 py-3 text-xs font-medium text-muted-foreground">
                Harga Jual
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
            {pageProducts.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-8 text-center text-sm text-muted-foreground"
                >
                  Tidak ada produk yang cocok.
                </td>
              </tr>
            )}
            {pageProducts.map((product) => {
              const status = getStatus(product)
              return (
                <tr
                  key={product.id}
                  className="border-b transition-colors last:border-0 hover:bg-muted/20"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {product.image ? (
                        <div className="size-9 shrink-0 overflow-hidden rounded-lg bg-muted">
                          <Image
                            src={product.image}
                            alt={product.name}
                            width={36}
                            height={36}
                            className="size-full object-contain"
                          />
                        </div>
                      ) : (
                        <div className="flex size-9 items-center justify-center rounded-lg bg-primary/5 text-primary">
                          <HugeiconsIcon icon={PackageIcon} size={17} />
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">
                          {product.name}
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          Modal {formatRupiah(product.buyPrice)}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {product.category}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium">
                    {product.stock}{" "}
                    <span className="text-xs font-normal text-muted-foreground">
                      {product.unit}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {formatRupiah(product.sellPrice)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold whitespace-nowrap ${status === "Aktif" ? "bg-primary/10 text-primary" : status === "Stok Menipis" ? "bg-amber-500/10 text-amber-600" : "bg-slate-500/10 text-slate-600"}`}
                    >
                      {status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <ProductEditDialog
                        product={product}
                        categories={categories}
                      />
                      <ProductDetailDialog product={product} />
                      <ProductActionMenu product={product} />
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col items-center justify-between gap-3 lg:flex-row">
        <p className="text-xs text-muted-foreground">
          Menampilkan {startItem}-{endItem} dari {filteredProducts.length}{" "}
          produk
        </p>
        <div className="flex items-center gap-1">
          <button
            disabled={safePage === 1}
            onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
            className="flex size-8 items-center justify-center rounded-lg border text-muted-foreground transition-colors hover:bg-muted disabled:opacity-50"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} size={14} />
          </button>
          {Array.from({ length: totalPages }, (_, index) => index + 1)
            .slice(0, 5)
            .map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`flex size-8 items-center justify-center rounded-lg text-xs font-medium transition-colors ${safePage === page ? "bg-primary text-primary-foreground" : "border text-muted-foreground hover:bg-muted"}`}
              >
                {page}
              </button>
            ))}
          <button
            disabled={safePage === totalPages}
            onClick={() =>
              setCurrentPage((page) => Math.min(totalPages, page + 1))
            }
            className="flex size-8 items-center justify-center rounded-lg border text-muted-foreground transition-colors hover:bg-muted disabled:opacity-50"
          >
            <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}
