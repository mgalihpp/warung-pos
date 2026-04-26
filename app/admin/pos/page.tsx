import { headers } from "next/headers"

import { auth } from "@/lib/auth"
import { PosPageClient } from "@/components/pos/pos-page-client"

export default async function PosPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  return (
    <div className="h-[calc(100dvh-3.5rem)] w-full">
      <PosPageClient
        cashierName={session?.user.name ?? "Admin"}
        cashierId={session?.user.id ?? ""}
      />
    </div>
  )
}
