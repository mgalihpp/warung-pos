import { forbidden, redirect } from "next/navigation"
import { cookies } from "next/headers"

import { getSessionUser } from "@/lib/server/auth-guards"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"
import { CashierSidebar } from "@/features/pos/components/cashier-sidebar"
import { CashierLayoutClient } from "@/features/pos/components/cashier-layout-client"

export default async function CashierLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getSessionUser()

  if (!user) {
    redirect("/login")
  }

  if (user.role !== "cashier") {
    forbidden()
  }

  const cookieStore = await cookies()
  const sidebarState = cookieStore.get("sidebar_state")?.value
  const defaultOpen =
    sidebarState === undefined ? true : sidebarState === "true"

  return (
    <TooltipProvider>
      <SidebarProvider defaultOpen={defaultOpen}>
        <CashierSidebar />
        <SidebarInset className="min-w-0 max-lg:h-[100dvh] max-lg:overflow-hidden">
          <CashierLayoutClient userName={user.name}>
            {children}
          </CashierLayoutClient>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  )
}
