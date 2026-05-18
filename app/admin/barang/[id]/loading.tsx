import { BarangMobileDetailSkeleton } from "@/features/barang/components/barang-mobile-skeletons"
import { Skeleton } from "@/components/ui/skeleton"

export default function DetailBarangLoading() {
  return (
    <>
      <BarangMobileDetailSkeleton />

      <div className="hidden lg:flex min-w-0 flex-col gap-4 p-4 pb-24 lg:gap-6 lg:p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="size-10 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-7 w-40 rounded-full" />
              <Skeleton className="h-4 w-72 rounded-full" />
            </div>
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-10 w-32 rounded-lg" />
            <Skeleton className="h-10 w-20 rounded-lg" />
            <Skeleton className="h-10 w-28 rounded-lg" />
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-24 rounded-xl" />
          ))}
        </div>

        <Skeleton className="h-80 rounded-xl" />
        <div className="grid grid-cols-2 gap-6">
          <Skeleton className="h-56 rounded-xl" />
          <Skeleton className="h-56 rounded-xl" />
        </div>
      </div>
    </>
  )
}
