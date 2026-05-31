"use client"

import { useQuery } from "@tanstack/react-query"

import type { KategoriPageData } from "../types"

async function fetchKategoriData(): Promise<KategoriPageData> {
  const res = await fetch("/api/kategori")
  if (!res.ok) {
    throw new Error("Gagal memuat data kategori")
  }

  const categories = await res.json()
  return {
    categories,
    stats: {
      totalCategories: categories.length,
      usedCategories: categories.filter((category: { productCount: number }) => category.productCount > 0).length,
      emptyCategories: categories.filter((category: { productCount: number }) => category.productCount === 0).length,
      totalProducts: categories.reduce(
        (total: number, category: { productCount: number }) => total + category.productCount,
        0
      ),
    },
  }
}

export function useKategori(initialData?: KategoriPageData) {
  return useQuery({
    queryKey: ["kategori"],
    queryFn: fetchKategoriData,
    initialData,
  })
}
