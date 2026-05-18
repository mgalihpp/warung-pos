export type KategoriItem = {
  id: string
  name: string
  slug: string
  description: string | null
  productCount: number
}

export type KategoriStats = {
  totalCategories: number
  usedCategories: number
  emptyCategories: number
  totalProducts: number
}

export type KategoriPageData = {
  categories: KategoriItem[]
  stats: KategoriStats
}
