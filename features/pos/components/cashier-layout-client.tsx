"use client"

import Link from "next/link"
import { useEffect, useState, useSyncExternalStore } from "react"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { usePathname, useRouter } from "next/navigation"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowLeft01Icon,
  ShoppingCart01Icon,
  Invoice01Icon,
  Logout03Icon,
  Settings01Icon,
  Menu01Icon,
  Store01Icon,
} from "@hugeicons/core-free-icons"
import { authClient, useSession } from "@/lib/auth-client"
import { CashierMobileSidebar } from "./cashier-mobile-sidebar"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SidebarTrigger } from "@/components/ui/sidebar"

type CashierLayoutClientProps = {
  userName: string
  children: React.ReactNode
}

type PosMobileTab = "barang" | "keranjang" | "pembayaran"

type MobileHeaderConfig = {
  title: string
  icon?: typeof ShoppingCart01Icon
}

const posMobileTabs = ["barang", "keranjang", "pembayaran"] as const

function getPosMobileTabSnapshot(): PosMobileTab {
  const tab = document.body.dataset.posMobileTab

  return posMobileTabs.includes(tab as PosMobileTab) ? (tab as PosMobileTab) : "barang"
}

function subscribePosMobileTab(onStoreChange: () => void) {
  window.addEventListener("pos-mobile-tab-change", onStoreChange)

  return () => window.removeEventListener("pos-mobile-tab-change", onStoreChange)
}

function getTransaksiDetailSnapshot(): boolean {
  return document.body.dataset.transaksiDetail === "true"
}

function subscribeTransaksiDetail(onStoreChange: () => void) {
  window.addEventListener("transaksi-detail-change", onStoreChange)

  return () => window.removeEventListener("transaksi-detail-change", onStoreChange)
}

function getPengaturanDetailSnapshot(): string | null {
  return document.body.dataset.pengaturanDetailTitle ?? null
}

function subscribePengaturanDetail(onStoreChange: () => void) {
  window.addEventListener("pengaturan-detail-change", onStoreChange)

  return () => window.removeEventListener("pengaturan-detail-change", onStoreChange)
}

export function CashierLayoutClient({ userName, children }: CashierLayoutClientProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { data: session } = useSession()
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const posMobileTab = useSyncExternalStore<PosMobileTab>(
    subscribePosMobileTab,
    getPosMobileTabSnapshot,
    () => "barang"
  )
  const isTransaksiDetail = useSyncExternalStore(
    subscribeTransaksiDetail,
    getTransaksiDetailSnapshot,
    () => false
  )
  const pengaturanDetailTitle = useSyncExternalStore(
    subscribePengaturanDetail,
    getPengaturanDetailSnapshot,
    () => null
  )

  const displayName = session?.user?.name ?? userName
  const avatarUrl = session?.user?.image ?? null

  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase()

  const posMobileHeaders: Record<PosMobileTab, MobileHeaderConfig> = {
    barang: { title: "Warung Mama Nia", icon: Store01Icon },
    keranjang: { title: "Checkout", icon: ShoppingCart01Icon },
    pembayaran: { title: "Pembayaran", icon: Invoice01Icon },
  }

  const posMobileHeader = posMobileHeaders[posMobileTab]

  const isTransaksiPage = pathname.startsWith("/cashier/transaksi")
  const isTransaksiDetailPage = /^\/cashier\/transaksi\/[^/]+$/.test(pathname)
  const isPengaturanPage = pathname.startsWith("/cashier/pengaturan")

  const mobileHeader = isTransaksiPage
    ? isTransaksiDetailPage || isTransaksiDetail
      ? { title: "Detail Transaksi" }
      : { title: "Transaksi" }
    : isPengaturanPage
      ? { title: pengaturanDetailTitle ?? "Pengaturan" }
      : posMobileHeader

  const isPosSubStep = pathname === "/cashier/pos" && posMobileTab !== "barang"
  const isPengaturanDetail = isPengaturanPage && !!pengaturanDetailTitle
  const showBackArrow = isPosSubStep || isTransaksiDetailPage || (isTransaksiPage && isTransaksiDetail) || isPengaturanDetail

  const handleMobileHeaderAction = () => {
    if (isPengaturanDetail) {
      window.dispatchEvent(new Event("pengaturan-detail-back"))
      return
    }

    if (isTransaksiPage && isTransaksiDetail) {
      window.dispatchEvent(new Event("transaksi-detail-back"))
      return
    }

    if (isTransaksiDetailPage) {
      router.push("/cashier/transaksi")
      return
    }

    if (isPosSubStep) {
      window.dispatchEvent(new CustomEvent("pos-mobile-tab-request", {
        detail: { tab: posMobileTab === "pembayaran" ? "keranjang" : "barang" },
      }))
      return
    }

    setIsMobileSidebarOpen(true)
  }

  return (
    <div className="flex h-[100dvh] flex-col bg-background overflow-hidden">
      {/* Mobile Header - matches the design screenshot */}
      <header className="bg-primary px-4 py-3 shrink-0 lg:hidden">
        <div className="flex items-center justify-between">
          <button
            onClick={handleMobileHeaderAction}
            className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary-foreground/10 text-primary-foreground transition-colors hover:bg-primary-foreground/15"
          >
            <HugeiconsIcon icon={showBackArrow ? ArrowLeft01Icon : Menu01Icon} size={20} />
          </button>
          <div className="flex items-center gap-2">
            {mobileHeader.icon ? (
              <HugeiconsIcon
                icon={mobileHeader.icon}
                size={20}
                className="text-primary-foreground"
              />
            ) : null}
            <span className="text-base font-bold text-primary-foreground">
              {mobileHeader.title}
            </span>
          </div>
          <div className="w-8" />
        </div>
      </header>

      {/* Desktop Header */}
      <header className="hidden lg:block bg-card border-b px-4 py-2 shrink-0">
        <div className="flex items-center justify-between gap-3">
          <SidebarTrigger className="-ml-1" />

          <div className="flex items-center gap-2">
            <div className="rounded-lg px-2.5 py-1.5 text-sm text-muted-foreground">
              <ClockLabel />
            </div>

            {/* User Avatar Dropdown */}
            <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 rounded-lg px-2 py-1 transition-colors hover:bg-muted focus:outline-none focus:ring-1 focus:ring-ring">
                <Avatar className="size-8">
                  {avatarUrl ? (
                    <AvatarImage src={avatarUrl} alt={displayName} />
                  ) : null}
                  <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                    {initials || "K"}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden flex-col items-start xl:flex">
                  <span className="text-sm font-medium leading-tight text-foreground truncate max-w-[100px]">{displayName}</span>
                  <span className="text-[11px] text-muted-foreground">Kasir</span>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Akun Saya</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/cashier/pengaturan">
                  <HugeiconsIcon icon={Settings01Icon} size={16} className="mr-2" />
                  <span>Pengaturan</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                className="cursor-pointer"
                onClick={() => authClient.signOut({ fetchOptions: { onSuccess: () => { window.location.href = "/login" } } })}
              >
                <HugeiconsIcon icon={Logout03Icon} size={16} className="mr-2" />
                <span>Keluar</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Content */}
      <main
        className={`flex min-h-0 flex-1 flex-col ${pathname === "/cashier/pos" ? "overflow-hidden" : "overflow-y-auto overflow-x-hidden"}`}
      >
        {children}
      </main>

      <CashierMobileSidebar
        open={isMobileSidebarOpen}
        onOpenChange={setIsMobileSidebarOpen}
        user={{
          name: displayName,
          email: session?.user?.email ?? undefined,
          image: avatarUrl,
          role: session?.user?.role ?? "cashier",
        }}
      />
    </div>
  )
}

function ClockLabel() {
  const [now, setNow] = useState<Date | null>(null)

  useEffect(() => {
    const timeout = window.setTimeout(() => setNow(new Date()), 0)
    const interval = window.setInterval(() => setNow(new Date()), 1_000)

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

  return (
    <span className="hidden capitalize tabular-nums xl:block">
      {today} - {time}
    </span>
  )
}
