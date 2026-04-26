"use client"

import { useQuery } from "@tanstack/react-query"

// ── Types ──

export type TransactionStatus = "Selesai" | "Pending" | "Dibatalkan"
export type PaymentMethod = "Tunai" | "QRIS" | "Transfer"

export type TransactionItem = {
  id: string
  transactionNumber: string
  waktu: string
  kasir: string
  kasirImage: string | null
  item: string
  metode: PaymentMethod
  total: number
  status: TransactionStatus
}

export type TransactionStats = {
  todayCount: number
  todayTrend: number | null
  todaySales: number
  salesTrend: number | null
  soldProductsCount: number
  avgTransaction: number
}

export type TransactionActivity = {
  type: "completed" | "pending" | "cancelled"
  label: string
  transactionNumber: string
  time: string
}

export type TransaksiPageData = {
  stats: TransactionStats
  transactions: TransactionItem[]
  activities: TransactionActivity[]
  cashierList: string[]
}

// ── Fetcher ──

async function fetchTransaksiData(): Promise<TransaksiPageData> {
  const res = await fetch("/api/transaksi")
  if (!res.ok) {
    throw new Error("Gagal memuat data transaksi")
  }
  return res.json()
}

// ── Hook ──

export function useTransactions() {
  return useQuery({
    queryKey: ["transaksi"],
    queryFn: fetchTransaksiData,
  })
}
