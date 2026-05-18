"use client"

import * as React from "react"
import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowDown01Icon, PlusSignIcon, Tick02Icon } from "@hugeicons/core-free-icons"

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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import type { BarangCategory } from "../types"

export function CategoryCombobox({
  categories,
  defaultValue = "",
  onValueChange,
}: {
  categories: BarangCategory[]
  defaultValue?: string
  onValueChange?: (value: string) => void
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
                        onValueChange?.(category.name)
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
                      onValueChange?.(suggestedNewCategory)
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
    </div>
  )
}

export function UnitCombobox({
  units,
  defaultValue = "",
  onValueChange,
}: {
  units: string[]
  defaultValue?: string
  onValueChange?: (value: string) => void
}) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState(defaultValue)
  const [search, setSearch] = React.useState("")
  const normalizedSearch = search.trim().toLowerCase()
  const filteredUnits = units.filter((unit) => unit.toLowerCase().includes(normalizedSearch))
  const hasExactMatch = units.some((unit) => unit.toLowerCase() === normalizedSearch)
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
              <CommandGroup heading="Satuan Tersimpan">
                {filteredUnits.map((unit) => (
                  <CommandItem
                    key={unit}
                    value={unit}
                    onSelect={() => {
                      setValue(unit)
                      onValueChange?.(unit)
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
                      onValueChange?.(suggestedUnit)
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

function ProductCreateDialog() {
  return (
    <>
      <Button asChild className="hidden gap-2 lg:inline-flex">
        <Link href="/admin/barang/tambah">
          <HugeiconsIcon icon={PlusSignIcon} size={16} />
          Tambah Barang
        </Link>
      </Button>

      <Button asChild className="gap-2 lg:hidden">
        <Link href="/admin/barang/tambah">
          <HugeiconsIcon icon={PlusSignIcon} size={16} />
          Tambah Barang
        </Link>
      </Button>
    </>
  )
}

export function BarangHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)

  return (
    <>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight lg:text-2xl">Manajemen Barang</h1>
          <p className="text-sm text-muted-foreground">Kelola barang, kategori, dan stok warung Anda</p>
        </div>

        <div className="hidden items-center gap-2 lg:flex">
          <ProductCreateDialog />
        </div>
      </div>

      <div className="lg:hidden">
        {isMobileMenuOpen && (
          <div className="pointer-events-none fixed inset-0 z-30 bg-background/60 backdrop-blur-[2px]" />
        )}
        <div className="pointer-events-none fixed right-4 bottom-[calc(5rem+env(safe-area-inset-bottom))] z-40 flex flex-col items-end gap-3 sm:right-6">
          <div
            className={`flex flex-col items-end gap-3 transition-all duration-200 ${isMobileMenuOpen ? "pointer-events-auto translate-y-0 scale-100 opacity-100" : "pointer-events-none translate-y-4 scale-95 opacity-0"}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <ProductCreateDialog />
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`pointer-events-auto flex size-14 items-center justify-center rounded-full shadow-lg transition-all duration-200 active:scale-95 ${isMobileMenuOpen ? "border bg-card text-foreground" : "bg-primary text-primary-foreground"}`}
          >
            <HugeiconsIcon icon={PlusSignIcon} size={28} className={`transition-transform duration-200 ${isMobileMenuOpen ? "rotate-45" : ""}`} />
          </button>
        </div>
      </div>
    </>
  )
}
