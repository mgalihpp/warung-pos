import { NextResponse } from "next/server"
import { headers } from "next/headers"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

async function requireCashierOrAdmin() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user) return null
  if (session.user.role !== "cashier" && session.user.role !== "admin") {
    return null
  }

  return session.user
}

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

  return NextResponse.json({ products: productItems, categories: categoryItems })
}
