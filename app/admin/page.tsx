"use client"

import { useState } from "react"

import { StatCards } from "@/components/dashboard/stat-cards"
import { SalesChart } from "@/components/dashboard/sales-chart"
import { CategoryChart } from "@/components/dashboard/category-chart"
import { PaymentMethods } from "@/components/dashboard/payment-methods"
import { RecentTransactions } from "@/components/dashboard/recent-transactions"
import { LowStockPanel } from "@/components/dashboard/low-stock-panel"
import { BestSellersPanel } from "@/components/dashboard/best-sellers-panel"
import {
  QuickActions,
  QuickActionsFab,
} from "@/components/dashboard/quick-actions"
import {
  useDashboard,
  type SalesRange,
} from "@/features/dashboard/hooks/use-dashboard-queries"
import AdminDashboardLoading from "./loading"

export default function AdminDashboardPage() {
  const [range, setRange] = useState<SalesRange>("7d")
  const { data, isLoading, error } = useDashboard(range)

  if (isLoading || !data) {
    if (error) {
      return (
        <div className="flex min-h-[60vh] items-center justify-center p-6">
          <p className="text-sm text-destructive">Gagal memuat data dashboard. Silakan coba lagi.</p>
        </div>
      )
    }
    return <AdminDashboardLoading />
  }

  return (
    <div className="flex flex-col gap-6 p-4 lg:p-6 min-w-0">
      <QuickActionsFab />

      {/* Stat Cards - Full Row */}
      <StatCards stats={data.stats} />

      {/* Main Content & Right Panel Grid */}
      <div className="flex flex-col gap-6 xl:flex-row min-w-0">
        {/* Main Content */}
        <div className="flex flex-1 flex-col gap-6 min-w-0 overflow-hidden">
          {/* Charts Row */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <SalesChart data={data.salesChart} range={range} onRangeChange={setRange} />
            <CategoryChart data={data.categoryChart} />
          </div>

          {/* Actions & Transactions Row */}
          <div className="flex flex-col gap-6 2xl:flex-row min-w-0">
            {/* Left Column: Quick Actions + Payment Methods */}
            <div className="flex flex-col gap-6 2xl:w-[300px] 2xl:shrink-0">
              <QuickActions />
              <PaymentMethods methods={data.paymentMethods} />
            </div>

            {/* Right Column: Recent Transactions */}
            <div className="flex-1 min-w-0">
              <RecentTransactions transactions={data.recentTransactions} />
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="flex w-full flex-col gap-6 lg:grid lg:grid-cols-2 xl:flex xl:w-[320px] xl:shrink-0 2xl:w-[350px]">
          <LowStockPanel items={data.lowStock} />
          <BestSellersPanel items={data.bestSellers} />
        </div>
      </div>
    </div>
  )
}
