import { NextResponse } from "next/server"

import { requireCashierOrAdmin } from "@/lib/server/auth-guards"
import { getTransaksiPageData } from "@/features/transaksi/server-data"

export async function GET() {
  const user = await requireCashierOrAdmin()
  if (!user) {
    return NextResponse.json({ error: "Tidak memiliki akses" }, { status: 403 })
  }

  return NextResponse.json(await getTransaksiPageData())
}
