"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ShoppingCart01Icon,
  Invoice01Icon,
  Logout03Icon,
  Store01Icon,
} from "@hugeicons/core-free-icons"
import { authClient } from "@/lib/auth-client"

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

  return (
    <div className="flex h-svh flex-col bg-background overflow-hidden">
      {/* Top Navigation Bar */}
      <header className="bg-card border-b px-4 py-2 shrink-0">
        <div className="flex items-center justify-between gap-3">
          {/* Left: brand */}
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <HugeiconsIcon icon={Store01Icon} size={16} />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-bold text-foreground leading-tight truncate">
                Warung Sembako
              </span>
              <span className="text-[10px] text-muted-foreground leading-tight">
                Halo, {userName}
              </span>
            </div>
          </div>

          {/* Center: nav tabs */}
          <nav className="flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  }`}
                >
                  <HugeiconsIcon icon={item.icon} size={14} />
                  <span className="hidden sm:inline">{item.label}</span>
                </Link>
              )
            })}
          </nav>

          {/* Right: logout */}
          <button
            onClick={() => authClient.signOut({ fetchOptions: { onSuccess: () => window.location.href = "/login" } })}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
          >
            <HugeiconsIcon icon={Logout03Icon} size={14} />
            <span className="hidden sm:inline">Keluar</span>
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-hidden">{children}</main>
    </div>
  )
}
