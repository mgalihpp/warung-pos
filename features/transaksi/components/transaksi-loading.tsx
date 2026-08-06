import { TransaksiMobileListSkeleton } from "./transaksi-mobile-skeletons"

export default function TransaksiLoading() {
  return (
    <>
      <TransaksiMobileListSkeleton />
      <div className="hidden min-w-0 flex-col gap-3 p-4 lg:flex lg:gap-6 lg:p-6">
        {/* Header skeleton */}
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight lg:text-2xl">
              Manajemen Transaksi
            </h1>
            <p className="text-sm text-muted-foreground">
              Pantau, cari, dan kelola seluruh transaksi warung Anda
            </p>
          </div>
          <div className="hidden items-center gap-2 xl:flex">
            <div className="h-10 w-36 animate-pulse rounded-lg bg-muted" />
            <div className="h-10 w-24 animate-pulse rounded-lg bg-muted" />
          </div>
        </div>

        {/* Search + filter skeleton */}
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
          <div className="h-9 w-full flex-1 animate-pulse rounded-lg bg-muted" />
          <div className="hidden items-center gap-2 lg:flex">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className={`h-9 animate-pulse rounded-lg bg-muted ${i === 2 ? "w-[170px]" : "w-[150px]"}`}
              />
            ))}
          </div>
        </div>

        {/* Table skeleton */}
        <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
          <div className="flex items-center gap-6 border-b bg-muted/30 px-4 py-3">
            <div className="h-3 w-20 animate-pulse rounded bg-muted" />
            <div className="h-3 w-24 animate-pulse rounded bg-muted" />
            <div className="h-3 w-14 animate-pulse rounded bg-muted" />
            <div className="h-3 w-14 animate-pulse rounded bg-muted" />
            <div className="h-3 w-28 animate-pulse rounded bg-muted" />
            <div className="h-3 w-14 animate-pulse rounded bg-muted" />
            <div className="h-3 w-16 animate-pulse rounded bg-muted" />
            <div className="h-3 w-14 animate-pulse rounded bg-muted" />
            <div className="h-3 w-10 animate-pulse rounded bg-muted" />
          </div>
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-6 border-b px-4 py-3 last:border-0"
            >
              <div className="h-4 w-28 animate-pulse rounded bg-muted" />
              <div className="h-3 w-32 animate-pulse rounded bg-muted" />
              <div className="h-3 w-16 animate-pulse rounded bg-muted" />
              <div className="h-3 w-16 animate-pulse rounded bg-muted" />
              <div className="h-3 w-36 animate-pulse rounded bg-muted" />
              <div className="h-5 w-14 animate-pulse rounded-full bg-muted" />
              <div className="h-4 w-20 animate-pulse rounded bg-muted" />
              <div className="h-5 w-16 animate-pulse rounded-full bg-muted" />
              <div className="h-4 w-12 animate-pulse rounded bg-muted" />
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
