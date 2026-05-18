import { notFound, redirect } from "next/navigation"

import { BarangDetailPage } from "@/features/barang/components/barang-detail-page"
import { getBarangDetailData } from "@/features/barang/server-data-detail"
import { getSessionUser } from "@/lib/server/auth-guards"

export default async function BarangDetailRoute({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const user = await getSessionUser()

  if (!user) {
    redirect("/login")
  }

  if (user.role !== "admin") {
    redirect("/unauthorized")
  }

  const { id } = await params
  const data = await getBarangDetailData(id)

  if (!data) {
    notFound()
  }

  return <BarangDetailPage data={data} />
}
