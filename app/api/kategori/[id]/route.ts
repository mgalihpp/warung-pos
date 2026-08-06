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

type RouteContext = { params: Promise<{ id: string }> }

export async function PUT(request: Request, context: RouteContext) {
  const user = await requireAdmin()
  if (!user) {
    return NextResponse.json({ error: "Tidak memiliki akses" }, { status: 403 })
  }

  const { id } = await context.params
  if (!id) {
    return NextResponse.json(
      { error: "ID kategori tidak valid" },
      { status: 400 }
    )
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

  const category = await prisma.category.findUnique({ where: { id } })
  if (!category) {
    return NextResponse.json(
      { error: "Kategori tidak ditemukan" },
      { status: 404 }
    )
  }

  const existing = await prisma.category.findUnique({
    where: { name: result.data.name },
    select: { id: true },
  })
  if (existing && existing.id !== id) {
    return NextResponse.json(
      { success: false, error: "Nama kategori sudah terdaftar" },
      { status: 409 }
    )
  }

  try {
    await prisma.category.update({
      where: { id },
      data: {
        name: result.data.name,
        slug: await uniqueCategorySlug(result.data.name, id),
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

export async function DELETE(_request: Request, context: RouteContext) {
  const user = await requireAdmin()
  if (!user) {
    return NextResponse.json({ error: "Tidak memiliki akses" }, { status: 403 })
  }

  const { id } = await context.params
  if (!id) {
    return NextResponse.json(
      { error: "ID kategori tidak valid" },
      { status: 400 }
    )
  }

  const productCount = await prisma.product.count({ where: { categoryId: id } })
  if (productCount > 0) {
    return NextResponse.json(
      {
        success: false,
        error: "Kategori masih digunakan barang dan tidak bisa dihapus",
      },
      { status: 400 }
    )
  }

  await prisma.category.delete({ where: { id } })

  return NextResponse.json({ success: true })
}
