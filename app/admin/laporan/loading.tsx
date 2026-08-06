import { Skeleton } from "@/components/ui/skeleton"

export default function LaporanLoading() {
  return (
    <div className="flex min-w-0 flex-col gap-4">
      <div className="hidden items-center justify-between lg:flex">
        <Skeleton className="h-4 w-56" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-24 rounded-lg" />
          <Skeleton className="h-9 w-44 rounded-lg" />
        </div>
      </div>
      <Skeleton className="h-[360px] rounded-[28px] lg:hidden" />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-24 rounded-xl" />
        ))}
      </div>
      <div className="grid min-w-0 grid-cols-1 gap-4 2xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className="flex min-w-0 flex-col gap-4">
          <div className="grid min-w-0 grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.5fr)_minmax(340px,0.9fr)]">
            <div className="flex min-w-0 flex-col gap-4">
              <Skeleton className="h-[340px] rounded-xl" />
              <Skeleton className="h-[300px] rounded-xl" />
            </div>
            <div className="flex min-w-0 flex-col gap-4">
              <Skeleton className="h-[300px] rounded-xl" />
              <Skeleton className="h-[300px] rounded-xl" />
            </div>
          </div>
          <Skeleton className="h-[420px] rounded-xl" />
        </div>
        <div className="flex w-full min-w-0 flex-col gap-4 lg:grid lg:grid-cols-2 2xl:flex">
          <Skeleton className="h-[220px] rounded-xl" />
          <Skeleton className="h-[280px] rounded-xl" />
          <Skeleton className="h-[220px] rounded-xl" />
        </div>
      </div>
    </div>
  )
}
