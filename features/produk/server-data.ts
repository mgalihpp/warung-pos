import "server-only"

import { prisma } from "@/lib/prisma"

const chartColors = ["#16a34a", "#3b82f6", "#f59e0b", "#f43f5e", "#8b5cf6", "#94a3b8"]

export async function getProdukPageData() {
  const [products, categories, popularRows] = await Promise.all([
    prisma.product.findMany({
      include: { category: true },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.category.findMany({
      include: { _count: { select: { products: true } } },
      orderBy: { name: "asc" },
    }),
    prisma.transactionItem.groupBy({
      by: ["productId", "productName"],
      _sum: { quantity: true, subtotal: true },
      orderBy: { _sum: { quantity: "desc" } },
      take: 5,
    }),
  ])

  const activeProducts = products.filter((product) => product.isActive)
  const units = [...new Set(products.map((product) => product.unit).filter(Boolean))].sort((a, b) =>
    a.localeCompare(b)
  )

  const productItems = products.map((product) => ({
    id: product.id,
    name: product.name,
    categoryId: product.categoryId,
    category: product.category.name,
    image: product.image,
    unit: product.unit,
    stock: product.stock,
    minStock: product.minStock,
    buyPrice: product.buyPrice,
    sellPrice: product.sellPrice,
    description: product.description,
    isActive: product.isActive,
    updatedAt: product.updatedAt.toISOString(),
  }))

  const categoryItems = categories.map((category) => ({
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description,
    productCount: category._count.products,
  }))

  const stats = {
    totalProducts: activeProducts.length,
    totalCategories: categories.length,
    lowStock: activeProducts.filter((product) => product.stock > 0 && product.stock <= product.minStock).length,
    inactiveProducts: products.filter((product) => !product.isActive).length,
  }

  const categoryChartData = categories
    .map((category, index) => ({
      name: category.name,
      value: products.filter((product) => product.categoryId === category.id && product.isActive).length,
      fill: chartColors[index % chartColors.length],
    }))
    .filter((category) => category.value > 0)

  const popularProducts = popularRows.map((row, index) => {
    const product = products.find((item) => item.id === row.productId)

    return {
      rank: index + 1,
      name: row.productName,
      image: product?.image ?? null,
      sold: row._sum.quantity ?? 0,
      unit: product?.unit ?? "pcs",
      revenue: row._sum.subtotal ?? 0,
    }
  })

  return {
    products: productItems,
    categories: categoryItems,
    stats,
    categoryChartData,
    popularProducts,
    units,
  }
}
