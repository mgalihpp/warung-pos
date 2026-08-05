"use client"

import { useQuery } from "@tanstack/react-query"

// ── Types ──

export type SalesRange = "7d" | "30d" | "ytd"

export type StatBlock = {
  value: number
  change?: number | null
  spark: number[]
}

export type DashboardStats = {
  todaySales: StatBlock
  todayCount: StatBlock
  monthSales: StatBlock
  lowStockCount: Omit<StatBlock, "change">
}

export type SalesChartPoint = { date: string; penjualan: number; laba: number }

export type CategoryChartItem = { name: string; value: number; fill: string }

export type PaymentMethodItem = {
  name: "Tunai" | "QRIS" | "Transfer"
  amount: number
  percentage: number
}

export type RecentTransactionItem = {
  no: number
  id: string
  waktu: string
  kasir: string
  kasirImage: string | null
  initials: string
  items: string
  total: number
  status: "Selesai" | "Pending" | "Dibatalkan"
}

export type LowStockItem = {
  id: string
  name: string
  stock: number
  unit: string
  image: string | null
  status: "LOW" | "OUT"
  urgency: "danger" | "warning"
}

export type BestSellerItem = {
  rank: number
  id: string
  name: string
  unit: string
  image: string | null
  sold: number
  revenue: number
}

export type DashboardData = {
  range: SalesRange
  stats: DashboardStats
  salesChart: SalesChartPoint[]
  categoryChart: CategoryChartItem[]
  paymentMethods: PaymentMethodItem[]
  recentTransactions: RecentTransactionItem[]
  lowStock: LowStockItem[]
  bestSellers: BestSellerItem[]
}

// ── Fetcher ──

async function fetchDashboard(range: SalesRange): Promise<DashboardData> {
  const res = await fetch(`/api/dashboard?range=${range}`)
  if (!res.ok) {
    throw new Error("Gagal memuat data dashboard")
  }
  return res.json()
}

// ── Hook ──

export function useDashboard(
  range: SalesRange = "7d",
  initialData?: DashboardData
) {
  return useQuery({
    queryKey: ["dashboard", range],
    queryFn: () => fetchDashboard(range),
    initialData: initialData?.range === range ? initialData : undefined,
  })
}
