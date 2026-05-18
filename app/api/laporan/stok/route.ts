import { NextResponse } from "next/server"

import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/server/auth-guards"

export async function GET() {
  const user = await requireAdmin()
  if (!user) {
    return NextResponse.json({ error: "Tidak memiliki akses" }, { status: 403 })
  }

  const products = await prisma.product.findMany({
    where: { isActive: true },
    orderBy: [{ stock: "asc" }, { name: "asc" }],
    select: {
      id: true,
      name: true,
      unit: true,
      image: true,
      stock: true,
      minStock: true,
      buyPrice: true,
      sellPrice: true,
      category: { select: { id: true, name: true } },
    },
  })

  const items = products.map((p) => {
    const status: "OK" | "LOW" | "OUT" =
      p.stock <= 0 ? "OUT" : p.stock <= p.minStock ? "LOW" : "OK"
    return {
      id: p.id,
      name: p.name,
      unit: p.unit,
      image: p.image,
      stock: p.stock,
      minStock: p.minStock,
      buyPrice: p.buyPrice,
      sellPrice: p.sellPrice,
      categoryId: p.category.id,
      categoryName: p.category.name,
      status,
      nilaiStok: p.stock * p.buyPrice,
    }
  })

  const totalBarang = items.length
  const stokMenipis = items.filter((i) => i.status === "LOW").length
  const stokHabis = items.filter((i) => i.status === "OUT").length
  const nilaiStok = items.reduce((s, i) => s + i.nilaiStok, 0)

  const categories = Array.from(
    new Map(items.map((i) => [i.categoryId, i.categoryName])).entries(),
  ).map(([id, name]) => ({ id, name }))

  return NextResponse.json({
    stats: { totalBarang, stokMenipis, stokHabis, nilaiStok },
    items,
    categories,
  })
}
