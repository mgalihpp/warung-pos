export type BarangCategory = {
  id: string
  name: string
  slug: string
  description: string | null
  productCount: number
}

export type BarangItem = {
  id: string
  name: string
  categoryId: string
  category: string
  image: string | null
  unit: string
  stock: number
  minStock: number
  buyPrice: number
  sellPrice: number
  description: string | null
  isActive: boolean
  updatedAt: string
}

export type BarangStats = {
  totalProducts: number
  totalCategories: number
  lowStock: number
  inactiveProducts: number
}

export type BarangCategoryChartItem = {
  name: string
  value: number
  fill: string
}

export type BarangPopularItem = {
  rank: number
  name: string
  image: string | null
  sold: number
  unit: string
  revenue: number
}

export type BarangActivityItem = {
  id: string
  label: string
  product: string
  time: string
  type: "added" | "stock" | "updated"
}
