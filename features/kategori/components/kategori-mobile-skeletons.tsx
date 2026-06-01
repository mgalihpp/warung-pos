import { Skeleton } from "@/components/ui/skeleton"

export function KategoriMobileListSkeleton() {
  return (
    <div className="flex h-full min-h-0 flex-col lg:hidden">
      <div className="relative shrink-0 px-4 pt-3">
        <Skeleton className="h-11 w-full rounded-xl" />
      </div>
      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 pb-[calc(1.5rem+env(safe-area-inset-bottom))] pt-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="rounded-2xl border bg-card p-4 shadow-sm">
            <div className="flex items-center gap-4">
              <Skeleton className="size-16 shrink-0 rounded-2xl" />
              <div className="min-w-0 flex-1">
                <Skeleton className="h-5 w-32 rounded-full" />
              </div>
              <Skeleton className="size-11 shrink-0 rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function KategoriMobileFormSkeleton() {
  return (
    <div className="lg:hidden">
      <div className="flex min-w-0 flex-col gap-6 p-4 pb-[calc(5.5rem+env(safe-area-inset-bottom))]">
        <div className="rounded-2xl border bg-card p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-3">
            <Skeleton className="size-10 rounded-xl" />
            <Skeleton className="h-5 w-40 rounded-full" />
          </div>
          <Skeleton className="h-14 w-full rounded-xl" />
        </div>
      </div>
      <div className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/80 p-4 backdrop-blur pb-[calc(1rem+env(safe-area-inset-bottom))]">
        <Skeleton className="h-12 w-full rounded-2xl" />
      </div>
    </div>
  )
}
