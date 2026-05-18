import { redirect } from "next/navigation"

import { PengaturanPenggunaContent } from "@/features/pengaturan/components/pengaturan-content"
import { prisma } from "@/lib/prisma"
import { getSessionUser } from "@/lib/server/auth-guards"

export default async function PengaturanPenggunaPage() {
  const user = await getSessionUser()

  if (!user) {
    redirect("/login")
  }

  if (user.role !== "admin") {
    redirect("/unauthorized")
  }

  const [currentUser, users] = await Promise.all([
    user.id
      ? prisma.user.findUnique({
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
      : null,
    prisma.user.findMany({
      orderBy: { createdAt: "asc" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        banned: true,
      },
    }),
  ])

  return <PengaturanPenggunaContent currentUser={currentUser} users={users} />
}
