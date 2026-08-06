import { Skeleton } from "@/components/ui/skeleton"
import { BarangMobileLandingSkeleton } from "@/features/barang/components/barang-mobile-skeletons"

function TableRowSkeleton() {
  return (
    <div className="grid grid-cols-[minmax(0,1.6fr)_0.9fr_0.7fr] items-center gap-3 border-b px-4 py-3 last:border-b-0 sm:grid-cols-[minmax(0,1.8fr)_0.8fr_0.8fr_0.7fr] lg:grid-cols-[minmax(0,2fr)_0.9fr_0.7fr_0.9fr_0.8fr_0.7fr]">
      <div className="flex items-center gap-3">
        <Skeleton className="size-9 rounded-lg" />
        <div className="min-w-0 flex-1 space-y-2">
          <Skeleton className="h-4 w-[70%] rounded-full" />
          <Skeleton className="h-3 w-[45%] rounded-full" />
        </div>
      </div>
      <Skeleton className="h-4 w-[75%] rounded-full sm:justify-self-start" />
      <Skeleton className="h-4 w-[65%] rounded-full sm:justify-self-start" />
      <div className="hidden sm:block">
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
      <div className="hidden lg:block">
        <Skeleton className="h-4 w-[80%] rounded-full" />
      </div>
      <div className="hidden lg:flex lg:justify-end">
        <Skeleton className="h-8 w-20 rounded-lg" />
      </div>
    </div>
  )
}

export default function BarangLoading() {
  return (
    <>
      <BarangMobileLandingSkeleton />
      <div className="hidden min-w-0 flex-col gap-3 p-4 lg:flex lg:gap-6 lg:p-6">
        <div className="space-y-2 lg:space-y-3">
          <Skeleton className="h-8 w-56 rounded-full lg:h-9 lg:w-72" />
          <Skeleton className="h-4 w-full max-w-xl rounded-full" />
        </div>

        <div className="flex min-w-0 flex-col gap-6 overflow-hidden">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:gap-4">
            <Skeleton className="h-9 w-full rounded-lg lg:max-w-sm" />
            <Skeleton className="h-10 w-full rounded-lg lg:hidden" />
            <div className="hidden flex-wrap items-center gap-2 lg:flex">
              <Skeleton className="h-9 w-[180px] rounded-lg" />
              <Skeleton className="h-9 w-[160px] rounded-lg" />
              <Skeleton className="h-9 w-[180px] rounded-lg" />
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
            <div className="hidden border-b bg-muted/30 px-4 py-3 lg:grid lg:grid-cols-[minmax(0,2fr)_0.9fr_0.7fr_0.9fr_0.8fr_0.7fr] lg:gap-3">
              <Skeleton className="h-3 w-24 rounded-full" />
              <Skeleton className="h-3 w-20 rounded-full" />
              <Skeleton className="h-3 w-14 rounded-full" />
              <Skeleton className="h-3 w-20 rounded-full" />
              <Skeleton className="h-3 w-16 rounded-full" />
              <Skeleton className="h-3 w-14 rounded-full" />
            </div>

            <div className="divide-y">
              {Array.from({ length: 6 }).map((_, index) => (
                <TableRowSkeleton key={index} />
              ))}
            </div>
          </div>

          <div className="flex flex-col items-center justify-between gap-3 lg:flex-row">
            <Skeleton className="h-4 w-44 rounded-full" />
            <div className="flex items-center gap-1">
              <Skeleton className="size-8 rounded-lg" />
              <Skeleton className="size-8 rounded-lg" />
              <Skeleton className="size-8 rounded-lg" />
              <Skeleton className="size-8 rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
