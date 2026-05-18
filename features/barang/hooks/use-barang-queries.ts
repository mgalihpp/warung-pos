"use client"

import { useQuery } from "@tanstack/react-query"
import type {
  BarangItem,
  BarangCategory,
  BarangStats,
  BarangCategoryChartItem,
  BarangPopularItem,
} from "../types"

export type BarangPageData = {
  products: BarangItem[]
  categories: BarangCategory[]
  units: string[]
  stats: BarangStats
  categoryChartData: BarangCategoryChartItem[]
  popularProducts: BarangPopularItem[]
}

async function fetchBarangData(): Promise<BarangPageData> {
  const res = await fetch("/api/barang")
  if (!res.ok) {
    throw new Error("Gagal memuat data barang")
  }
  return res.json()
}

export function useProducts() {
  return useQuery({
    queryKey: ["barang"],
    queryFn: fetchBarangData,
  })
}
