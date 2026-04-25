"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  Delete02Icon,
  Edit02Icon,
  FilterIcon,
  MoreVerticalCircle01Icon,
  PackageIcon,
  SearchIcon,
  ViewIcon,
  Alert02Icon,
} from "@hugeicons/core-free-icons"

import { useIsMobile } from "@/hooks/use-mobile"
import { adjustStock, deleteProduct, setProductActive, updateProduct } from "@/app/admin/produk/actions"
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
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
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
import { formatRupiah } from "@/lib/format"
import { cn } from "@/lib/utils"
import { CategoryCombobox } from "./produk-header"
import type { ProdukCategory, ProdukItem } from "./types"

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

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-1.5 text-xs font-medium">
      <span>{label}</span>
      {children}
    </label>
  )
}

function getStatus(product: ProdukItem) {
  if (!product.isActive) return "Nonaktif"
  if (product.stock <= product.minStock) return "Stok Menipis"
  return "Aktif"
}

function ProductEditForm({ product, categories, stickyFooter = false, closeButton }: { product: ProdukItem; categories: ProdukCategory[]; stickyFooter?: boolean; closeButton?: React.ReactNode }) {
  const fields = (
    <>
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-4">
          <div className="mb-2 flex items-center gap-2 border-b pb-2">
            <h4 className="text-sm font-semibold">Informasi Dasar</h4>
          </div>

          <Field label="Nama produk">
            <Input name="name" required autoComplete="off" defaultValue={product.name} className="bg-muted/50" />
          </Field>
          <Field label="Kategori">
            <CategoryCombobox categories={categories} defaultValue={product.category} />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Satuan">
              <Input name="unit" required defaultValue={product.unit} className="bg-muted/50" />
            </Field>
            <Field label="Status">
              <Select name="isActive" defaultValue={product.isActive ? "on" : "off"}>
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
            <Field label="Harga Beli">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">Rp</span>
                <Input name="buyPrice" type="number" min="0" required defaultValue={product.buyPrice} className="bg-muted/50 pl-8" />
              </div>
            </Field>
            <Field label="Harga Jual">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">Rp</span>
                <Input name="sellPrice" type="number" min="0" required defaultValue={product.sellPrice} className="bg-muted/50 pl-8 font-medium text-primary" />
              </div>
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Stok Saat Ini">
              <Input name="stock" type="number" min="0" required defaultValue={product.stock} className="bg-muted/50" />
            </Field>
            <Field label="Stok Minimum">
              <Input name="minStock" type="number" min="0" required defaultValue={product.minStock} className="bg-muted/50" />
            </Field>
          </div>
        </div>
      </div>

      <div className="pt-2">
        <Field label="Deskripsi Produk">
          <Textarea name="description" defaultValue={product.description ?? ""} className="min-h-[80px] bg-muted/50" placeholder="Opsional: Tambahkan deskripsi produk di sini..." />
        </Field>
      </div>
    </>
  )

  return (
    <form action={updateProduct} className={cn("grid gap-6 pt-2", stickyFooter && "flex min-h-0 flex-1 flex-col gap-0 pt-0")} autoComplete="off">
      <input type="hidden" name="id" value={product.id} />
      {stickyFooter ? <div className="min-h-0 flex-1 overflow-y-auto px-2 pb-6 pt-2">{fields}</div> : fields}

      <DialogFooter className={cn("pt-2 gap-2", stickyFooter && "shrink-0 border-t bg-popover px-4 pb-4 pt-3 -mx-2 -mb-2 rounded-b-3xl")}>
        {closeButton}
        <Button type="submit" className="w-full sm:w-auto">Simpan Perubahan</Button>
      </DialogFooter>
    </form>
  )
}

function ProductEditDialog({ product, categories }: { product: ProdukItem; categories: ProdukCategory[] }) {
  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <button className="hidden rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground lg:inline-flex" aria-label="Edit produk">
            <HugeiconsIcon icon={Edit02Icon} size={15} />
          </button>
        </DialogTrigger>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl">Edit Produk</DialogTitle>
            <DialogDescription>Perubahan data produk langsung tersimpan setelah disimpan.</DialogDescription>
          </DialogHeader>
          <ProductEditForm product={product} categories={categories} closeButton={
            <DialogClose asChild>
              <Button type="button" variant="outline" className="w-full sm:w-auto mt-2 sm:mt-0">Batal</Button>
            </DialogClose>
          } />
        </DialogContent>
      </Dialog>

      <Drawer>
        <DrawerTrigger asChild>
          <button className="inline-flex rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground lg:hidden" aria-label="Edit produk">
            <HugeiconsIcon icon={Edit02Icon} size={15} />
          </button>
        </DrawerTrigger>
        <DrawerContent className="max-h-[92vh] overflow-hidden">
          <DrawerHeader>
            <DrawerTitle>Edit Produk</DrawerTitle>
            <DrawerDescription>Perubahan data produk langsung tersimpan setelah disimpan.</DrawerDescription>
          </DrawerHeader>
          <ProductEditForm product={product} categories={categories} stickyFooter closeButton={
            <DrawerClose asChild>
              <Button type="button" variant="outline" className="w-full sm:w-auto mt-2 sm:mt-0">Batal</Button>
            </DrawerClose>
          } />
        </DrawerContent>
      </Drawer>
    </>
  )
}

function ProductDetailContent({ product }: { product: ProdukItem }) {
  return (
    <div className="grid gap-4 py-2">
      <div className="grid grid-cols-2 gap-4 rounded-xl border bg-card p-4 shadow-sm">
        <div className="space-y-1">
          <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Kategori</p>
          <p className="font-medium">{product.category}</p>
        </div>
        <div className="space-y-1">
          <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Status</p>
          <div>
            <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${getStatus(product) === "Aktif" ? "bg-primary/10 text-primary ring-primary/20" : getStatus(product) === "Stok Menipis" ? "bg-amber-500/10 text-amber-600 ring-amber-500/20" : "bg-slate-500/10 text-slate-600 ring-slate-500/20"}`}>
              {getStatus(product)}
            </span>
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Harga Beli</p>
          <p className="font-medium text-muted-foreground">{formatRupiah(product.buyPrice)}</p>
        </div>
        <div className="space-y-1">
          <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Harga Jual</p>
          <p className="font-semibold text-primary">{formatRupiah(product.sellPrice)}</p>
        </div>
        <div className="space-y-1">
          <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Stok / Satuan</p>
          <p className="font-medium">{product.stock} <span className="text-muted-foreground">{product.unit}</span></p>
        </div>
        <div className="space-y-1">
          <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Stok Minimum</p>
          <p className="font-medium">{product.minStock}</p>
        </div>
      </div>

      {product.description && (
        <div className="rounded-xl border bg-muted/30 p-4">
          <p className="mb-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Deskripsi</p>
          <p className="text-sm leading-relaxed text-foreground/80">{product.description}</p>
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
          <button className="hidden rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground lg:inline-flex" aria-label="Lihat detail">
            <HugeiconsIcon icon={ViewIcon} size={15} />
          </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-xl font-heading font-medium text-foreground">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <HugeiconsIcon icon={PackageIcon} size={20} />
              </span>
              <span className="truncate">{product.name}</span>
            </DialogTitle>
            <DialogDescription>Detail lengkap informasi produk.</DialogDescription>
          </DialogHeader>
          <ProductDetailContent product={product} />
        </DialogContent>
      </Dialog>

      <Drawer>
        <DrawerTrigger asChild>
          <button className="inline-flex rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground lg:hidden" aria-label="Lihat detail">
            <HugeiconsIcon icon={ViewIcon} size={15} />
          </button>
        </DrawerTrigger>
        <DrawerContent className="max-h-[92vh] overflow-hidden">
          <DrawerHeader>
            <DrawerTitle className="flex items-center gap-3 text-xl font-heading font-medium text-foreground">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <HugeiconsIcon icon={PackageIcon} size={20} />
              </span>
              <span className="truncate">{product.name}</span>
            </DrawerTitle>
            <DrawerDescription>Detail lengkap informasi produk.</DrawerDescription>
          </DrawerHeader>
          <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-4">
            <ProductDetailContent product={product} />
          </div>
        </DrawerContent>
      </Drawer>
    </>
  )
}

function StockForm({ product, isMobile }: { product: ProdukItem, isMobile?: boolean }) {
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
        <Input name="quantity" type="number" min="0" required placeholder="Masukkan angka..." className="bg-background text-lg font-semibold" />
      </Field>
      <Field label="Keterangan (Opsional)">
        <Input name="reason" placeholder="Cth: Barang baru datang" className="bg-background" />
      </Field>
    </div>
  )

  return (
    <form action={adjustStock} className={cn("grid gap-4 pt-2", isMobile && "flex min-h-0 flex-1 flex-col gap-0 pt-0")}>
      <input type="hidden" name="productId" value={product.id} />
      {isMobile ? <div className="min-h-0 flex-1 overflow-y-auto px-2 pb-6 pt-2">{fields}</div> : fields}

      {isMobile ? (
        <DialogFooter className="pt-2 gap-2 shrink-0 border-t bg-popover px-4 pb-4 -mx-2 -mb-2 rounded-b-3xl">
          <DrawerClose asChild>
            <Button type="button" variant="outline" className="w-full sm:w-auto">Batal</Button>
          </DrawerClose>
          <Button type="submit" className="w-full sm:w-auto">Simpan Stok</Button>
        </DialogFooter>
      ) : (
        <DialogFooter className="pt-2 gap-2">
          <DialogClose asChild>
            <Button type="button" variant="outline" className="w-full sm:w-auto">Batal</Button>
          </DialogClose>
          <Button type="submit" className="w-full sm:w-auto">Simpan Stok</Button>
        </DialogFooter>
      )}
    </form>
  )
}

function ProductActionMenu({ product }: { product: ProdukItem }) {
  const [stockOpen, setStockOpen] = React.useState(false)
  const [deleteOpen, setDeleteOpen] = React.useState(false)
  const isMobile = useIsMobile()

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground" aria-label="Aksi lainnya">
            <HugeiconsIcon icon={MoreVerticalCircle01Icon} size={15} />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48 p-2 rounded-xl">
          <DropdownMenuItem onSelect={() => setStockOpen(true)} className="gap-2 cursor-pointer rounded-lg py-2">
            <HugeiconsIcon icon={PackageIcon} size={16} className="text-muted-foreground" />
            Update Stok
          </DropdownMenuItem>
          <DropdownMenuSeparator className="my-1" />
          <form action={setProductActive}>
            <input type="hidden" name="id" value={product.id} />
            <input type="hidden" name="isActive" value={product.isActive ? "false" : "true"} />
            <button
              type="submit"
              className={`flex w-full cursor-pointer items-center gap-2 rounded-lg px-2 py-2 text-sm outline-none transition-colors hover:bg-accent ${product.isActive ? "text-amber-600 hover:text-amber-600" : "text-primary hover:text-primary"}`}
            >
              <div className={cn("flex size-4 items-center justify-center rounded-full border", product.isActive ? "border-amber-600 text-amber-600" : "border-primary text-primary")}>
                <div className={cn("size-2 rounded-full", product.isActive ? "bg-amber-600" : "bg-primary")} />
              </div>
              {product.isActive ? "Nonaktifkan" : "Aktifkan"}
            </button>
          </form>
          <DropdownMenuSeparator className="my-1" />
          <DropdownMenuItem
            variant="destructive"
            onSelect={() => setDeleteOpen(true)}
            className="gap-2 cursor-pointer rounded-lg py-2"
          >
            <HugeiconsIcon icon={Delete02Icon} size={16} />
            Hapus Produk
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {isMobile ? (
        <Drawer open={stockOpen} onOpenChange={setStockOpen}>
          <DrawerContent className="max-h-[92vh] overflow-hidden">
            <DrawerHeader>
              <DrawerTitle>Kelola Stok</DrawerTitle>
              <DrawerDescription>Sisa stok <strong className="text-foreground font-semibold">{product.name}</strong>: <span className="font-bold text-primary">{product.stock} {product.unit}</span></DrawerDescription>
            </DrawerHeader>
            <StockForm product={product} isMobile />
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog open={stockOpen} onOpenChange={setStockOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Kelola Stok</DialogTitle>
              <DialogDescription>Sisa stok <strong className="text-foreground font-semibold">{product.name}</strong>: <span className="font-bold text-primary">{product.stock} {product.unit}</span></DialogDescription>
            </DialogHeader>
            <StockForm product={product} />
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
              Anda yakin ingin menghapus <strong className="text-foreground font-semibold">{product.name}</strong>? Tindakan ini permanen. <br /><br />
              *Jika produk memiliki riwayat transaksi, produk otomatis hanya dinonaktifkan untuk menjaga validitas laporan.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter className="pt-4">
            <AlertDialogCancel onClick={() => setDeleteOpen(false)} className="w-full sm:w-auto mt-0">Batal</AlertDialogCancel>
            <form action={deleteProduct} className="w-full sm:w-auto">
              <input type="hidden" name="id" value={product.id} />
              <Button type="submit" variant="destructive" className="w-full">Hapus</Button>
            </form>
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

  const categoryOptions = ["Semua", ...categories.map((category) => category.name)]

  const filteredProducts = React.useMemo(() => {
    return products
      .filter((product) => {
        const matchCategory = activeCategory === "Semua" || product.category === activeCategory
        const matchSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase())
        const matchStatus = activeStatus === "Semua Status" || getStatus(product) === activeStatus
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
  const pageProducts = filteredProducts.slice((safePage - 1) * pageSize, safePage * pageSize)
  const startItem = filteredProducts.length === 0 ? 0 : (safePage - 1) * pageSize + 1
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
        <div className="relative flex-1">
          <HugeiconsIcon icon={SearchIcon} size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Cari nama produk..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            className="h-9 w-full rounded-lg border bg-background pl-9 pr-3 text-sm outline-none ring-ring transition-colors placeholder:text-muted-foreground focus:ring-1"
          />
        </div>

        <Drawer open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <DrawerTrigger asChild>
            <Button variant={hasActiveFilters ? "default" : "outline"} className="justify-start gap-2 lg:hidden">
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
                <Select value={activeCategory} onValueChange={setActiveCategory}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryOptions.map((category) => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Status">
                <Select value={activeStatus} onValueChange={setActiveStatus}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((status) => (
                      <SelectItem key={status} value={status}>{status}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Urutkan">
                <Select value={activeSort} onValueChange={setActiveSort}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Urutkan" />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map((sort) => (
                      <SelectItem key={sort} value={sort}>{sort}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>
            <DrawerFooter>
              <div className="flex gap-2">
                <Button type="button" variant="outline" className="flex-1" onClick={resetFilters}>Reset</Button>
                <DrawerClose asChild>
                  <Button type="button" className="flex-1">Terapkan</Button>
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
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={activeStatus} onValueChange={setActiveStatus}>
            <SelectTrigger className="w-full lg:w-[160px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((status) => (
                <SelectItem key={status} value={status}>{status}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={activeSort} onValueChange={setActiveSort}>
            <SelectTrigger className="w-full lg:w-[180px]">
              <SelectValue placeholder="Urutkan" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((sort) => (
                <SelectItem key={sort} value={sort}>{sort}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border bg-card shadow-sm">
        <table className="w-full min-w-[860px] text-left">
          <thead>
            <tr className="border-b bg-muted/30">
              <th className="px-4 py-3 text-xs font-medium text-muted-foreground">Produk</th>
              <th className="px-4 py-3 text-xs font-medium text-muted-foreground">Kategori</th>
              <th className="px-4 py-3 text-xs font-medium text-muted-foreground">Stok</th>
              <th className="px-4 py-3 text-xs font-medium text-muted-foreground">Harga Jual</th>
              <th className="px-4 py-3 text-xs font-medium text-muted-foreground">Status</th>
              <th className="px-4 py-3 text-xs font-medium text-muted-foreground">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {pageProducts.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-sm text-muted-foreground">Tidak ada produk yang cocok.</td>
              </tr>
            )}
            {pageProducts.map((product) => {
              const status = getStatus(product)
              return (
                <tr key={product.id} className="border-b transition-colors last:border-0 hover:bg-muted/20">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex size-9 items-center justify-center rounded-lg bg-primary/5 text-primary">
                        <HugeiconsIcon icon={PackageIcon} size={17} />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{product.name}</p>
                        <p className="text-[11px] text-muted-foreground">Modal {formatRupiah(product.buyPrice)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{product.category}</td>
                  <td className="px-4 py-3 text-sm font-medium">{product.stock} <span className="text-xs font-normal text-muted-foreground">{product.unit}</span></td>
                  <td className="px-4 py-3 text-sm">{formatRupiah(product.sellPrice)}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${status === "Aktif" ? "bg-primary/10 text-primary" : status === "Stok Menipis" ? "bg-amber-500/10 text-amber-600" : "bg-slate-500/10 text-slate-600"}`}>
                      {status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <ProductEditDialog product={product} categories={categories} />
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
          Menampilkan {startItem}-{endItem} dari {filteredProducts.length} produk
        </p>
        <div className="flex items-center gap-1">
          <button disabled={safePage === 1} onClick={() => setCurrentPage((page) => Math.max(1, page - 1))} className="flex size-8 items-center justify-center rounded-lg border text-muted-foreground transition-colors hover:bg-muted disabled:opacity-50">
            <HugeiconsIcon icon={ArrowLeft01Icon} size={14} />
          </button>
          {Array.from({ length: totalPages }, (_, index) => index + 1).slice(0, 5).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`flex size-8 items-center justify-center rounded-lg text-xs font-medium transition-colors ${safePage === page ? "bg-primary text-primary-foreground" : "border text-muted-foreground hover:bg-muted"}`}
            >
              {page}
            </button>
          ))}
          <button disabled={safePage === totalPages} onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))} className="flex size-8 items-center justify-center rounded-lg border text-muted-foreground transition-colors hover:bg-muted disabled:opacity-50">
            <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}
