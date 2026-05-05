import { notFound, redirect } from "next/navigation"

import { ProdukDetailPage } from "@/features/produk/components/produk-detail-page"
import { getProdukDetailData } from "@/features/produk/server-data-detail"
import { getSessionUser } from "@/lib/server/auth-guards"

export default async function ProdukDetailRoute({
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
  const data = await getProdukDetailData(id)

  if (!data) {
    notFound()
  }

  return <ProdukDetailPage data={data} />
}
