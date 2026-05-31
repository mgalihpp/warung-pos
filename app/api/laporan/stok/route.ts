import { NextResponse } from "next/server"

import { getLaporanStokData } from "@/features/laporan/server-stok-data"
import { requireAdmin } from "@/lib/server/auth-guards"

export async function GET() {
  const user = await requireAdmin()
  if (!user) {
    return NextResponse.json({ error: "Tidak memiliki akses" }, { status: 403 })
  }

  return NextResponse.json(await getLaporanStokData())
}
