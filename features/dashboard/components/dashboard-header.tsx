"use client"

import * as React from "react"
import Image from "next/image"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  SearchIcon,
  Notification03Icon,
  ArrowDown01Icon,
  Settings01Icon,
  Logout01Icon,
  InvoiceIcon,
  ShoppingCart01Icon,
} from "@hugeicons/core-free-icons"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Kbd } from "@/components/ui/kbd"
import { Skeleton } from "@/components/ui/skeleton"

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

import { signOut, useSession } from "@/lib/auth-client"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"

type NotificationItem = {
  id: string
  title: string
  description: string
  image?: string | null
  time: string
  href: string
}

const subscribeToHydration = () => () => {}
const getHydratedSnapshot = () => true
const getServerSnapshot = () => false

export function DashboardHeader() {
  const [openCommand, setOpenCommand] = React.useState(false)
  const [notifications, setNotifications] = React.useState<NotificationItem[]>([])
  const [isLoadingNotifications, setIsLoadingNotifications] = React.useState(true)
  const isHydrated = React.useSyncExternalStore(
    subscribeToHydration,
    getHydratedSnapshot,
    getServerSnapshot,
  )
  const router = useRouter()
  const pathname = usePathname()
  const { data: session } = useSession()

  const user = isHydrated ? session?.user : undefined
  const isUserLoading = !isHydrated || !user
  const userName = user?.name ?? ""
  const userRole = user?.role === "admin" ? "Admin" : user?.role === "cashier" ? "Kasir" : ""
  const userInitials = (userName || "?")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p: string) => p[0]?.toUpperCase())
    .join("")

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

  React.useEffect(() => {
    // no-op: header shouldn't re-render every second
  }, [])

  React.useEffect(() => {
    const controller = new AbortController()

    async function loadNotifications() {
      try {
        const response = await fetch("/api/notifikasi", {
          signal: controller.signal,
          cache: "no-store",
        })

        if (!response.ok) {
          setNotifications([])
          return
        }

        const data = (await response.json()) as { items?: NotificationItem[] }
        setNotifications(data.items ?? [])
      } catch {
        if (!controller.signal.aborted) {
          setNotifications([])
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoadingNotifications(false)
        }
      }
    }

    loadNotifications()
    return () => controller.abort()
  }, [])

  const notificationCount = notifications.length

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <SidebarTrigger className="-ml-1 hidden lg:flex" />
      <Separator orientation="vertical" className="mr-1 hidden h-4 lg:block" />

      {/* Search Bar - Interactive */}
      {!isPosPage && (
        <div className="relative flex flex-1 items-center">
          <button
            onClick={() => setOpenCommand(true)}
            className="flex w-full max-w-md items-center gap-2 rounded-lg border bg-muted/40 p-1.5 px-2 sm:px-3 text-sm text-muted-foreground transition-colors hover:bg-muted/60 focus:outline-none focus:ring-1 focus:ring-ring"
          >
            <HugeiconsIcon icon={SearchIcon} size={16} className="shrink-0" />
            <span className="hidden flex-1 truncate text-left sm:block">Cari barang, transaksi, pelanggan...</span>
            <span className="flex-1 truncate text-left sm:hidden">Cari...</span>
            <Kbd className="hidden md:inline-flex">Ctrl + K</Kbd>
          </button>
        </div>
      )}

      {/* POS brand when search is hidden */}
      {isPosPage && (
        <>
          <div className="flex min-w-0 flex-1 items-center gap-2.5 lg:hidden">
            <div className="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-primary/10">
              <Image
                src="/logo warung.png"
                alt="Logo Warung Mama Nia"
                width={32}
                height={32}
                className="h-full w-full scale-125 object-contain p-0.5"
                priority
              />
            </div>
            <div className="min-w-0 leading-tight">
              <p className="truncate text-sm font-semibold text-foreground">Warung Mama Nia</p>
              <p className="hidden text-[11px] text-muted-foreground sm:block">Mode Admin</p>
            </div>
          </div>
          <div className="hidden flex-1 lg:block" />
        </>
      )}

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

      <div className="flex items-center rounded-lg px-2.5 py-1.5 text-sm text-muted-foreground">
        <ClockLabel />
      </div>

      <Separator orientation="vertical" className="h-4" />

      {/* Notifications via Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="relative overflow-hidden rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted focus:outline-none focus:ring-1 focus:ring-ring">
            <HugeiconsIcon icon={Notification03Icon} size={18} />
            {notificationCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 z-10 flex size-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-white">
                {notificationCount}
              </span>
            )}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64">
          <DropdownMenuLabel>Notifikasi ({notificationCount})</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            {isLoadingNotifications && (
              <DropdownMenuItem disabled className="p-3 text-xs text-muted-foreground">
                Memuat notifikasi...
              </DropdownMenuItem>
            )}
            {!isLoadingNotifications && notificationCount === 0 && (
              <DropdownMenuItem disabled className="p-3 text-xs text-muted-foreground">
                Belum ada notifikasi.
              </DropdownMenuItem>
            )}
            {!isLoadingNotifications && notifications.map((notification) => (
              <DropdownMenuItem key={notification.id} asChild>
                <Link href={notification.href} className="flex items-start gap-2.5 p-3">
                  <div className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border bg-muted text-xs font-semibold text-muted-foreground">
                    {notification.image ? (
                      <Image
                        src={notification.image}
                        alt={notification.title}
                        fill
                        sizes="40px"
                        className="object-cover"
                      />
                    ) : (
                      notification.title.slice(0, 2).toUpperCase()
                    )}
                  </div>
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex w-full items-center justify-between gap-2">
                      <span className="truncate text-xs font-semibold leading-none">{notification.title}</span>
                      <span className="shrink-0 text-[10px] text-muted-foreground">{notification.time}</span>
                    </div>
                    <span className="line-clamp-2 text-[11px] leading-snug text-muted-foreground">{notification.description}</span>
                  </div>
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <Separator orientation="vertical" className="h-4" />

      {/* User Profile via Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2 rounded-lg px-2 py-1 transition-colors hover:bg-muted focus:outline-none focus:ring-1 focus:ring-ring">
            {isUserLoading ? (
              <Skeleton className="size-8 shrink-0 rounded-full" />
            ) : (
              <Avatar className="size-8">
                {user?.image && (
                  <AvatarImage src={user.image} alt={userName} />
                )}
                <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
            )}
            <div className="hidden flex-col items-start xl:flex">
              {isUserLoading ? (
                <>
                  <Skeleton className="h-4 w-10" />
                  <Skeleton className="mt-1 h-3 w-8" />
                </>
              ) : (
                <>
                  <span className="text-sm font-medium leading-tight text-foreground">{userName}</span>
                  <span className="text-[11px] text-muted-foreground">{userRole}</span>
                </>
              )}
            </div>
            <HugeiconsIcon icon={ArrowDown01Icon} size={14} className="hidden text-muted-foreground xl:block" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Akun Saya</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <Link href="/admin/pengaturan">
                <HugeiconsIcon icon={Settings01Icon} size={16} className="mr-2" />
                <span>Pengaturan</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            className="cursor-pointer"
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

const ClockLabel = React.memo(function ClockLabel() {
  const [now, setNow] = React.useState<Date | null>(null)

  React.useEffect(() => {
    const timeout = window.setTimeout(() => setNow(new Date()), 0)
    const interval = window.setInterval(() => {
      setNow(new Date())
    }, 1_000)

    return () => {
      window.clearTimeout(timeout)
      window.clearInterval(interval)
    }
  }, [])

  if (!now) {
    return <span className="hidden tabular-nums xl:block">--:--:--</span>
  }

  const today = format(now, "EEEE, dd MMMM yyyy", { locale: id })
  const time = format(now, "HH:mm:ss")

  return <span className="hidden capitalize tabular-nums xl:block">{today} - {time}</span>
})
