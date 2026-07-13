import "server-only"

import { prisma } from "@/lib/prisma"
import { requireCashierOrAdmin } from "@/lib/server/auth-guards"
import type { PosPageData } from "@/features/pos/types"

export async function getPosPageData(): Promise<PosPageData> {
  const user = await requireCashierOrAdmin()

  if (!user) {
    return {
      products: [],
      categories: [],
      lowStockCount: 0,
      recentTransactions: [],
    }
  }

  const [products, categories, recentTransactions] = await Promise.all([
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
    prisma.transaction.findMany({
      where: { cashierId: user.id },
      include: {
        items: {
          select: {
            id: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ])

  return {
    products: products.map((product) => ({
      id: product.id,
      name: product.name,
      categoryId: product.categoryId,
      categoryName: product.category.name,
      image: product.image,
      unit: product.unit,
      stock: product.stock,
      minStock: product.minStock,
      buyPrice: product.buyPrice,
      sellPrice: product.sellPrice,
    })),
    categories: categories.map((category) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
    })),
    lowStockCount: products.filter(
      (product) => product.stock > 0 && product.stock <= product.minStock
    ).length,
    recentTransactions: recentTransactions.map((transaction) => ({
      id: transaction.id,
      transactionNumber: transaction.transactionNumber,
      total: transaction.total,
      cashierName: transaction.cashierName,
      createdAt: transaction.createdAt.toISOString(),
      itemCount: transaction.items.length,
    })),
  }
}
