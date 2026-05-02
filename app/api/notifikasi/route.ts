import { NextResponse } from "next/server"

import { prisma } from "@/lib/prisma"
import { requireCashierOrAdmin } from "@/lib/server/auth-guards"

function formatRelativeTime(date: Date) {
  const diffMs = Date.now() - date.getTime()
  const diffMinutes = Math.max(0, Math.floor(diffMs / 60000))

  if (diffMinutes < 1) return "Baru saja"
  if (diffMinutes < 60) return `${diffMinutes}m lalu`

  const diffHours = Math.floor(diffMinutes / 60)
  if (diffHours < 24) return `${diffHours}j lalu`

  const diffDays = Math.floor(diffHours / 24)
  return `${diffDays}h lalu`
}

export async function GET() {
  const user = await requireCashierOrAdmin()
  if (!user) {
    return NextResponse.json({ error: "Tidak memiliki akses" }, { status: 403 })
  }

  const lowStockProducts = await prisma.product.findMany({
    where: {
      isActive: true,
      OR: [{ stock: { lte: 0 } }, { stock: { lte: prisma.product.fields.minStock } }],
    },
    orderBy: [{ stock: "asc" }, { name: "asc" }],
    take: 6,
    select: {
      id: true,
      name: true,
      image: true,
      unit: true,
      stock: true,
      minStock: true,
      updatedAt: true,
    },
  })

  const stockNotifications = lowStockProducts.map((product) => ({
    id: `stock-${product.id}`,
    type: product.stock <= 0 ? "stock-out" : "stock-low",
    title: product.stock <= 0 ? `${product.name} Habis` : `${product.name} Menipis`,
    image: product.image,
    description:
      product.stock <= 0
        ? `Stok habis, perlu restok segera.`
        : `Sisa ${product.stock} ${product.unit}, batas minimum ${product.minStock}.`,
    time: formatRelativeTime(product.updatedAt),
    href: "/admin/produk",
    priority: product.stock <= 0 ? 0 : 1,
    createdAt: product.updatedAt.toISOString(),
  }))

  const items = stockNotifications
    .sort((a, b) => a.priority - b.priority || Date.parse(b.createdAt) - Date.parse(a.createdAt))
    .slice(0, 6)

  return NextResponse.json({ count: items.length, items })
}
