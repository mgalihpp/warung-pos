import { NextResponse } from "next/server"

import { requireCashierOrAdmin } from "@/lib/server/auth-guards"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const user = await requireCashierOrAdmin()
  if (!user) {
    return NextResponse.json({ error: "Tidak memiliki akses" }, { status: 403 })
  }

  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      where: { isActive: true },
      include: { category: true },
      orderBy: { name: "asc" },
    }),
    prisma.category.findMany({
      where: {
        products: { some: { isActive: true } },
      },
      orderBy: { name: "asc" },
    }),
  ])

  // Count low-stock products: stock > 0 AND stock <= minStock (from DB)
  const lowStockProducts = products.filter(
    (p) => p.stock > 0 && p.stock <= p.minStock
  ).length

  const productItems = products.map((product) => ({
    id: product.id,
    name: product.name,
    categoryId: product.categoryId,
    categoryName: product.category.name,
    image: product.image,
    unit: product.unit,
    stock: product.stock,
    buyPrice: product.buyPrice,
    sellPrice: product.sellPrice,
  }))

  const categoryItems = categories.map((category) => ({
    id: category.id,
    name: category.name,
    slug: category.slug,
  }))

  return NextResponse.json({
    products: productItems,
    categories: categoryItems,
    lowStockCount: lowStockProducts,
  })
}
