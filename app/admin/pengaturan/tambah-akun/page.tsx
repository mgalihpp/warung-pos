import { redirect } from "next/navigation"

import { TambahAkunContent } from "@/components/pengaturan/tambah-akun-content"
import { getSessionUser } from "@/lib/server/auth-guards"

export default async function TambahAkunPage() {
  const user = await getSessionUser()

  if (!user) {
    redirect("/login")
  }

  if (user.role !== "admin") {
    redirect("/unauthorized")
  }

  return <TambahAkunContent />
}
