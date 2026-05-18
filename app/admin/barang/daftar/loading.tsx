import { BarangMobileListSkeleton } from "@/features/barang/components/barang-mobile-skeletons"
import BarangLoading from "../loading"

export default function DaftarBarangLoading() {
  return (
    <>
      <BarangMobileListSkeleton />
      <div className="hidden lg:block">
        <BarangLoading />
      </div>
    </>
  )
}
