"use client"

import { useQuery } from "@tanstack/react-query"

// ── Shared types ──

export type LaporanRange = "7d" | "30d" | "ytd"

export type StatBlock = {
  value: number
  change: number | null
}

// ── Penjualan ──

export type PenjualanStats = {
  penjualan: StatBlock
  labaKotor: StatBlock
  totalTransaksi: StatBlock
  rataBelanja: StatBlock
}

export type SalesTrendPoint = { date: string; penjualan: number; laba: number }

export type CategoryItem = {
  name: string
  value: number
  pct: number
  fill: string
}

export type PaymentItem = {
  name: "Tunai" | "QRIS" | "Transfer"
  amount: number
  percentage: number
}

export type TopProductItem = {
  id: string
  name: string
  unit: string
  image: string | null
  sold: number
  revenue: number
}

export type TopCashierItem = {
  id: string
  name: string
  count: number
  revenue: number
}

export type DailySummaryRow = {
  dateKey: string
  date: string
  transaksi: number
  penjualan: number
  laba: number
  rataBelanja: number
}

export type PenjualanData = {
  range: LaporanRange
  stats: PenjualanStats
  salesTrend: SalesTrendPoint[]
  dailySummary: DailySummaryRow[]
  categoryBreakdown: CategoryItem[]
  paymentMethods: PaymentItem[]
  topProducts: TopProductItem[]
  topCashiers: TopCashierItem[]
}

async function fetchPenjualan(range: LaporanRange): Promise<PenjualanData> {
  const res = await fetch(`/api/laporan/penjualan?range=${range}`)
  if (!res.ok) throw new Error("Gagal memuat laporan penjualan")
  return res.json()
}

export function useLaporanPenjualan(range: LaporanRange = "30d", initialData?: PenjualanData) {
  return useQuery({
    queryKey: ["laporan", "penjualan", range],
    queryFn: () => fetchPenjualan(range),
    initialData: initialData?.range === range ? initialData : undefined,
  })
}

// ── Stok ──

export type StokStats = {
  totalBarang: number
  stokMenipis: number
  stokHabis: number
  nilaiStok: number
}

export type StokItem = {
  id: string
  name: string
  unit: string
  image: string | null
  stock: number
  minStock: number
  buyPrice: number
  sellPrice: number
  categoryId: string
  categoryName: string
  status: "OK" | "LOW" | "OUT"
  nilaiStok: number
}

export type StokData = {
  stats: StokStats
  items: StokItem[]
  categories: { id: string; name: string }[]
}

async function fetchStok(): Promise<StokData> {
  const res = await fetch("/api/laporan/stok")
  if (!res.ok) throw new Error("Gagal memuat laporan stok")
  return res.json()
}

export function useLaporanStok(initialData?: StokData) {
  return useQuery({ queryKey: ["laporan", "stok"], queryFn: fetchStok, initialData })
}

// ── Kas ──

export type KasBreakdownItem = {
  name: "Tunai" | "QRIS" | "Transfer"
  method: "CASH" | "QRIS_MANUAL" | "MANUAL_TRANSFER"
  amount: number
  count: number
  percentage: number
}

export type KasTransaction = {
  id: string
  transactionNumber: string
  cashierName: string
  paymentMethod: "Tunai" | "QRIS" | "Transfer"
  status: "COMPLETED" | "PENDING" | "CANCELLED"
  total: number
  waktu: string
}

export type KasRiwayatRow = {
  tanggal: string
  label: string
  transaksi: number
  tunai: number
  nontunai: number
  total: number
}

export type KasData = {
  date: string
  dateLabel: string
  isToday: boolean
  summary: {
    totalPenjualan: number
    totalCount: number
    tunaiMasuk: number
    nonTunai: number
  }
  breakdown: KasBreakdownItem[]
  transactions: KasTransaction[]
  riwayat: KasRiwayatRow[]
}

async function fetchKas(date: string | null): Promise<KasData> {
  const qs = date ? `?date=${date}` : ""
  const res = await fetch(`/api/laporan/kas${qs}`)
  if (!res.ok) throw new Error("Gagal memuat laporan kas")
  return res.json()
}

export function useLaporanKas(date: string | null = null) {
  return useQuery({
    queryKey: ["laporan", "kas", date ?? "today"],
    queryFn: () => fetchKas(date),
  })
}

// ── Kasir ──

export type KasirRow = {
  id: string
  name: string
  image: string | null
  revenue: number
  count: number
  profit: number
  avgTicket: number
  revenueChange: number | null
  countChange: number | null
  lastActiveAt: string | null
}

export type KasirData = {
  range: LaporanRange
  summary: {
    totalRevenue: number
    totalCount: number
    totalProfit: number
    activeCashiers: number
  }
  cashiers: KasirRow[]
}

async function fetchKasir(range: LaporanRange): Promise<KasirData> {
  const res = await fetch(`/api/laporan/kasir?range=${range}`)
  if (!res.ok) throw new Error("Gagal memuat laporan kasir")
  return res.json()
}

export function useLaporanKasir(range: LaporanRange = "30d") {
  return useQuery({
    queryKey: ["laporan", "kasir", range],
    queryFn: () => fetchKasir(range),
  })
}
