import { Suspense } from "react"
import { redirect } from "next/navigation"

import { PengaturanContent } from "@/features/pengaturan/components/pengaturan-content"
import { prisma } from "@/lib/prisma"
import { getSessionUser } from "@/lib/server/auth-guards"

export default async function CashierPengaturanPage() {
  const user = await getSessionUser()

  if (!user) {
    redirect("/login")
  }

  if (user.role !== "cashier" && user.role !== "admin") {
    redirect("/unauthorized")
  }

  const currentUser = user.id
    ? await prisma.user.findUnique({
        where: { id: user.id },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          banned: true,
          image: true,
        },
      })
    : null

  return (
    <Suspense>
      <PengaturanContent
        currentUser={currentUser}
        basePath="/cashier/pengaturan"
      />
    </Suspense>
  )
}
