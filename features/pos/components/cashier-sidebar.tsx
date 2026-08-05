"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowDown01Icon,
  ShoppingCart01Icon,
  InvoiceIcon,
  Settings01Icon,
  Logout01Icon,
} from "@hugeicons/core-free-icons"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import { signOut, useSession } from "@/lib/auth-client"

const subscribeToHydration = () => () => {}
const getHydratedSnapshot = () => true
const getServerSnapshot = () => false

const menuItems = [
  { title: "Kasir", href: "/cashier/pos", icon: ShoppingCart01Icon },
  { title: "Transaksi", href: "/cashier/transaksi", icon: InvoiceIcon },
  { title: "Pengaturan", href: "/cashier/pengaturan", icon: Settings01Icon },
]

export function CashierSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const isHydrated = React.useSyncExternalStore(
    subscribeToHydration,
    getHydratedSnapshot,
    getServerSnapshot
  )
  const { data: session } = useSession()

  const user = isHydrated ? session?.user : undefined
  const isUserLoading = !isHydrated || !user
  const userName = user?.name ?? ""
  const userInitials = (userName || "?")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("")

  return (
    <Sidebar collapsible="icon" className="border-r-0">
      <SidebarHeader className="flex h-14 items-center border-b px-4">
        <Link
          href="/cashier/pos"
          className="flex items-center gap-2.5 group-data-[collapsible=icon]:justify-center"
        >
          <div className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-primary/10">
            <Image
              src="/logo warung.png"
              alt="Logo Warung Mama Nia"
              width={36}
              height={36}
              className="h-full w-full scale-125 object-contain p-0.5"
            />
          </div>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="text-sm leading-tight font-bold">
              Warung Mama Nia
            </span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const isActive = pathname.startsWith(item.href)

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
                        <HugeiconsIcon
                          icon={item.icon}
                          size={18}
                          strokeWidth={isActive ? 2.5 : 2}
                        />
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

      <SidebarFooter className="border-t p-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left transition-colors group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus:ring-1 focus:ring-sidebar-ring focus:outline-none"
            >
              {isUserLoading ? (
                <Skeleton className="size-9 shrink-0 rounded-full" />
              ) : (
                <Avatar className="size-9">
                  {user?.image && (
                    <AvatarImage src={user.image} alt={userName} />
                  )}
                  <AvatarFallback className="bg-primary/10 text-xs font-bold text-primary">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
              )}
              <div className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
                {isUserLoading ? (
                  <>
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="mt-1 h-3 w-10" />
                  </>
                ) : (
                  <>
                    <p className="truncate text-sm leading-tight font-semibold">
                      {userName}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      Kasir
                    </p>
                  </>
                )}
              </div>
              <HugeiconsIcon
                icon={ArrowDown01Icon}
                size={14}
                className="text-muted-foreground group-data-[collapsible=icon]:hidden"
              />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="right" align="end" className="w-56">
            <DropdownMenuLabel>Akun Saya</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link href="/cashier/pengaturan">
                  <HugeiconsIcon
                    icon={Settings01Icon}
                    size={16}
                    className="mr-2"
                  />
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
      </SidebarFooter>
    </Sidebar>
  )
}
