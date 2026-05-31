import { PosPageClient } from "@/features/pos/components/pos-page-client"
import { getPosPageData } from "@/features/pos/server-data"

export default async function CashierPosPage() {
  const initialData = await getPosPageData()

  return <PosPageClient initialData={initialData} />
}
