import { forbidden, notFound, redirect } from "next/navigation"

import { getTransaksiDetailData } from "@/features/transaksi/server-data"
import { getSessionUser } from "@/lib/server/auth-guards"

import { CashierTransaksiDetailPageClient } from "./page-client"

export default async function CashierTransaksiDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const user = await getSessionUser()

  if (!user) {
    redirect("/login")
  }

  if (user.role !== "cashier" && user.role !== "admin") {
    forbidden()
  }

  const { id } = await params
  const data = await getTransaksiDetailData(id)

  if (!data) {
    notFound()
  }

  return (
    <CashierTransaksiDetailPageClient transactionId={id} initialData={data} />
  )
}
