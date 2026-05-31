import { redirect } from "next/navigation"

import { getBarangPageData } from "@/features/barang/server-data"
import { getSessionUser } from "@/lib/server/auth-guards"

import { TambahBarangPageClient } from "./page-client"

export default async function TambahBarangPage() {
  const user = await getSessionUser()

  if (!user) {
    redirect("/login")
  }

  if (user.role !== "admin") {
    redirect("/unauthorized")
  }

  const data = await getBarangPageData()

  return <TambahBarangPageClient initialData={data} />
}
