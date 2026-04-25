import { StatCards } from "@/components/dashboard/stat-cards"
import { SalesChart } from "@/components/dashboard/sales-chart"
import { CategoryChart } from "@/components/dashboard/category-chart"
import { PaymentMethods } from "@/components/dashboard/payment-methods"
import { RecentTransactions } from "@/components/dashboard/recent-transactions"
import { LowStockPanel } from "@/components/dashboard/low-stock-panel"
import { BestSellersPanel } from "@/components/dashboard/best-sellers-panel"
import { QuickActions } from "@/components/dashboard/quick-actions"

export default function AdminDashboardPage() {
  return (
    <div className="flex flex-col gap-6 p-4 lg:p-6">
      {/* Stat Cards - Full Row */}
      <StatCards />

      {/* Main Content & Right Panel Grid */}
      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Main Content */}
        <div className="flex flex-1 flex-col gap-6 min-w-0">
          {/* Charts Row */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <SalesChart />
            <CategoryChart />
          </div>

          {/* Actions & Transactions Row */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Left Column: Quick Actions + Payment Methods */}
            <div className="flex flex-col gap-6 lg:col-span-1">
              <QuickActions />
              <PaymentMethods />
            </div>

            {/* Right Column: Recent Transactions */}
            <div className="lg:col-span-2">
              <RecentTransactions />
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="flex w-full flex-col gap-6 md:grid md:grid-cols-2 lg:flex lg:w-[320px] lg:shrink-0 xl:w-[350px]">
          <LowStockPanel />
          <BestSellersPanel />
        </div>
      </div>
    </div>
  )
}
