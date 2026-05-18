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

import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"

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

export function CashierMobileSidebar({
  open,
  onOpenChange,
  user,
}: MobileSidebarProps) {
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
      onClick: () =>
        authClient.signOut({
          fetchOptions: {
            onSuccess: () => {
              window.location.href = "/login"
            },
          },
        }),
    },
  ]

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="left"
        className="flex w-[320px] flex-col border-none p-0 shadow-2xl sm:max-w-[320px]"
        showCloseButton={false}
      >
        <SheetTitle className="sr-only">Menu</SheetTitle>
        {/* Header Profile Section */}
        <div className="shrink-0 bg-primary px-5 py-6">
          <div className="flex flex-col gap-3">
            {/* Store Card */}
            <div className="flex items-center gap-3 rounded-[16px] bg-primary-foreground/10 px-4 py-3 backdrop-blur-sm">
              <HugeiconsIcon
                icon={Store01Icon}
                size={20}
                className="text-primary-foreground"
              />
              <span className="text-[15px] font-bold text-primary-foreground">
                Warung Mama Nia
              </span>
            </div>

            {/* Profile Card */}
            <div className="flex items-start gap-3 rounded-[16px] bg-primary-foreground/10 px-4 py-3.5 backdrop-blur-sm">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-[12px] bg-primary-foreground/15">
                <HugeiconsIcon
                  icon={UserCircleIcon}
                  size={28}
                  className="text-primary-foreground"
                />
              </div>
              <div className="flex min-w-0 flex-col gap-1 pt-0.5">
                <span className="truncate text-[13px] leading-tight font-medium text-primary-foreground">
                  {user.email || user.name}
                </span>
                <div>
                  <span className="inline-flex rounded-full bg-primary-foreground px-2.5 py-0.5 text-[10px] font-bold text-primary">
                    {user.role === "admin" ? "Manager" : "Kasir"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="flex flex-1 flex-col overflow-y-auto bg-background px-5 py-6">
          <div className="mb-5 flex items-center gap-2.5 px-1">
            <div className="h-4 w-1.5 rounded-full bg-primary"></div>
            <span className="text-[14px] font-bold text-muted-foreground">
              Main Menu
            </span>
          </div>

          <div className="flex flex-col gap-3.5">
            {navItems.map((item) => {
              const isLogout = item.href === "#logout"
              const isActive =
                !isLogout &&
                (pathname === item.href ||
                  (pathname.startsWith(item.href) &&
                    item.href !== "/cashier/pos"))

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
                  className={`flex items-center gap-4 rounded-[20px] border border-border bg-card p-4 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.04)] transition-all ${
                    isActive
                      ? "ring-2 ring-primary/20"
                      : "hover:border-border/80"
                  }`}
                >
                  <div
                    className={`flex size-12 shrink-0 items-center justify-center rounded-[14px] ${item.bg} ${item.color}`}
                  >
                    <HugeiconsIcon icon={item.icon} size={24} />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col justify-center">
                    <span className="mb-0.5 text-[15px] leading-tight font-bold text-foreground">
                      {item.label}
                    </span>
                    <span className="text-[12px] leading-tight text-muted-foreground">
                      {item.description}
                    </span>
                  </div>
                  <div className="shrink-0 text-muted-foreground/30">
                    <HugeiconsIcon icon={ArrowRight01Icon} size={20} />
                  </div>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="shrink-0 bg-background p-4 text-center">
          <div className="flex items-center justify-center gap-1.5 text-[11px] font-medium text-muted-foreground">
            <HugeiconsIcon icon={InformationCircleIcon} size={14} />
            <span>Warung Sembako v1.0.10 (Build 10)</span>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
