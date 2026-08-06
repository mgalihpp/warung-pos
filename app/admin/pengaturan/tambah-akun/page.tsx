import { forbidden, redirect } from "next/navigation"

import { TambahAkunContent } from "@/features/pengaturan/components/tambah-akun-content"
import { getSessionUser } from "@/lib/server/auth-guards"

export default async function TambahAkunPage() {
  const user = await getSessionUser()

  if (!user) {
    redirect("/login")
  }

  if (user.role !== "admin") {
    forbidden()
  }

  return <TambahAkunContent />
}
