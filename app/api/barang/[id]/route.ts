import { NextResponse } from "next/server"

import { requireAdmin } from "@/lib/server/auth-guards"
import { prisma } from "@/lib/prisma"
import { updateProductSchema } from "@/lib/schemas/barang"

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

type RouteContext = { params: Promise<{ id: string }> }

export async function PUT(request: Request, context: RouteContext) {
  const user = await requireAdmin()
  if (!user) {
    return NextResponse.json({ error: "Tidak memiliki akses" }, { status: 403 })
  }

  const { id } = await context.params
  if (!id) {
    return NextResponse.json({ error: "ID barang tidak valid" }, { status: 400 })
  }

  const body = await request.json()

  const categoryId = await resolveCategoryId(body.categoryId, body.categoryName)
  if (!categoryId) {
    return NextResponse.json(
      { success: false, errors: { categoryId: ["Kategori wajib dipilih"] } },
      { status: 400 }
    )
  }

  const result = updateProductSchema.safeParse({
    ...body,
    id,
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

  await prisma.product.update({
    where: { id },
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

export async function DELETE(_request: Request, context: RouteContext) {
  const user = await requireAdmin()
  if (!user) {
    return NextResponse.json({ error: "Tidak memiliki akses" }, { status: 403 })
  }

  const { id } = await context.params
  if (!id) {
    return NextResponse.json({ error: "ID barang tidak valid" }, { status: 400 })
  }

  const [transactionItems, stockAdjustments] = await Promise.all([
    prisma.transactionItem.count({ where: { productId: id } }),
    prisma.stockAdjustment.count({ where: { productId: id } }),
  ])

  if (transactionItems > 0 || stockAdjustments > 0) {
    await prisma.product.update({
      where: { id },
      data: { isActive: false },
    })
  } else {
    await prisma.product.delete({ where: { id } })
  }

  return NextResponse.json({ success: true })
}

export async function PATCH(request: Request, context: RouteContext) {
  const user = await requireAdmin()
  if (!user) {
    return NextResponse.json({ error: "Tidak memiliki akses" }, { status: 403 })
  }

  const { id } = await context.params
  if (!id) {
    return NextResponse.json({ error: "ID barang tidak valid" }, { status: 400 })
  }

  const body = await request.json()

  // Toggle active
  if (body.action === "toggleActive") {
    await prisma.product.update({
      where: { id },
      data: { isActive: body.isActive },
    })

    return NextResponse.json({ success: true })
  }

  // Adjust stock
  if (body.action === "adjustStock") {
    const { mode, quantity, reason } = body

    if (!Number.isFinite(quantity) || quantity < 0) {
      return NextResponse.json({ error: "Jumlah tidak valid" }, { status: 400 })
    }

    await prisma.$transaction(async (tx) => {
      const product = await tx.product.findUnique({ where: { id } })
      if (!product) {
        throw new Error("Barang tidak ditemukan")
      }

      const wholeQuantity = Math.trunc(quantity)
      const stockAfter = mode === "set" ? wholeQuantity : product.stock + wholeQuantity
      if (stockAfter < 0) {
        throw new Error("Stok tidak boleh negatif")
      }

      await tx.product.update({
        where: { id },
        data: { stock: stockAfter },
      })

      await tx.stockAdjustment.create({
        data: {
          productId: id,
          userId: user.id,
          type: mode === "set" ? "CORRECTION" : "IN",
          quantity: wholeQuantity,
          stockBefore: product.stock,
          stockAfter,
          reason: reason || (mode === "set" ? "Koreksi stok" : "Restok barang"),
        },
      })
    })

    return NextResponse.json({ success: true })
  }

  return NextResponse.json({ error: "Aksi tidak valid" }, { status: 400 })
}
