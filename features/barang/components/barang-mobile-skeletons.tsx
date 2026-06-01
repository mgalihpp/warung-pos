import { Skeleton } from "@/components/ui/skeleton"

export function BarangMobileLandingSkeleton() {
  return (
    <div className="h-full overflow-y-auto px-4 pb-20 pt-5 lg:hidden">
      <div className="rounded-3xl bg-primary p-5 shadow-lg shadow-primary/20">
        <div className="flex items-center gap-4">
          <Skeleton className="size-14 rounded-2xl bg-primary-foreground/20" />
          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton className="h-6 w-40 rounded-full bg-primary-foreground/20" />
            <Skeleton className="h-4 w-full max-w-52 rounded-full bg-primary-foreground/15" />
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        {Array.from({ length: 2 }).map((_, index) => (
          <div key={index} className="rounded-2xl border bg-card p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <Skeleton className="size-10 rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-3 w-20 rounded-full" />
                <Skeleton className="h-7 w-10 rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 space-y-4">
        {Array.from({ length: 2 }).map((_, index) => (
          <div key={index} className="flex items-center gap-4 rounded-3xl border bg-card p-4 shadow-sm">
            <Skeleton className="size-14 shrink-0 rounded-2xl" />
            <div className="min-w-0 flex-1 space-y-2">
              <Skeleton className="h-5 w-24 rounded-full" />
              <Skeleton className="h-4 w-40 rounded-full" />
            </div>
            <Skeleton className="size-10 shrink-0 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  )
}

export function BarangMobileListSkeleton() {
  return (
    <div className="flex h-full min-h-0 flex-col lg:hidden">
      <div className="relative shrink-0 px-4 pt-3">
        <Skeleton className="h-11 rounded-xl" />
      </div>

      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 pb-[calc(1.5rem+env(safe-area-inset-bottom))] pt-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="rounded-2xl border bg-card p-3 shadow-sm">
            <div className="flex items-center gap-3">
              <Skeleton className="size-16 shrink-0 rounded-2xl" />
              <div className="min-w-0 flex-1 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <Skeleton className="h-5 w-32 rounded-full" />
                  <Skeleton className="h-5 w-24 rounded-full" />
                </div>
                <div className="flex items-center justify-between">
                  <Skeleton className="h-7 w-20 rounded-full" />
                  <Skeleton className="size-9 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function BarangMobileDetailSkeleton() {
  return (
    <div className="lg:hidden">
      <Skeleton className="aspect-[9/10] w-full rounded-none" />

      <div className="space-y-4 px-4 pb-[calc(5.5rem+env(safe-area-inset-bottom))] pt-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton className="h-8 w-40 rounded-full" />
            <Skeleton className="h-7 w-24 rounded-full" />
          </div>
          <Skeleton className="h-9 w-20 shrink-0 rounded-xl" />
        </div>

        <div className="rounded-2xl border bg-card p-4 shadow-sm">
          <div className="mb-3 flex items-center gap-2">
            <Skeleton className="size-8 rounded-xl" />
            <Skeleton className="h-5 w-32 rounded-full" />
          </div>
          <div className="divide-y">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="flex items-center justify-between gap-3 py-3">
                <Skeleton className="h-5 w-28 rounded-full" />
                <Skeleton className="h-5 w-24 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/80 p-4 backdrop-blur pb-[calc(1rem+env(safe-area-inset-bottom))]">
        <Skeleton className="h-12 w-full rounded-2xl" />
      </div>
    </div>
  )
}

export function BarangMobileFormSkeleton() {
  return (
    <div className="lg:hidden flex min-w-0 flex-col gap-4 p-4 pb-[calc(5.5rem+env(safe-area-inset-bottom))]">
      {Array.from({ length: 2 }).map((_, sectionIndex) => (
        <div key={sectionIndex} className="rounded-2xl border bg-card p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <Skeleton className="size-9 rounded-xl" />
            <Skeleton className="h-5 w-36 rounded-full" />
          </div>
          <div className="space-y-4">
            {Array.from({ length: sectionIndex === 0 ? 3 : 4 }).map((__, fieldIndex) => (
              <Skeleton key={fieldIndex} className="h-14 rounded-xl" />
            ))}
          </div>
        </div>
      ))}

      <div className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/80 p-4 backdrop-blur pb-[calc(1rem+env(safe-area-inset-bottom))]">
        <Skeleton className="h-12 w-full rounded-2xl" />
      </div>
    </div>
  )
}
