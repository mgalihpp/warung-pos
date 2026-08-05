import { Skeleton } from "@/components/ui/skeleton"

export function TransaksiMobileListSkeleton() {
  return (
    <div className="flex h-full min-h-0 flex-col gap-4 overflow-hidden p-4 lg:hidden">
      <div className="relative overflow-hidden rounded-2xl bg-primary p-4 text-primary-foreground shadow-lg">
        <div className="flex items-center gap-3">
          <Skeleton className="size-10 rounded-xl bg-primary-foreground/20" />
          <div className="min-w-0 flex-1 space-y-1.5">
            <Skeleton className="h-3 w-24 rounded-full bg-primary-foreground/20" />
            <Skeleton className="h-4 w-36 rounded-full bg-primary-foreground/15" />
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3 border-t border-primary-foreground/20 pt-4">
          <div className="space-y-2">
            <Skeleton className="h-3 w-20 rounded-full bg-primary-foreground/20" />
            <Skeleton className="h-7 w-12 rounded-full bg-primary-foreground/20" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-3 w-24 rounded-full bg-primary-foreground/20" />
            <Skeleton className="h-7 w-24 rounded-full bg-primary-foreground/20" />
          </div>
        </div>
      </div>

      <Skeleton className="h-12 w-full shrink-0 rounded-xl" />

      <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto pb-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-3.5 rounded-xl border bg-white p-4 shadow-sm"
          >
            <Skeleton className="size-12 shrink-0 rounded-xl" />
            <div className="min-w-0 flex-1 space-y-2">
              <Skeleton className="h-5 w-28 rounded-full" />
              <Skeleton className="h-3 w-16 rounded-full" />
              <Skeleton className="h-3 w-32 rounded-full" />
            </div>
            <Skeleton className="size-5 shrink-0 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  )
}

export function TransaksiMobileDetailSkeleton() {
  return (
    <div className="space-y-4 p-4 pb-6 lg:hidden">
      <div className="rounded-xl border bg-white p-4 shadow-sm">
        <div className="mb-4 flex items-center gap-2.5">
          <Skeleton className="size-8 rounded-lg" />
          <Skeleton className="h-4 w-36 rounded-full" />
        </div>
        <div className="space-y-3.5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between">
              <Skeleton className="h-3 w-20 rounded-full" />
              <Skeleton className="h-3 w-28 rounded-full" />
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border bg-white p-4 shadow-sm">
        <div className="mb-4 flex items-center gap-2.5">
          <Skeleton className="size-8 rounded-lg" />
          <Skeleton className="h-4 w-36 rounded-full" />
        </div>
        <div className="space-y-3">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between">
              <Skeleton className="h-3 w-16 rounded-full" />
              <Skeleton className="h-3 w-24 rounded-full" />
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border bg-white p-4 shadow-sm">
        <div className="mb-4 flex items-center gap-2.5">
          <Skeleton className="size-8 rounded-lg" />
          <Skeleton className="h-4 w-28 rounded-full" />
        </div>
        <div className="space-y-2.5">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-3 rounded-xl bg-slate-50/70 p-2.5"
            >
              <Skeleton className="size-12 shrink-0 rounded-xl" />
              <div className="min-w-0 flex-1 space-y-1.5">
                <Skeleton className="h-4 w-32 rounded-full" />
                <Skeleton className="h-3 w-20 rounded-full" />
              </div>
              <Skeleton className="h-4 w-20 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
