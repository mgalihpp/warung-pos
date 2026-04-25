"use server"

import { headers } from "next/headers"
import { revalidatePath } from "next/cache"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

async function requireAdmin() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (session?.user.role !== "admin") {
    return null
  }

  return session.user
}

function text(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim()
}

function numberValue(formData: FormData, key: string) {
  const value = Number(formData.get(key))
  return Number.isFinite(value) ? value : null
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

async function resolveCategoryId(formData: FormData) {
  const categoryId = text(formData, "categoryId")
  const categoryName = text(formData, "categoryName")

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

export async function createCategory(formData: FormData) {
  const user = await requireAdmin()
  if (!user) return

  const name = text(formData, "name")
  const description = text(formData, "description")

  if (!name) return

  await prisma.category.create({
    data: {
      name,
      slug: await uniqueCategorySlug(name),
      description: description || null,
    },
  })

  revalidatePath("/admin/produk")
}

export async function updateCategory(formData: FormData) {
  const user = await requireAdmin()
  if (!user) return

  const id = text(formData, "id")
  const name = text(formData, "name")
  const description = text(formData, "description")

  if (!id || !name) return

  await prisma.category.update({
    where: { id },
    data: {
      name,
      slug: await uniqueCategorySlug(name, id),
      description: description || null,
    },
  })

  revalidatePath("/admin/produk")
}

export async function deleteCategory(formData: FormData) {
  const user = await requireAdmin()
  if (!user) return

  const id = text(formData, "id")
  if (!id) return

  const productCount = await prisma.product.count({ where: { categoryId: id } })
  if (productCount > 0) return

  await prisma.category.delete({ where: { id } })

  revalidatePath("/admin/produk")
}

function productData(formData: FormData, categoryIdOverride?: string) {
  const name = text(formData, "name")
  const categoryId = categoryIdOverride ?? text(formData, "categoryId")
  const unit = text(formData, "unit")
  const description = text(formData, "description")
  const stock = numberValue(formData, "stock")
  const minStock = numberValue(formData, "minStock")
  const buyPrice = numberValue(formData, "buyPrice")
  const sellPrice = numberValue(formData, "sellPrice")
  const isActive = formData.get("isActive") !== "off"
  const image = text(formData, "image") || null

  if (
    !name ||
    !categoryId ||
    !unit ||
    stock === null ||
    minStock === null ||
    buyPrice === null ||
    sellPrice === null ||
    stock < 0 ||
    minStock < 0 ||
    buyPrice < 0 ||
    sellPrice < 0
  ) {
    return null
  }

  return {
    name,
    categoryId,
    image,
    unit,
    stock: Math.trunc(stock),
    minStock: Math.trunc(minStock),
    buyPrice,
    sellPrice,
    description: description || null,
    isActive,
  }
}

export async function createProduct(formData: FormData) {
  const user = await requireAdmin()
  if (!user) return

  const data = productData(formData, await resolveCategoryId(formData))
  if (!data) return

  await prisma.product.create({ data })

  revalidatePath("/admin/produk")
}

export async function updateProduct(formData: FormData) {
  const user = await requireAdmin()
  if (!user) return

  const id = text(formData, "id")
  const data = productData(formData, await resolveCategoryId(formData))

  if (!id || !data) return

  await prisma.product.update({ where: { id }, data })

  revalidatePath("/admin/produk")
}

export async function setProductActive(formData: FormData) {
  const user = await requireAdmin()
  if (!user) return

  const id = text(formData, "id")
  const isActive = formData.get("isActive") === "true"

  if (!id) return

  await prisma.product.update({
    where: { id },
    data: { isActive },
  })

  revalidatePath("/admin/produk")
}

export async function deleteProduct(formData: FormData) {
  const user = await requireAdmin()
  if (!user) return

  const id = text(formData, "id")
  if (!id) return

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

  revalidatePath("/admin/produk")
}

export async function adjustStock(formData: FormData) {
  const user = await requireAdmin()
  if (!user) return

  const productId = text(formData, "productId")
  const mode = text(formData, "mode")
  const quantity = numberValue(formData, "quantity")
  const reason = text(formData, "reason")

  if (!productId || quantity === null || quantity < 0) return

  await prisma.$transaction(async (tx) => {
    const product = await tx.product.findUnique({ where: { id: productId } })
    if (!product) return

    const wholeQuantity = Math.trunc(quantity)
    const stockAfter = mode === "set" ? wholeQuantity : product.stock + wholeQuantity
    if (stockAfter < 0) return

    await tx.product.update({
      where: { id: productId },
      data: { stock: stockAfter },
    })

    await tx.stockAdjustment.create({
      data: {
        productId,
        userId: user.id,
        type: mode === "set" ? "CORRECTION" : "IN",
        quantity: wholeQuantity,
        stockBefore: product.stock,
        stockAfter,
        reason: reason || (mode === "set" ? "Koreksi stok" : "Restok produk"),
      },
    })
  })

  revalidatePath("/admin/produk")
}
