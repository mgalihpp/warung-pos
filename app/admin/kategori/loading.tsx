import { KategoriMobileListSkeleton } from "@/features/kategori/components/kategori-mobile-skeletons"
import { Skeleton } from "@/components/ui/skeleton"

export default function KategoriPageLoading() {
  return (
    <>
      <KategoriMobileListSkeleton />
      <div className="hidden min-w-0 flex-col gap-6 p-6 lg:flex">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <Skeleton className="h-8 w-56 rounded-lg" />
            <Skeleton className="mt-2 h-4 w-80 rounded-lg" />
          </div>
          <Skeleton className="h-10 w-40 rounded-lg" />
        </div>

        <div className="grid grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-xl border bg-card p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <Skeleton className="h-4 w-24 rounded-full" />
                  <Skeleton className="mt-2 h-8 w-14 rounded-lg" />
                  <Skeleton className="mt-2 h-3 w-32 rounded-full" />
                </div>
                <Skeleton className="size-9 shrink-0 rounded-lg" />
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-32 rounded-full" />
          </div>

          <div className="relative flex-1 p-[3px]">
            <Skeleton className="h-9 w-full rounded-lg" />
          </div>

          <div className="overflow-x-auto rounded-xl border bg-card shadow-sm">
            <div className="min-w-[760px]">
              <div className="grid grid-cols-[1.2fr_1fr_0.8fr_1.5fr_80px] border-b bg-muted/30 px-4 py-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-4 w-20 rounded-full" />
                ))}
              </div>

              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="grid grid-cols-[1.2fr_1fr_0.8fr_1.5fr_80px] items-center border-b px-4 py-3 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <Skeleton className="size-9 shrink-0 rounded-lg" />
                    <Skeleton className="h-5 w-32 rounded-full" />
                  </div>
                  <Skeleton className="h-4 w-28 rounded-full" />
                  <Skeleton className="h-4 w-16 rounded-full" />
                  <Skeleton className="h-4 w-52 rounded-full" />
                  <Skeleton className="size-8 rounded-md" />
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-center justify-between gap-3 lg:flex-row">
            <Skeleton className="h-4 w-44 rounded-full" />
            <div className="flex items-center gap-1">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="size-8 rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
