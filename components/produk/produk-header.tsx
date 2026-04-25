"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowDown01Icon, PlusSignIcon, Tick02Icon } from "@hugeicons/core-free-icons"

import { useCreateProduct } from "./use-produk-actions"
import { ImageUpload } from "./produk-image-upload"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
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
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import type { ProdukCategory } from "./types"

type ProdukHeaderProps = {
  categories: ProdukCategory[]
}

function Field({ label, children, error }: { label: string; children: React.ReactNode; error?: string[] }) {
  return (
    <label className="grid gap-1.5 text-xs font-medium">
      <span>{label}</span>
      {children}
      {error && error[0] && <span className="text-[10px] text-destructive font-normal">{error[0]}</span>}
    </label>
  )
}

export function CategoryCombobox({
  categories,
  defaultValue = "",
}: {
  categories: ProdukCategory[]
  defaultValue?: string
}) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState(defaultValue)
  const [search, setSearch] = React.useState("")
  const normalizedValue = value.trim().toLowerCase()
  const hasExactMatch = categories.some((category) => category.name.toLowerCase() === normalizedValue)
  const suggestedNewCategory = search.trim()

  return (
    <div className="grid gap-1.5">
      <input type="hidden" name="categoryName" value={value} />
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "h-9 w-full justify-between rounded-4xl bg-input/30 px-3 font-normal",
              !value && "text-muted-foreground"
            )}
          >
            <span className="truncate">{value || "Pilih atau buat kategori"}</span>
            <HugeiconsIcon icon={ArrowDown01Icon} size={16} className="opacity-60" />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-(--radix-popover-trigger-width) p-0">
          <Command shouldFilter={false}>
            <CommandInput value={search} onValueChange={setSearch} placeholder="Cari atau ketik kategori baru..." />
            <CommandList>
              <CommandEmpty>
                {suggestedNewCategory ? "Tekan opsi buat kategori baru." : "Kategori belum ada."}
              </CommandEmpty>
              <CommandGroup heading="Kategori">
                {categories
                  .filter((category) => category.name.toLowerCase().includes(search.toLowerCase()))
                  .map((category) => (
                    <CommandItem
                      key={category.id}
                      value={category.name}
                      onSelect={() => {
                        setValue(category.name)
                        setSearch("")
                        setOpen(false)
                      }}
                    >
                      {category.name}
                      <HugeiconsIcon
                        icon={Tick02Icon}
                        size={16}
                        className={cn("ml-auto", value === category.name ? "opacity-100" : "opacity-0")}
                      />
                    </CommandItem>
                  ))}
              </CommandGroup>
              {suggestedNewCategory && !hasExactMatch && (
                <CommandGroup heading="Kategori Baru">
                  <CommandItem
                    value={suggestedNewCategory}
                    onSelect={() => {
                      setValue(suggestedNewCategory)
                      setSearch("")
                      setOpen(false)
                    }}
                  >
                    <HugeiconsIcon icon={PlusSignIcon} size={16} />
                    Buat &quot;{suggestedNewCategory}&quot;
                  </CommandItem>
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <p className="text-[11px] text-muted-foreground">Pilih kategori lama atau ketik nama baru.</p>
    </div>
  )
}

const COMMON_UNITS = ["kg", "gram", "liter", "ml", "pcs", "zak", "ikat", "butir", "ons", "pak", "bal", "box", "botol", "sachet"]

export function UnitCombobox({ defaultValue = "" }: { defaultValue?: string }) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState(defaultValue)
  const [search, setSearch] = React.useState("")
  const normalizedSearch = search.trim().toLowerCase()
  const filteredUnits = COMMON_UNITS.filter((unit) => unit.toLowerCase().includes(normalizedSearch))
  const hasExactMatch = COMMON_UNITS.some((unit) => unit.toLowerCase() === normalizedSearch)
  const suggestedUnit = search.trim()

  return (
    <div className="grid gap-1.5">
      <input type="hidden" name="unit" value={value} />
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "h-9 w-full justify-between rounded-4xl bg-input/30 px-3 font-normal",
              !value && "text-muted-foreground"
            )}
          >
            <span className="truncate">{value || "Pilih satuan"}</span>
            <HugeiconsIcon icon={ArrowDown01Icon} size={16} className="opacity-60" />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-64 p-0">
          <Command shouldFilter={false}>
            <CommandInput value={search} onValueChange={setSearch} placeholder="Cari atau ketik satuan baru..." />
            <CommandList>
              <CommandEmpty>
                {suggestedUnit ? "Tekan untuk buat satuan baru." : "Satuan belum ada."}
              </CommandEmpty>
              <CommandGroup heading="Satuan">
                {filteredUnits.map((unit) => (
                  <CommandItem
                    key={unit}
                    value={unit}
                    onSelect={() => {
                      setValue(unit)
                      setSearch("")
                      setOpen(false)
                    }}
                  >
                    {unit}
                    <HugeiconsIcon
                      icon={Tick02Icon}
                      size={16}
                      className={cn("ml-auto", value === unit ? "opacity-100" : "opacity-0")}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
              {suggestedUnit && !hasExactMatch && (
                <CommandGroup heading="Satuan Baru">
                  <CommandItem
                    value={suggestedUnit}
                    onSelect={() => {
                      setValue(suggestedUnit)
                      setSearch("")
                      setOpen(false)
                    }}
                  >
                    <HugeiconsIcon icon={PlusSignIcon} size={16} />
                    Buat &quot;{suggestedUnit}&quot;
                  </CommandItem>
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}

function ProductCreateForm({
  categories,
  stickyFooter = false,
  closeButton,
  onSubmit,
  isPending,
  errors,
}: ProdukHeaderProps & {
  stickyFooter?: boolean
  closeButton?: React.ReactNode
  onSubmit: (data: Record<string, unknown>) => void
  isPending: boolean
  errors: Record<string, string[]> | null
}) {
  const [imageUrl, setImageUrl] = React.useState<string | null>(null)

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
              <Input name="name" required autoComplete="off" placeholder="Contoh: Beras Premium 5kg" className="bg-muted/50" />
            </Field>
          </div>
          <input type="hidden" name="image" value={imageUrl ?? ""} />
          <Field label="Kategori" error={errors?.categoryId}>
            <CategoryCombobox categories={categories} />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Satuan" error={errors?.unit}>
              <UnitCombobox />
            </Field>
            <Field label="Status">
              <Select name="isActive" defaultValue="on">
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
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">Rp</span>
                <Input name="buyPrice" type="number" min="0" required placeholder="0" className="bg-muted/50 pl-8" />
              </div>
            </Field>
            <Field label="Harga Jual" error={errors?.sellPrice}>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">Rp</span>
                <Input name="sellPrice" type="number" min="0" required placeholder="0" className="bg-muted/50 pl-8 font-medium text-primary" />
              </div>
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Stok Awal" error={errors?.stock}>
              <Input name="stock" type="number" min="0" required defaultValue={0} className="bg-muted/50" />
            </Field>
            <Field label="Stok Minimum" error={errors?.minStock}>
              <Input name="minStock" type="number" min="0" required defaultValue={5} className="bg-muted/50" />
            </Field>
          </div>
        </div>
      </div>

      <div className="pt-2">
        <Field label="Deskripsi Produk" error={errors?.description}>
          <Textarea name="description" className="min-h-[80px] bg-muted/50" placeholder="Opsional: Tambahkan deskripsi produk di sini..." />
        </Field>
      </div>
    </>
  )

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    onSubmit({
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

  return (
    <form onSubmit={handleSubmit} className={cn("flex flex-col gap-0 pt-2", stickyFooter && "min-h-0 flex-1")} autoComplete="off">
      <div className={cn("min-h-0 flex-1 overflow-y-auto px-2 pt-2 pb-2", !stickyFooter && "max-h-[55vh] sm:max-h-[60vh]")}>
        {fields}
      </div>

      <DialogFooter className={cn("pt-2 gap-2 shrink-0", stickyFooter ? "shrink-0 bg-popover px-4 pb-4 pt-3 -mx-2 -mb-2 rounded-b-3xl" : "bg-popover/50 px-0 pt-3")}>
        {closeButton}
        <Button type="submit" className="w-full sm:w-auto" disabled={isPending}>
          {isPending ? "Menyimpan..." : "Simpan Produk"}
        </Button>
      </DialogFooter>
    </form>
  )
}

function ProductCreateDialog({ categories }: ProdukHeaderProps) {
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [drawerOpen, setDrawerOpen] = React.useState(false)
  const createMutation = useCreateProduct()
  const errors = createMutation.errors ?? null

  return (
    <>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button className="hidden gap-2 lg:inline-flex">
            <HugeiconsIcon icon={PlusSignIcon} size={16} />
            Tambah Produk
          </Button>
        </DialogTrigger>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl">Tambah Produk</DialogTitle>
            <DialogDescription>Produk baru langsung tersimpan setelah disimpan.</DialogDescription>
          </DialogHeader>
          <ProductCreateForm
            categories={categories}
            errors={errors}
            isPending={createMutation.isPending}
            onSubmit={(data) =>
              createMutation.mutate(data, {
                onSuccess: (result) => {
                  if (result.success) setDialogOpen(false)
                },
              })
            }
            closeButton={
              <DialogClose asChild>
                <Button type="button" variant="outline" className="w-full sm:w-auto mt-2 sm:mt-0">Batal</Button>
              </DialogClose>
            }
          />
        </DialogContent>
      </Dialog>

      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        <DrawerTrigger asChild>
          <Button className="gap-2 lg:hidden">
            <HugeiconsIcon icon={PlusSignIcon} size={16} />
            Tambah Produk
          </Button>
        </DrawerTrigger>
        <DrawerContent className="max-h-[92vh] overflow-hidden border-0">
          <DrawerHeader>
            <DrawerTitle>Tambah Produk</DrawerTitle>
            <DrawerDescription>Produk baru langsung tersimpan setelah disimpan.</DrawerDescription>
          </DrawerHeader>
          <ProductCreateForm
            categories={categories}
            stickyFooter
            errors={errors}
            isPending={createMutation.isPending}
            onSubmit={(data) =>
              createMutation.mutate(data, {
                onSuccess: (result) => {
                  if (result.success) setDrawerOpen(false)
                },
              })
            }
            closeButton={
              <DrawerClose asChild>
                <Button type="button" variant="outline" className="w-full sm:w-auto mt-2 sm:mt-0">Batal</Button>
              </DrawerClose>
            }
          />
        </DrawerContent>
      </Drawer>
    </>
  )
}

export function ProdukHeader({ categories }: ProdukHeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)

  return (
    <>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight lg:text-2xl">Manajemen Produk</h1>
          <p className="text-sm text-muted-foreground">Kelola produk, kategori, dan stok warung Anda</p>
        </div>

        <div className="hidden items-center gap-2 lg:flex">
          <ProductCreateDialog categories={categories} />
        </div>
      </div>

      <div className="lg:hidden">
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
        )}
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
          <div
            className={`flex flex-col items-end gap-3 transition-all duration-200 ${isMobileMenuOpen ? "translate-y-0 scale-100 opacity-100" : "pointer-events-none translate-y-4 scale-95 opacity-0"}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <ProductCreateDialog categories={categories} />
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`flex size-14 items-center justify-center rounded-full shadow-lg transition-all duration-200 active:scale-95 ${isMobileMenuOpen ? "border bg-card text-foreground" : "bg-primary text-primary-foreground"}`}
          >
            <HugeiconsIcon icon={PlusSignIcon} size={28} className={`transition-transform duration-200 ${isMobileMenuOpen ? "rotate-45" : ""}`} />
          </button>
        </div>
      </div>
    </>
  )
}
