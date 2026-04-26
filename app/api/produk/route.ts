import { NextResponse } from "next/server"
import { headers } from "next/headers"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { createProductSchema } from "@/app/admin/produk/schemas"

const chartColors = ["#16a34a", "#3b82f6", "#f59e0b", "#f43f5e", "#8b5cf6", "#94a3b8"]

async function requireAdmin() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (session?.user.role !== "admin") {
    return null
  }

  return session.user
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
}

async function uniqueCategorySlug(name: string, ignoreId?: string) {
  const baseSlug = slugify(name) || "kategori"
  let slug = baseSlug
  let index = 1

  while (true) {
    const existing = await prisma.category.findUnique({ where: { slug } })

    if (!existing || existing.id === ignoreId) {
      return slug
    }

    index += 1
    slug = `${baseSlug}-${index}`
  }
}

async function resolveCategoryId(categoryId?: string, categoryName?: string) {
  if (categoryId) return categoryId
  if (!categoryName) return ""

  const existingCategory = await prisma.category.findFirst({
    where: { name: { equals: categoryName, mode: "insensitive" } },
  })

  if (existingCategory) return existingCategory.id

  const category = await prisma.category.create({
    data: {
      name: categoryName,
      slug: await uniqueCategorySlug(categoryName),
    },
  })

  return category.id
}

export async function GET() {
  const user = await requireAdmin()
  if (!user) {
    return NextResponse.json({ error: "Tidak memiliki akses" }, { status: 403 })
  }

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
    lowStock: activeProducts.filter((product) => product.stock <= product.minStock).length,
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

  return NextResponse.json({
    products: productItems,
    categories: categoryItems,
    stats,
    categoryChartData,
    popularProducts,
  })
}

export async function POST(request: Request) {
  const user = await requireAdmin()
  if (!user) {
    return NextResponse.json({ error: "Tidak memiliki akses" }, { status: 403 })
  }

  const body = await request.json()

  const categoryId = await resolveCategoryId(body.categoryId, body.categoryName)
  if (!categoryId) {
    return NextResponse.json(
      { success: false, errors: { categoryId: ["Kategori wajib dipilih"] } },
      { status: 400 }
    )
  }

  const result = createProductSchema.safeParse({
    ...body,
    categoryId,
    isActive: body.isActive !== "off",
    image: body.image && body.image.trim() !== "" ? body.image.trim() : null,
  })

  if (!result.success) {
    const errors: Record<string, string[]> = {}
    for (const err of result.error.issues) {
      const field = err.path.join(".") as string
      if (!errors[field]) errors[field] = []
      errors[field].push(err.message)
    }
    return NextResponse.json({ success: false, errors }, { status: 400 })
  }

  await prisma.product.create({
    data: {
      name: result.data.name,
      categoryId: result.data.categoryId,
      image: result.data.image,
      unit: result.data.unit,
      stock: result.data.stock,
      minStock: result.data.minStock,
      buyPrice: result.data.buyPrice,
      sellPrice: result.data.sellPrice,
      description: result.data.description ?? null,
      isActive: result.data.isActive,
    },
  })

  return NextResponse.json({ success: true })
}
