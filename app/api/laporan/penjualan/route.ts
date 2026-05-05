import { NextResponse, type NextRequest } from "next/server"

import { getLaporanPenjualanData, parseLaporanRange } from "@/features/laporan/server-penjualan-data"
import { requireAdmin } from "@/lib/server/auth-guards"

export async function GET(req: NextRequest) {
  const user = await requireAdmin()
  if (!user) {
    return NextResponse.json({ error: "Tidak memiliki akses" }, { status: 403 })
  }

  const url = new URL(req.url)
  const range = parseLaporanRange(url.searchParams.get("range"))

  return NextResponse.json(await getLaporanPenjualanData(range))
}
