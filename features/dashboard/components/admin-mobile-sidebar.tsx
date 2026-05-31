"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowRight01Icon,
  CashierIcon,
  ChartHistogramIcon,
  DashboardSquare01Icon,
  InformationCircleIcon,
  InvoiceIcon,
  Logout03Icon,
  PackageIcon,
  Settings01Icon,
  Store01Icon,
  TagsIcon,
  UserCircleIcon,
} from "@hugeicons/core-free-icons"

import { authClient } from "@/lib/auth-client"
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"

type AdminMobileSidebarProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: {
    name: string
    email?: string
    role?: string
  }
}

const navItems = [
  {
    href: "/admin",
    label: "Dashboard",
    description: "Ringkasan toko",
    icon: DashboardSquare01Icon,
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    href: "/admin/pos",
    label: "Point of Sale",
    description: "Penjualan kasir",
    icon: CashierIcon,
    color: "text-chart-1",
    bg: "bg-chart-1/10",
  },
  {
    href: "/admin/barang",
    label: "Barang",
    description: "Kelola stok barang",
    icon: PackageIcon,
    color: "text-chart-1",
    bg: "bg-chart-1/10",
  },
  {
    href: "/admin/kategori",
    label: "Kategori",
    description: "Kelola kategori barang",
    icon: TagsIcon,
    color: "text-chart-3",
    bg: "bg-chart-3/10",
  },
  {
    href: "/admin/transaksi",
    label: "Transaksi",
    description: "Riwayat penjualan",
    icon: InvoiceIcon,
    color: "text-chart-1",
    bg: "bg-chart-1/10",
  },
  {
    href: "/admin/laporan",
    label: "Laporan",
    description: "Analisis penjualan",
    icon: ChartHistogramIcon,
    color: "text-chart-3",
    bg: "bg-chart-3/10",
  },
  {
    href: "/admin/pengaturan",
    label: "Pengaturan Toko",
    description: "Akun, akses, tema",
    icon: Settings01Icon,
    color: "text-chart-3",
    bg: "bg-chart-3/10",
  },
]

export function AdminMobileSidebar({
  open,
  onOpenChange,
  user,
}: AdminMobileSidebarProps) {
  const pathname = usePathname()

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="left"
        className="flex w-[320px] flex-col border-none p-0 shadow-2xl sm:max-w-[320px]"
        showCloseButton={false}
      >
        <SheetTitle className="sr-only">Menu Admin</SheetTitle>

        <div className="shrink-0 bg-primary px-5 py-6">
          <div className="flex flex-col gap-3">
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
                    {user.role === "cashier" ? "Kasir" : "Admin"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-1 flex-col overflow-y-auto bg-background px-5 py-6">
          <div className="mb-5 flex items-center gap-2.5 px-1">
            <div className="h-4 w-1.5 rounded-full bg-primary" />
            <span className="text-[14px] font-bold text-muted-foreground">
              Menu Utama
            </span>
          </div>

          <div className="flex flex-col gap-3.5">
            {navItems.map((item) => {
              const isActive =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href)

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => onOpenChange(false)}
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

            <button
              type="button"
              onClick={() =>
                authClient.signOut({
                  fetchOptions: {
                    onSuccess: () => {
                      window.location.href = "/login"
                    },
                  },
                })
              }
              className="flex items-center gap-4 rounded-[20px] border border-border bg-card p-4 text-left shadow-[0_2px_10px_-4px_rgba(0,0,0,0.04)] transition-all hover:border-border/80"
            >
              <div className="flex size-12 shrink-0 items-center justify-center rounded-[14px] bg-destructive/10 text-destructive">
                <HugeiconsIcon icon={Logout03Icon} size={24} />
              </div>
              <div className="flex min-w-0 flex-1 flex-col justify-center">
                <span className="mb-0.5 text-[15px] leading-tight font-bold text-destructive">
                  Keluar
                </span>
                <span className="text-[12px] leading-tight text-muted-foreground">
                  Akhiri sesi
                </span>
              </div>
              <div className="shrink-0 text-muted-foreground/30">
                <HugeiconsIcon icon={ArrowRight01Icon} size={20} />
              </div>
            </button>
          </div>
        </div>

        <div className="shrink-0 bg-background p-4 text-center">
          <div className="flex items-center justify-center gap-1.5 text-[11px] font-medium text-muted-foreground">
            <HugeiconsIcon icon={InformationCircleIcon} size={14} />
            <span>Versi 1.0.0</span>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
