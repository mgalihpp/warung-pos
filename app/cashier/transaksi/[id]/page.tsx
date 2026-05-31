import { notFound, redirect } from "next/navigation"

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
    redirect("/unauthorized")
  }

  const { id } = await params
  const data = await getTransaksiDetailData(id)

  if (!data) {
    notFound()
  }

  return (
    <div className="h-full min-h-0 overflow-y-auto bg-slate-50 p-4 lg:bg-transparent lg:p-6">
      <div className="mx-auto max-w-3xl">
        <CashierTransaksiDetailPageClient transactionId={id} initialData={data} />
      </div>
    </div>
  )
}
