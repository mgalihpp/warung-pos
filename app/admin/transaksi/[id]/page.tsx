import { notFound, redirect } from "next/navigation"

import { getTransaksiDetailData } from "@/features/transaksi/server-data"
import { getSessionUser } from "@/lib/server/auth-guards"

import { AdminTransaksiDetailPageClient } from "./page-client"

export default async function AdminTransaksiDetailPage({
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

  return (
    <AdminTransaksiDetailPageClient transactionId={id} initialData={data} />
  )
}
