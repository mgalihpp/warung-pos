import { headers } from "next/headers"

import { auth } from "@/lib/auth"
import { PosPageClient } from "@/components/pos/pos-page-client"

export default async function CashierPosPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  return (
    <PosPageClient
      cashierName={session?.user.name ?? "Kasir"}
      cashierId={session?.user.id ?? ""}
    />
  )
}
