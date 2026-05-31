import { PosPageClient } from "@/features/pos/components/pos-page-client"
import { getPosPageData } from "@/features/pos/server-data"

export default async function PosPage() {
  const initialData = await getPosPageData()

  return (
    <div className="h-full w-full">
      <PosPageClient
        initialData={initialData}
        stockReportHref="/admin/laporan/stok"
      />
    </div>
  )
}
