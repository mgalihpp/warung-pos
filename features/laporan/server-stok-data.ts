import "server-only"

import { prisma } from "@/lib/prisma"

export async function getLaporanStokData() {
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

  const items = products.map((product) => {
    const status: "OK" | "LOW" | "OUT" =
      product.stock <= 0
        ? "OUT"
        : product.stock <= product.minStock
          ? "LOW"
          : "OK"

    return {
      id: product.id,
      name: product.name,
      unit: product.unit,
      image: product.image,
      stock: product.stock,
      minStock: product.minStock,
      buyPrice: product.buyPrice,
      sellPrice: product.sellPrice,
      categoryId: product.category.id,
      categoryName: product.category.name,
      status,
      nilaiStok: product.stock * product.buyPrice,
    }
  })

  const totalBarang = items.length
  const stokMenipis = items.filter((item) => item.status === "LOW").length
  const stokHabis = items.filter((item) => item.status === "OUT").length
  const nilaiStok = items.reduce((total, item) => total + item.nilaiStok, 0)

  const categories = Array.from(
    new Map(items.map((item) => [item.categoryId, item.categoryName])).entries()
  ).map(([id, name]) => ({ id, name }))

  return {
    stats: { totalBarang, stokMenipis, stokHabis, nilaiStok },
    items,
    categories,
  }
}
