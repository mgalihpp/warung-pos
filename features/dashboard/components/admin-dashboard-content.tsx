"use client"

import { useSearchParam } from "@/hooks/use-search-param"
import { BestSellersPanel } from "@/features/dashboard/components/best-sellers-panel"
import { CategoryChart } from "@/features/dashboard/components/category-chart"
import { LowStockPanel } from "@/features/dashboard/components/low-stock-panel"
import { PaymentMethods } from "@/features/dashboard/components/payment-methods"
import { RecentTransactions } from "@/features/dashboard/components/recent-transactions"
import { SalesChart } from "@/features/dashboard/components/sales-chart"
import { StatCards } from "@/features/dashboard/components/stat-cards"
import {
  useDashboard,
  type DashboardData,
  type SalesRange,
} from "@/features/dashboard/hooks/use-dashboard-queries"

type AdminDashboardContentProps = {
  initialData: DashboardData
}

export function AdminDashboardContent({
  initialData,
}: AdminDashboardContentProps) {
  const [rangeParam, setRange] = useSearchParam("range", initialData.range)
  const range = rangeParam as SalesRange
  const { data = initialData } = useDashboard(range, initialData)

  return (
    <div className="flex min-w-0 flex-col gap-6 p-4 lg:p-6">
      <StatCards stats={data.stats} />

      <div className="flex min-w-0 flex-col gap-6 xl:flex-row">
        <div className="flex min-w-0 flex-1 flex-col gap-6 overflow-hidden">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <SalesChart
              data={data.salesChart}
              range={range}
              onRangeChange={setRange}
            />
            <CategoryChart data={data.categoryChart} />
          </div>

          <div className="flex min-w-0 flex-col gap-6 2xl:flex-row">
            <div className="flex flex-col gap-6 2xl:w-[300px] 2xl:shrink-0">
              <PaymentMethods methods={data.paymentMethods} />
            </div>

            <div className="min-w-0 flex-1">
              <RecentTransactions transactions={data.recentTransactions} />
            </div>
          </div>
        </div>

        <div className="flex w-full flex-col gap-6 lg:grid lg:grid-cols-2 xl:flex xl:w-[320px] xl:shrink-0 2xl:w-[350px]">
          <LowStockPanel items={data.lowStock} />
          <BestSellersPanel items={data.bestSellers} />
        </div>
      </div>
    </div>
  )
}
