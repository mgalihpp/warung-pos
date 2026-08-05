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
  const defaultOpen =
    sidebarState === undefined ? true : sidebarState === "true"

  return (
    <TooltipProvider>
      <SidebarProvider defaultOpen={defaultOpen}>
        <AppSidebar />
        <SidebarInset className="min-w-0 max-lg:h-[100dvh] max-lg:overflow-hidden">
          <AdminLayoutClient>
            <div className="hidden lg:block">
              <DashboardHeader />
            </div>
            <div className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto">
              {children}
            </div>
          </AdminLayoutClient>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  )
}
