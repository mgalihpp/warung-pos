import { redirect } from "next/navigation"

import { LaporanContent } from "@/features/laporan/components/laporan-content"
import { getLaporanPenjualanData } from "@/features/laporan/server-penjualan-data"
import { getSessionUser } from "@/lib/server/auth-guards"

export default async function LaporanPage() {
  const user = await getSessionUser()

  if (!user) {
    redirect("/login")
  }

  if (user.role !== "admin") {
    redirect("/unauthorized")
  }

  const data = await getLaporanPenjualanData("30d")

  return <LaporanContent initialData={data} />
}
