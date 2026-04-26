"use client"

import { useQuery } from "@tanstack/react-query"
import type {
  ProdukItem,
  ProdukCategory,
  ProdukStats,
  ProdukCategoryChartItem,
  ProdukPopularItem,
} from "../types"

export type ProdukPageData = {
  products: ProdukItem[]
  categories: ProdukCategory[]
  stats: ProdukStats
  categoryChartData: ProdukCategoryChartItem[]
  popularProducts: ProdukPopularItem[]
}

async function fetchProdukData(): Promise<ProdukPageData> {
  const res = await fetch("/api/produk")
  if (!res.ok) {
    throw new Error("Gagal memuat data produk")
  }
  return res.json()
}

export function useProducts() {
  return useQuery({
    queryKey: ["produk"],
    queryFn: fetchProdukData,
  })
}
