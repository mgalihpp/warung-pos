import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"
import { AppSidebar } from "@/features/dashboard/components/app-sidebar"
import { DashboardHeader } from "@/features/dashboard/components/dashboard-header"
import { AdminLayoutClient } from "@/features/dashboard/components/admin-layout-client"
import { cookies } from "next/headers"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const sidebarState = cookieStore.get("sidebar_state")?.value
  const defaultOpen = sidebarState === undefined ? true : sidebarState === "true"

  return (
    <TooltipProvider>
      <SidebarProvider defaultOpen={defaultOpen}>
        <AppSidebar />
        <SidebarInset className="min-w-0">
          <AdminLayoutClient>
            <div className="hidden lg:block">
              <DashboardHeader />
            </div>
            <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden">{children}</div>
          </AdminLayoutClient>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  )
}
