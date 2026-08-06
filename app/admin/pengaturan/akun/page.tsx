import { forbidden, redirect } from "next/navigation"

import { PengaturanPenggunaContent } from "@/features/pengaturan/components/pengaturan-content"
import { prisma } from "@/lib/prisma"
import { getSessionUser } from "@/lib/server/auth-guards"

interface FetchUsersParams {
  userId?: string | null
}

async function getUsersData({ userId }: FetchUsersParams = {}) {
  const [currentUser, users] = await Promise.all([
    userId
      ? prisma.user.findUnique({
          where: { id: userId },
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

  return { currentUser, users }
}

export default async function PengaturanPenggunaPage() {
  const user = await getSessionUser()

  if (!user) {
    redirect("/login")
  }

  if (user.role !== "admin") {
    forbidden()
  }

  const { currentUser, users } = await getUsersData({ userId: user?.id })

  return <PengaturanPenggunaContent currentUser={currentUser} users={users} />
}
