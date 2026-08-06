import { NextResponse } from "next/server"

import { requireAdmin } from "@/lib/server/auth-guards"
import { prisma } from "@/lib/prisma"
import { categorySchema } from "@/lib/schemas/barang"

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

function isUniqueConstraintError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "P2002"
  )
}

export async function GET() {
  const user = await requireAdmin()
  if (!user) {
    return NextResponse.json({ error: "Tidak memiliki akses" }, { status: 403 })
  }

  const categories = await prisma.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { name: "asc" },
  })

  const categoryItems = categories.map((category) => ({
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description,
    productCount: category._count.products,
  }))

  return NextResponse.json(categoryItems)
}

export async function POST(request: Request) {
  const user = await requireAdmin()
  if (!user) {
    return NextResponse.json({ error: "Tidak memiliki akses" }, { status: 403 })
  }

  const body = await request.json()
  const result = categorySchema.safeParse(body)

  if (!result.success) {
    const errors: Record<string, string[]> = {}
    for (const err of result.error.issues) {
      const field = err.path[0] as string
      if (!errors[field]) errors[field] = []
      errors[field].push(err.message)
    }
    return NextResponse.json({ success: false, errors }, { status: 400 })
  }

  const existing = await prisma.category.findUnique({
    where: { name: result.data.name },
    select: { id: true },
  })
  if (existing) {
    return NextResponse.json(
      { success: false, error: "Nama kategori sudah terdaftar" },
      { status: 409 }
    )
  }

  try {
    await prisma.category.create({
      data: {
        name: result.data.name,
        slug: await uniqueCategorySlug(result.data.name),
        description: result.data.description ?? null,
      },
    })
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return NextResponse.json(
        { success: false, error: "Nama kategori sudah terdaftar" },
        { status: 409 }
      )
    }
    throw error
  }

  return NextResponse.json({ success: true })
}
