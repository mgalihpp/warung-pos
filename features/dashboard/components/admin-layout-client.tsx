"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  DashboardSquare01Icon,
  PackageIcon,
  InvoiceIcon,
  ChartHistogramIcon,
  CashierIcon,
} from "@hugeicons/core-free-icons"

const navItems = [
  { href: "/admin", label: "Dashboard", icon: DashboardSquare01Icon },
  { href: "/admin/produk", label: "Produk", icon: PackageIcon },
  { href: "/admin/pos", label: "Kasir", icon: CashierIcon },
  { href: "/admin/transaksi", label: "Transaksi", icon: InvoiceIcon },
  { href: "/admin/laporan", label: "Laporan", icon: ChartHistogramIcon },
]

export function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [hidePosBottomNav, setHidePosBottomNav] = useState(false)

  useEffect(() => {
    if (pathname !== "/admin/pos") {
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
      <main className="flex flex-1 min-h-0 flex-col overflow-hidden">{children}</main>

      {!(pathname === "/admin/pos" && hidePosBottomNav) && (
        <nav className="z-40 flex h-[64px] shrink-0 items-center justify-around border-t bg-card pb-[env(safe-area-inset-bottom)] lg:hidden">
          {navItems.map((item) => {
            const isActive = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href)
            const isPrimary = item.href === "/admin/pos"

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex h-full flex-1 flex-col items-center justify-center gap-1 text-[10px] font-medium transition-colors ${
                  isPrimary ? "-mt-3" : ""
                } ${isActive ? "text-primary" : "text-muted-foreground hover:bg-muted/50"}`}
              >
                <span
                  className={`flex items-center justify-center transition-colors ${
                    isPrimary
                      ? `size-11 rounded-full border shadow-sm ${isActive ? "border-primary bg-primary text-primary-foreground ring-4 ring-primary/15" : "border-primary/20 bg-primary/10 text-primary"}`
                      : ""
                  }`}
                >
                  <HugeiconsIcon icon={item.icon} size={isPrimary ? 22 : 20} />
                </span>
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>
      )}
    </div>
  )
}
