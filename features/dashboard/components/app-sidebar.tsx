"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  DashboardSquare01Icon,
  PackageIcon,
  InvoiceIcon,
  ChartHistogramIcon,
  Settings01Icon,
  CashierIcon,
} from "@hugeicons/core-free-icons"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const menuItems = [
  { title: "Dashboard", href: "/admin", icon: DashboardSquare01Icon },
  { title: "Kasir", href: "/admin/pos", icon: CashierIcon },
  { title: "Produk", href: "/admin/produk", icon: PackageIcon },
  { title: "Transaksi", href: "/admin/transaksi", icon: InvoiceIcon },
  { title: "Laporan", href: "/admin/laporan", icon: ChartHistogramIcon },
  { title: "Pengaturan", href: "/admin/pengaturan", icon: Settings01Icon },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar collapsible="icon" className="border-r-0">
      <SidebarHeader className="h-14 px-4 flex items-center border-b">
        <Link href="/admin" className="flex items-center gap-2.5 group-data-[collapsible=icon]:justify-center">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 overflow-hidden">
            <Image
              src="/logo warung.png"
              alt="Logo Warung Mama Nia"
              width={36}
              height={36}
              className="h-full w-full object-contain p-0.5 scale-125"
            />
          </div>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-bold leading-tight">Warung Mama Nia</span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const isActive = item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href)

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.title}
                      className={
                        isActive
                          ? "data-[active=true]:bg-primary data-[active=true]:text-primary-foreground data-[active=true]:hover:bg-primary/90 data-[active=true]:hover:text-primary-foreground"
                          : ""
                      }
                    >
                      <Link href={item.href}>
                        <HugeiconsIcon icon={item.icon} size={18} strokeWidth={isActive ? 2.5 : 2} />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

      </SidebarContent>
    </Sidebar>
  )
}
