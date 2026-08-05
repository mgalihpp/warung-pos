import { NextResponse, type NextRequest } from "next/server"

import {
  getDashboardData,
  parseDashboardRange,
} from "@/features/dashboard/server-data"
import { requireAdmin } from "@/lib/server/auth-guards"

export async function GET(req: NextRequest) {
  const user = await requireAdmin()
  if (!user) {
    return NextResponse.json({ error: "Tidak memiliki akses" }, { status: 403 })
  }

  const url = new URL(req.url)
  const range = parseDashboardRange(url.searchParams.get("range"))

  return NextResponse.json(await getDashboardData(range))
}
