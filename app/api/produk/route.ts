import { NextResponse } from "next/server"

import { requireAdmin } from "@/lib/server/auth-guards"
import { prisma } from "@/lib/prisma"
import { createProductSchema } from "@/lib/schemas/produk"
import { getProdukPageData } from "@/features/produk/server-data"


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

  return NextResponse.json(await getProdukPageData())
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
