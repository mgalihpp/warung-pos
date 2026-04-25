import { ProdukHeader } from "@/components/produk/produk-header"
import { ProdukStatCards } from "@/components/produk/produk-stat-cards"
import { ProdukTable } from "@/components/produk/produk-table"
import { ProdukKategoriChart } from "@/components/produk/produk-kategori-chart"
import { ProdukPopuler } from "@/components/produk/produk-populer"
import { ProdukAktivitas } from "@/components/produk/produk-aktivitas"

export default function ProdukPage() {
  return (
    <div className="flex flex-col gap-3 p-4 lg:gap-6 lg:p-6 min-w-0">
      {/* Header */}
      <ProdukHeader />

      {/* Stat Cards */}
      <ProdukStatCards />

      {/* Main Content & Right Panel */}
      <div className="flex flex-col gap-6 xl:flex-row min-w-0">
        {/* Left: Table + Activity */}
        <div className="flex flex-1 flex-col gap-6 min-w-0 overflow-hidden">
          <ProdukTable />
          <ProdukAktivitas />
        </div>

        {/* Right Panel */}
        <div className="flex w-full flex-col gap-6 lg:grid lg:grid-cols-2 xl:flex xl:w-[320px] xl:shrink-0 2xl:w-[350px]">
          <ProdukKategoriChart />
          <ProdukPopuler />
        </div>
      </div>
    </div>
  )
}
