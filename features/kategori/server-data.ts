import "server-only"

import { prisma } from "@/lib/prisma"

export async function getKategoriPageData() {
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

  return {
    categories: categoryItems,
    stats: {
      totalCategories: categories.length,
      usedCategories: categories.filter((category) => category._count.products > 0).length,
      emptyCategories: categories.filter((category) => category._count.products === 0).length,
      totalProducts: categories.reduce((total, category) => total + category._count.products, 0),
    },
  }
}
