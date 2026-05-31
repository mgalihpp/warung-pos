"use client"

import { useQuery } from "@tanstack/react-query"

// ── Types ──

export type TransactionStatus = "Selesai" | "Pending" | "Dibatalkan"
export type PaymentMethod = "Tunai" | "QRIS" | "Transfer"

export type TransactionItem = {
  id: string
  transactionNumber: string
  waktu: string
  createdAt: string
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

// ── Detail Types ──

export type TransactionDetailItem = {
  id: string
  productId: string
  productName: string
  productImage: string | null
  unitPrice: number
  quantity: number
  subtotal: number
  grossProfit: number
}

export type TransactionDetail = {
  id: string
  transactionNumber: string
  waktu: string
  kasir: string
  kasirImage: string | null
  metode: PaymentMethod
  status: TransactionStatus
  subtotal: number
  total: number
  amountPaid: number
  change: number
  notes: string | null
  items: TransactionDetailItem[]
}

// ── Detail Fetcher ──

async function fetchTransactionDetail(id: string): Promise<TransactionDetail> {
  const res = await fetch(`/api/transaksi/${id}`)
  if (!res.ok) {
    throw new Error("Gagal memuat detail transaksi")
  }
  return res.json()
}

// ── Detail Hook ──

export function useTransactionDetail(
  id: string | null,
  initialData?: TransactionDetail
) {
  return useQuery({
    queryKey: ["transaksi", "detail", id],
    queryFn: () => fetchTransactionDetail(id!),
    enabled: !!id,
    initialData,
  })
}
