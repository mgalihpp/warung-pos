import { PengaturanContent } from "@/components/pengaturan/pengaturan-content"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { headers } from "next/headers"

export default async function PengaturanPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  const [currentUser, users] = await Promise.all([
    session?.user.id
      ? prisma.user.findUnique({
          where: { id: session.user.id },
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            banned: true,
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

  return <PengaturanContent currentUser={currentUser} users={users} />
}
