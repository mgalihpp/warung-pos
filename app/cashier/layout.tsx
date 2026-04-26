import { redirect } from "next/navigation"

import { getSessionUser } from "@/lib/server/auth-guards"
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

  if (user.role !== "cashier" && user.role !== "admin") {
    redirect("/unauthorized")
  }

  return (
    <CashierLayoutClient userName={user.name}>
      {children}
    </CashierLayoutClient>
  )
}
