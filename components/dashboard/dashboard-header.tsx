"use client"

import * as React from "react"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  SearchIcon,
  Notification03Icon,
  ArrowDown01Icon,
  Calendar01Icon,
  UserCircleIcon,
  Settings01Icon,
  Logout01Icon,
  InvoiceIcon,
  ShoppingCart01Icon,
} from "@hugeicons/core-free-icons"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Kbd } from "@/components/ui/kbd"

import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { Calendar } from "@/components/ui/calendar"
import { signOut } from "@/lib/auth-client"
import { useRouter, usePathname } from "next/navigation"

export function DashboardHeader() {
  const [openCommand, setOpenCommand] = React.useState(false)
  const [date, setDate] = React.useState<Date | undefined>(new Date())
  const router = useRouter()
  const pathname = usePathname()

  const isPosPage = pathname?.includes("/admin/pos")

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpenCommand((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const today = format(new Date(), "EEEE, dd MMMM yyyy", { locale: id })

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <SidebarTrigger className="-ml-1 md:hidden" />
      <Separator orientation="vertical" className="mr-1 h-4 md:hidden" />

      {/* Search Bar - Interactive */}
      {!isPosPage && (
        <div className="relative flex flex-1 items-center">
          <button
            onClick={() => setOpenCommand(true)}
            className="flex w-full max-w-md items-center gap-2 rounded-lg border bg-muted/40 p-1.5 px-2 sm:px-3 text-sm text-muted-foreground transition-colors hover:bg-muted/60 focus:outline-none focus:ring-1 focus:ring-ring"
          >
            <HugeiconsIcon icon={SearchIcon} size={16} className="shrink-0" />
            <span className="hidden flex-1 truncate text-left sm:block">Cari produk, transaksi, pelanggan...</span>
            <span className="flex-1 truncate text-left sm:hidden">Cari...</span>
            <Kbd className="hidden md:inline-flex">Ctrl + K</Kbd>
          </button>
        </div>
      )}

      {/* Spacer when search is hidden */}
      {isPosPage && <div className="flex-1" />}

      <CommandDialog open={openCommand} onOpenChange={setOpenCommand}>
        <Command>
          <CommandInput placeholder="Ketik pencarian..." />
          <CommandList>
            <CommandEmpty>Tidak ada hasil yang ditemukan.</CommandEmpty>
            <CommandGroup heading="Saran Pencarian">
              <CommandItem onSelect={() => { setOpenCommand(false); router.push("/admin/pos") }}>
                <HugeiconsIcon icon={ShoppingCart01Icon} size={16} className="mr-2" />
                <span>Buka Kasir</span>
              </CommandItem>
              <CommandItem onSelect={() => { setOpenCommand(false); router.push("/admin/transaksi") }}>
                <HugeiconsIcon icon={InvoiceIcon} size={16} className="mr-2" />
                <span>Lihat Transaksi Terbaru</span>
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Pengaturan">
              <CommandItem onSelect={() => { setOpenCommand(false); router.push("/admin/pengaturan") }}>
                <HugeiconsIcon icon={Settings01Icon} size={16} className="mr-2" />
                <span>Pengaturan Toko</span>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>

      {/* Date Picker via Popover */}
      <div className="flex items-center">
        <Popover>
          <PopoverTrigger asChild>
            <button className="flex items-center gap-2 rounded-lg p-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus:outline-none focus:ring-1 focus:ring-ring xl:px-2.5 xl:py-1.5">
              <HugeiconsIcon icon={Calendar01Icon} size={18} />
              <span className="hidden capitalize xl:block">{today}</span>
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <Separator orientation="vertical" className="h-4" />

      {/* Notifications via Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="relative rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted focus:outline-none focus:ring-1 focus:ring-ring">
            <HugeiconsIcon icon={Notification03Icon} size={18} />
            <span className="absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-white">
              3
            </span>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64">
          <DropdownMenuLabel>Notifikasi (3)</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem className="flex flex-col items-start gap-1 p-3">
              <div className="flex w-full items-center justify-between gap-2">
                <span className="text-xs font-semibold leading-none">Stok Beras 5kg Menipis</span>
                <span className="text-[10px] text-muted-foreground shrink-0">10m lalu</span>
              </div>
              <span className="text-[11px] text-muted-foreground line-clamp-1">Sisa 6 pcs, perlu restok segera.</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex flex-col items-start gap-1 p-3">
              <div className="flex w-full items-center justify-between gap-2">
                <span className="text-xs font-semibold leading-none">Transaksi Berhasil</span>
                <span className="text-[10px] text-muted-foreground shrink-0">45m lalu</span>
              </div>
              <span className="text-[11px] text-muted-foreground line-clamp-1">Pembayaran Rp 125.000 via QRIS.</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex flex-col items-start gap-1 p-3">
              <div className="flex w-full items-center justify-between gap-2">
                <span className="text-xs font-semibold leading-none">Gula Pasir 1kg Menipis</span>
                <span className="text-[10px] text-muted-foreground shrink-0">2j lalu</span>
              </div>
              <span className="text-[11px] text-muted-foreground line-clamp-1">Sisa 4 pcs, jangan sampai kehabisan.</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <Separator orientation="vertical" className="h-4" />

      {/* User Profile via Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2 rounded-lg px-2 py-1 transition-colors hover:bg-muted focus:outline-none focus:ring-1 focus:ring-ring">
            <Avatar className="size-8">
              <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                BW
              </AvatarFallback>
            </Avatar>
            <div className="hidden flex-col items-start xl:flex">
              <span className="text-sm font-medium leading-tight text-foreground">Budi Warung</span>
              <span className="text-[11px] text-muted-foreground">Pemilik</span>
            </div>
            <HugeiconsIcon icon={ArrowDown01Icon} size={14} className="hidden text-muted-foreground xl:block" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Akun Saya</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <HugeiconsIcon icon={UserCircleIcon} size={16} className="mr-2" />
              <span>Profil</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <HugeiconsIcon icon={Settings01Icon} size={16} className="mr-2" />
              <span>Pengaturan</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-destructive focus:bg-destructive/10 focus:text-destructive"
            onClick={async () => {
              await signOut()
              router.push("/login")
            }}
          >
            <HugeiconsIcon icon={Logout01Icon} size={16} className="mr-2" />
            <span>Keluar</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}
