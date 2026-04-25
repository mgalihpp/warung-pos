import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { auth } from "@/lib/auth"
import { CashierLayoutClient } from "@/components/pos/cashier-layout-client"

export default async function CashierLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user) {
    redirect("/login")
  }

  if (session.user.role !== "cashier" && session.user.role !== "admin") {
    redirect("/unauthorized")
  }

  return (
    <CashierLayoutClient userName={session.user.name}>
      {children}
    </CashierLayoutClient>
  )
}
