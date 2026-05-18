"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ShoppingCart01Icon,
  Invoice01Icon,
  Logout03Icon,
  InformationCircleIcon,
  Store01Icon,
  ArrowRight01Icon,
  UserCircleIcon,
} from "@hugeicons/core-free-icons"
import { authClient } from "@/lib/auth-client"

import {
  Sheet,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet"

type MobileSidebarProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: {
    name: string
    email?: string
    image?: string | null
    role?: string
  }
}

export function CashierMobileSidebar({ open, onOpenChange, user }: MobileSidebarProps) {
  const pathname = usePathname()

  const navItems = [
    {
      href: "/cashier/pos",
      label: "Point of Sale",
      description: "Penjualan kasir",
      icon: ShoppingCart01Icon,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      href: "/cashier/transaksi",
      label: "Transaksi",
      description: "Riwayat transaksi",
      icon: Invoice01Icon,
      color: "text-chart-1",
      bg: "bg-chart-1/10",
    },
    {
      href: "/cashier/pengaturan",
      label: "Pengaturan Toko",
      description: "Info toko & keamanan",
      icon: Store01Icon,
      color: "text-chart-3",
      bg: "bg-chart-3/10",
    },
    {
      href: "#logout",
      label: "Keluar",
      description: "Akhiri sesi",
      icon: Logout03Icon,
      color: "text-destructive",
      bg: "bg-destructive/10",
      onClick: () => authClient.signOut({ fetchOptions: { onSuccess: () => { window.location.href = "/login" } } })
    }
  ]

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-[320px] p-0 flex flex-col sm:max-w-[320px] border-none shadow-2xl" showCloseButton={false}>
        <SheetTitle className="sr-only">Menu</SheetTitle>
        {/* Header Profile Section */}
        <div className="bg-primary px-5 py-6 shrink-0 rounded-br-[40px]">
          <div className="flex flex-col gap-3">
            {/* Store Card */}
            <div className="flex items-center gap-3 bg-primary-foreground/10 px-4 py-3 rounded-[16px] backdrop-blur-sm">
              <HugeiconsIcon icon={Store01Icon} size={20} className="text-primary-foreground" />
              <span className="font-bold text-[15px] text-primary-foreground">Warung Mama Nia</span>
            </div>

            {/* Profile Card */}
            <div className="flex items-start gap-3 bg-primary-foreground/10 px-4 py-3.5 rounded-[16px] backdrop-blur-sm">
              <div className="size-11 shrink-0 rounded-[12px] bg-primary-foreground/15 flex items-center justify-center">
                <HugeiconsIcon icon={UserCircleIcon} size={28} className="text-primary-foreground" />
              </div>
              <div className="flex flex-col gap-1 min-w-0 pt-0.5">
                <span className="text-[13px] font-medium text-primary-foreground truncate leading-tight">
                  {user.email || user.name}
                </span>
                <div>
                  <span className="inline-flex text-[10px] font-bold bg-primary-foreground text-primary px-2.5 py-0.5 rounded-full">
                    {user.role === "admin" ? "Manager" : "Kasir"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="flex-1 overflow-y-auto px-5 py-6 flex flex-col bg-background">
          <div className="flex items-center gap-2.5 mb-5 px-1">
            <div className="w-1.5 h-4 bg-primary rounded-full"></div>
            <span className="text-[14px] font-bold text-muted-foreground">Main Menu</span>
          </div>

          <div className="flex flex-col gap-3.5">
            {navItems.map((item) => {
              const isLogout = item.href === "#logout"
              const isActive = !isLogout && (pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/cashier/pos"))

              return (
                <Link
                  key={item.href}
                  href={isLogout ? "#" : item.href}
                  onClick={(e) => {
                    if (isLogout) {
                      e.preventDefault()
                      item.onClick?.()
                    } else {
                      onOpenChange(false)
                    }
                  }}
                  className={`flex items-center gap-4 p-4 rounded-[20px] transition-all bg-card border border-border shadow-[0_2px_10px_-4px_rgba(0,0,0,0.04)] ${isActive ? "ring-2 ring-primary/20" : "hover:border-border/80"
                    }`}
                >
                  <div className={`flex items-center justify-center size-12 rounded-[14px] shrink-0 ${item.bg} ${item.color}`}>
                    <HugeiconsIcon icon={item.icon} size={24} />
                  </div>
                  <div className="flex flex-col flex-1 min-w-0 justify-center">
                    <span className="text-[15px] font-bold text-foreground leading-tight mb-0.5">{item.label}</span>
                    <span className="text-[12px] text-muted-foreground leading-tight">{item.description}</span>
                  </div>
                  <div className="text-muted-foreground/30 shrink-0">
                    <HugeiconsIcon icon={ArrowRight01Icon} size={20} />
                  </div>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-background text-center shrink-0">
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground font-medium">
            <HugeiconsIcon icon={InformationCircleIcon} size={14} />
            <span>Warung Sembako v1.0.10 (Build 10)</span>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
