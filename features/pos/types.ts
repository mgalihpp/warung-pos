export type PosPageData = {
  products: {
    id: string
    name: string
    categoryId: string
    categoryName: string
    image: string | null
    unit: string
    stock: number
    buyPrice: number
    sellPrice: number
  }[]
  categories: {
    id: string
    name: string
    slug: string
  }[]
  lowStockCount: number
  recentTransactions: RecentTransaction[]
}

export type RecentTransaction = {
  id: string
  transactionNumber: string
  total: number
  cashierName: string
  createdAt: string
  itemCount: number
}
