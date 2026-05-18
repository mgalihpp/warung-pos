import { KategoriMobileListSkeleton } from "@/features/kategori/components/kategori-mobile-skeletons"

export default function KategoriPageLoading() {
  return (
    <>
      <KategoriMobileListSkeleton />
      <div className="hidden lg:block">
        <div className="flex min-w-0 flex-col gap-3 p-4 lg:gap-6 lg:p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="h-8 w-40 animate-pulse rounded-lg bg-muted" />
              <div className="h-4 w-60 animate-pulse rounded-lg bg-muted" />
            </div>
            <div className="h-10 w-28 animate-pulse rounded-lg bg-muted" />
          </div>
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 rounded-xl border bg-card p-4 shadow-sm">
                <div className="size-12 animate-pulse rounded-xl bg-muted" />
                <div className="flex-1 space-y-2">
                  <div className="h-5 w-40 animate-pulse rounded bg-muted" />
                  <div className="h-3 w-24 animate-pulse rounded bg-muted" />
                </div>
                <div className="h-9 w-24 animate-pulse rounded-lg bg-muted" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
