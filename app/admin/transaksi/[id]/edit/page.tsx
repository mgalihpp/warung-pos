import { notFound, redirect } from "next/navigation"

import { TransaksiEditPage } from "@/features/transaksi/components/transaksi-edit-page"
import { getTransaksiDetailData } from "@/features/transaksi/server-data"
import { getSessionUser } from "@/lib/server/auth-guards"

export default async function EditTransaksiPage({
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
  const data = await getTransaksiDetailData(id)

  if (!data) {
    notFound()
  }

  return <TransaksiEditPage data={data} basePath="/admin/transaksi" />
}
