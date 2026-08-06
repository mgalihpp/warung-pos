import { Suspense } from "react"
import { PengaturanContent } from "@/features/pengaturan/components/pengaturan-content"
import { prisma } from "@/lib/prisma"
import { forbidden, redirect } from "next/navigation"

import { getSessionUser } from "@/lib/server/auth-guards"

export default async function PengaturanPage() {
  const user = await getSessionUser()

  if (!user) {
    redirect("/login")
  }

  if (user.role !== "admin") {
    forbidden()
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
      <PengaturanContent currentUser={currentUser} />
    </Suspense>
  )
}
