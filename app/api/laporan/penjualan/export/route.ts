import { NextResponse, type NextRequest } from "next/server"

import { requireAdmin } from "@/lib/server/auth-guards"
import { parseLaporanRange } from "@/features/laporan/server-penjualan-data"
import { getRawExportData } from "@/features/laporan/server-export-data"

export async function GET(req: NextRequest) {
  const user = await requireAdmin()
  if (!user) {
    return NextResponse.json({ error: "Tidak memiliki akses" }, { status: 403 })
  }

  const url = new URL(req.url)
  const range = parseLaporanRange(url.searchParams.get("range"))

  const data = await getRawExportData(range)

  return NextResponse.json({ range, count: data.length, rows: data })
}
