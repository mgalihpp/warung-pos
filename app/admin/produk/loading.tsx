import { HugeiconsIcon } from "@hugeicons/react"
import { PackageIcon } from "@hugeicons/core-free-icons"

export default function ProdukLoading() {
  return (
    <div className="flex min-w-0 flex-col gap-3 p-4 lg:gap-6 lg:p-6">
      {/* Header skeleton */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight lg:text-2xl">Manajemen Produk</h1>
          <p className="text-sm text-muted-foreground">Kelola produk, kategori, dan stok warung Anda</p>
        </div>
        <div className="hidden items-center gap-2 lg:flex">
          <div className="h-9 w-36 animate-pulse rounded-lg bg-muted" />
        </div>
      </div>

      {/* Stat cards skeleton */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border bg-card p-4 shadow-sm">
            <div className="mb-3 h-3 w-20 animate-pulse rounded bg-muted" />
            <div className="h-7 w-12 animate-pulse rounded bg-muted" />
          </div>
        ))}
      </div>

      {/* Table skeleton */}
      <div className="flex min-w-0 flex-col gap-6 xl:flex-row">
        <div className="flex min-w-0 flex-1 flex-col gap-4 overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="h-4 w-24 animate-pulse rounded bg-muted" />
          </div>
          <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
            <div className="flex items-center gap-3 border-b bg-muted/30 px-4 py-3">
              <div className="h-3 w-16 animate-pulse rounded bg-muted" />
              <div className="h-3 w-16 animate-pulse rounded bg-muted" />
              <div className="h-3 w-12 animate-pulse rounded bg-muted" />
              <div className="h-3 w-20 animate-pulse rounded bg-muted" />
              <div className="h-3 w-14 animate-pulse rounded bg-muted" />
              <div className="h-3 w-10 animate-pulse rounded bg-muted" />
            </div>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 border-b px-4 py-3 last:border-0">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/5 text-primary">
                  <HugeiconsIcon icon={PackageIcon} size={17} className="opacity-20" />
                </div>
                <div className="flex-1 space-y-1.5">
                  <div className="h-3.5 w-32 animate-pulse rounded bg-muted" />
                  <div className="h-2.5 w-20 animate-pulse rounded bg-muted" />
                </div>
                <div className="h-3 w-16 animate-pulse rounded bg-muted" />
                <div className="h-3 w-12 animate-pulse rounded bg-muted" />
                <div className="h-3 w-16 animate-pulse rounded bg-muted" />
                <div className="h-5 w-14 animate-pulse rounded-full bg-muted" />
                <div className="h-4 w-16 animate-pulse rounded bg-muted" />
              </div>
            ))}
          </div>
        </div>

        {/* Right panel skeleton */}
        <div className="flex w-full flex-col gap-6 lg:grid lg:grid-cols-2 xl:flex xl:w-[320px] xl:shrink-0 2xl:w-[350px]">
          <div className="rounded-xl border bg-card p-4 shadow-sm">
            <div className="mb-4 h-4 w-32 animate-pulse rounded bg-muted" />
            <div className="mx-auto size-40 animate-pulse rounded-full bg-muted" />
          </div>
          <div className="rounded-xl border bg-card p-4 shadow-sm">
            <div className="mb-4 h-4 w-28 animate-pulse rounded bg-muted" />
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="h-4 w-5 animate-pulse rounded bg-muted" />
                  <div className="h-4 flex-1 animate-pulse rounded bg-muted" />
                  <div className="h-4 w-14 animate-pulse rounded bg-muted" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
