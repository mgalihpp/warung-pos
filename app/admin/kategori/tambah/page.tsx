import { forbidden, redirect } from "next/navigation"

import { KategoriFormPage } from "@/features/kategori/components/kategori-form-page"
import { getSessionUser } from "@/lib/server/auth-guards"

export default async function TambahKategoriPage() {
  const user = await getSessionUser()

  if (!user) {
    redirect("/login")
  }

  if (user.role !== "admin") {
    forbidden()
  }

  return <KategoriFormPage mode="create" />
}
