export type ProdukCategory = {
  id: string
  name: string
  slug: string
  description: string | null
  productCount: number
}

export type ProdukItem = {
  id: string
  name: string
  categoryId: string
  category: string
  unit: string
  stock: number
  minStock: number
  buyPrice: number
  sellPrice: number
  description: string | null
  isActive: boolean
  updatedAt: string
}

export type ProdukStats = {
  totalProducts: number
  totalCategories: number
  lowStock: number
  inactiveProducts: number
}

export type ProdukCategoryChartItem = {
  name: string
  value: number
  fill: string
}

export type ProdukPopularItem = {
  rank: number
  name: string
  sold: number
  unit: string
  revenue: number
}

export type ProdukActivityItem = {
  id: string
  label: string
  product: string
  time: string
  type: "added" | "stock" | "updated"
}
