import { forbidden, redirect } from "next/navigation"

import { PengaturanTemaContent } from "@/features/pengaturan/components/pengaturan-content"
import { getSessionUser } from "@/lib/server/auth-guards"

export default async function PengaturanTemaPage() {
  const user = await getSessionUser()

  if (!user) {
    redirect("/login")
  }

  if (user.role !== "admin") {
    forbidden()
  }

  return <PengaturanTemaContent />
}
