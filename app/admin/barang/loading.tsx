import { Skeleton } from "@/components/ui/skeleton"
import { BarangMobileLandingSkeleton } from "@/features/barang/components/barang-mobile-skeletons"

function StatSkeleton() {
  return <Skeleton className="h-20 rounded-xl lg:h-24" />
}

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
      <div className="hidden lg:flex min-w-0 flex-col gap-3 p-4 lg:gap-6 lg:p-6">
      <div className="space-y-2 lg:space-y-3">
        <Skeleton className="h-8 w-56 rounded-full lg:h-9 lg:w-72" />
        <Skeleton className="h-4 w-full max-w-xl rounded-full" />
      </div>

      <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-1 lg:hidden">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="flex min-w-[180px] shrink-0 items-center gap-3 rounded-xl border bg-card p-3 shadow-sm"
          >
            <Skeleton className="size-10 rounded-lg" />
            <div className="min-w-0 flex-1 space-y-2">
              <Skeleton className="h-3 w-20 rounded-full" />
              <Skeleton className="h-6 w-14 rounded-full" />
            </div>
          </div>
        ))}
      </div>

      <div className="hidden lg:grid lg:grid-cols-2 lg:gap-4 2xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <StatSkeleton key={index} />
        ))}
      </div>

      <div className="flex flex-col gap-6 xl:flex-row">
        <div className="flex flex-1 min-w-0 flex-col gap-6">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:gap-4">
            <Skeleton className="h-9 w-full rounded-lg lg:flex-1" />
            <Skeleton className="h-10 w-full rounded-lg lg:hidden" />
            <div className="hidden flex-wrap items-center gap-2 lg:flex">
              <Skeleton className="h-10 w-[180px] rounded-lg" />
              <Skeleton className="h-10 w-[160px] rounded-lg" />
              <Skeleton className="h-10 w-[180px] rounded-lg" />
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

        <div className="grid gap-6 lg:grid-cols-2 xl:flex xl:w-[320px] xl:shrink-0 2xl:w-[350px] xl:flex-col">
          <div className="rounded-xl border bg-card p-4 shadow-sm">
            <Skeleton className="mb-4 h-4 w-32 rounded-full" />
            <Skeleton className="mx-auto h-[200px] w-[200px] rounded-full" />
            <div className="mt-5 space-y-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Skeleton className="size-2.5 rounded-full" />
                  <Skeleton className="h-3 flex-1 rounded-full" />
                  <Skeleton className="h-3 w-6 rounded-full" />
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border bg-card p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <Skeleton className="h-4 w-28 rounded-full" />
              <Skeleton className="h-3 w-16 rounded-full" />
            </div>
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="flex items-center gap-3 rounded-lg border border-border/50 bg-muted/20 px-3 py-2.5">
                  <Skeleton className="size-7 rounded-full" />
                  <Skeleton className="size-9 rounded-lg" />
                  <div className="min-w-0 flex-1 space-y-2">
                    <Skeleton className="h-3 w-[70%] rounded-full" />
                    <Skeleton className="h-3 w-[45%] rounded-full" />
                  </div>
                  <Skeleton className="h-3 w-16 rounded-full" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      </div>
    </>
  )
}
