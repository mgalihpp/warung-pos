import { Skeleton } from "@/components/ui/skeleton"

export default function AdminDashboardLoading() {
  return (
    <div className="flex min-w-0 flex-col gap-6 p-4 lg:p-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>
      <div className="flex min-w-0 flex-col gap-6 xl:flex-row">
        <div className="flex min-w-0 flex-1 flex-col gap-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Skeleton className="h-[280px] rounded-xl" />
            <Skeleton className="h-[280px] rounded-xl" />
          </div>
          <div className="flex min-w-0 flex-col gap-6 2xl:flex-row">
            <div className="flex flex-col gap-6 2xl:w-[300px] 2xl:shrink-0">
              <Skeleton className="h-[160px] rounded-xl" />
              <Skeleton className="h-[200px] rounded-xl" />
            </div>
            <Skeleton className="h-[360px] flex-1 rounded-xl" />
          </div>
        </div>
        <div className="flex w-full flex-col gap-6 lg:grid lg:grid-cols-2 xl:flex xl:w-[320px] xl:shrink-0 2xl:w-[350px]">
          <Skeleton className="h-[300px] rounded-xl" />
          <Skeleton className="h-[300px] rounded-xl" />
        </div>
      </div>
    </div>
  )
}
