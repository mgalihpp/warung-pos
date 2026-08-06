import { Suspense } from "react"
import { forbidden, redirect } from "next/navigation"

import { LaporanStokContent } from "@/features/laporan/components/laporan-stok-content"
import { getLaporanStokData } from "@/features/laporan/server-stok-data"
import { getSessionUser } from "@/lib/server/auth-guards"

export default async function LaporanStokPage() {
  const user = await getSessionUser()

  if (!user) {
    redirect("/login")
  }

  if (user.role !== "admin") {
    forbidden()
  }

  const data = await getLaporanStokData()

  return (
    <Suspense>
      <LaporanStokContent initialData={data} />
    </Suspense>
  )
}
