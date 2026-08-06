import { forbidden, redirect } from "next/navigation"

import { getKategoriPageData } from "@/features/kategori/server-data"
import { getSessionUser } from "@/lib/server/auth-guards"

import { EditKategoriPageClient } from "./page-client"

export default async function EditKategoriPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const user = await getSessionUser()

  if (!user) {
    redirect("/login")
  }

  if (user.role !== "admin") {
    forbidden()
  }

  const data = await getKategoriPageData()

  return <EditKategoriPageClient params={params} initialData={data} />
}
