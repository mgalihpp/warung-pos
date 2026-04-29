"use client"

import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ShoppingCart01Icon,
  Invoice01Icon,
  Logout03Icon,
  Settings01Icon,
} from "@hugeicons/core-free-icons"
import { authClient, useSession } from "@/lib/auth-client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

type CashierLayoutClientProps = {
  userName: string
  children: React.ReactNode
}

const navItems = [
  { href: "/cashier/pos", label: "Kasir", icon: ShoppingCart01Icon },
  { href: "/cashier/transaksi", label: "Riwayat", icon: Invoice01Icon },
]

export function CashierLayoutClient({ userName, children }: CashierLayoutClientProps) {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [hidePosBottomNav, setHidePosBottomNav] = useState(false)

  const displayName = session?.user?.name ?? userName
  const avatarUrl = session?.user?.image ?? null

  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase()

  useEffect(() => {
    if (pathname !== "/cashier/pos") {
      return
    }

    const syncMobileTab = (event: Event) => {
      const tab = (event as CustomEvent<{ tab?: string }>).detail?.tab
      setHidePosBottomNav(tab === "keranjang")
    }

    window.addEventListener("pos-mobile-tab-change", syncMobileTab)

    return () => {
      window.removeEventListener("pos-mobile-tab-change", syncMobileTab)
    }
  }, [pathname])

  return (
    <div className="flex h-[100dvh] flex-col bg-background overflow-hidden">
      {/* Top Navigation Bar */}
      <header className="bg-card border-b px-4 py-2 shrink-0">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 overflow-hidden">
              <Image
                src="/logo warung.png"
                alt="Logo Warung Mama Nia"
                width={32}
                height={32}
                className="h-full w-full object-contain p-0.5 scale-125"
              />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-bold text-foreground leading-tight truncate">
                Warung Mama Nia
              </span>
              <span className="text-[10px] text-muted-foreground leading-tight">
                Halo, {displayName}
              </span>
            </div>
          </div>

          {/* Center: nav tabs */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                    }`}
                >
                  <HugeiconsIcon icon={item.icon} size={14} />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>

          {/* Right: User Avatar Dropdown */}
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
      </header>

      {/* Content */}
      <main
        className={`flex min-h-0 flex-1 flex-col ${pathname === "/cashier/pos" ? "overflow-hidden" : "overflow-y-auto overflow-x-hidden"}`}
      >
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      {!(pathname === "/cashier/pos" && hidePosBottomNav) && (
        <nav className="flex h-[60px] shrink-0 items-center justify-around border-t bg-card pb-[env(safe-area-inset-bottom)] md:hidden">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex h-full flex-1 flex-col items-center justify-center gap-1 text-[10px] font-medium transition-colors ${isActive ? "text-primary" : "text-muted-foreground hover:bg-muted/50"
                  }`}
              >
                <HugeiconsIcon icon={item.icon} size={20} />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>
      )}
    </div>
  )
}
