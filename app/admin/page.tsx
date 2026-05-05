import { redirect } from "next/navigation"

import { AdminDashboardContent } from "@/features/dashboard/components/admin-dashboard-content"
import { getDashboardData } from "@/features/dashboard/server-data"
import { getSessionUser } from "@/lib/server/auth-guards"

export default async function AdminDashboardPage() {
  const user = await getSessionUser()

  if (!user) {
    redirect("/login")
  }

  if (user.role !== "admin") {
    redirect("/unauthorized")
  }

  const data = await getDashboardData("7d")

  return <AdminDashboardContent initialData={data} />
}
