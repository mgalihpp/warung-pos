import { forbidden, redirect } from "next/navigation"

import { getBarangPageData } from "@/features/barang/server-data"
import { getSessionUser } from "@/lib/server/auth-guards"

import { EditBarangPageClient } from "./page-client"

export default async function EditBarangPage({
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

  const data = await getBarangPageData()

  return <EditBarangPageClient params={params} initialData={data} />
}
