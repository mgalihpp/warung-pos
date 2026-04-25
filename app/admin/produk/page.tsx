import { ProdukHeader } from "@/components/produk/produk-header"
import { ProdukStatCards } from "@/components/produk/produk-stat-cards"
import { ProdukTable } from "@/components/produk/produk-table"
import { ProdukKategoriChart } from "@/components/produk/produk-kategori-chart"
import { ProdukPopuler } from "@/components/produk/produk-populer"
import { ProdukAktivitas } from "@/components/produk/produk-aktivitas"
import { prisma } from "@/lib/prisma"

const chartColors = ["#16a34a", "#3b82f6", "#f59e0b", "#f43f5e", "#8b5cf6", "#94a3b8"]

function formatActivityTime(date: Date) {
  return new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)
}

export default async function ProdukPage() {
  const [products, categories, popularRows, activities] = await Promise.all([
    prisma.product.findMany({
      include: { category: true },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.category.findMany({
      include: { _count: { select: { products: true } } },
      orderBy: { name: "asc" },
    }),
    prisma.transactionItem.groupBy({
      by: ["productId", "productName"],
      _sum: { quantity: true, subtotal: true },
      orderBy: { _sum: { quantity: "desc" } },
      take: 5,
    }),
    prisma.stockAdjustment.findMany({
      include: { product: true },
      orderBy: { createdAt: "desc" },
      take: 4,
    }),
  ])

  const activeProducts = products.filter((product) => product.isActive)
  const productItems = products.map((product) => ({
    id: product.id,
    name: product.name,
    categoryId: product.categoryId,
    category: product.category.name,
    unit: product.unit,
    stock: product.stock,
    minStock: product.minStock,
    buyPrice: product.buyPrice,
    sellPrice: product.sellPrice,
    description: product.description,
    isActive: product.isActive,
    updatedAt: product.updatedAt.toISOString(),
  }))

  const categoryItems = categories.map((category) => ({
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description,
    productCount: category._count.products,
  }))

  const stats = {
    totalProducts: activeProducts.length,
    totalCategories: categories.length,
    lowStock: activeProducts.filter((product) => product.stock <= product.minStock).length,
    inactiveProducts: products.filter((product) => !product.isActive).length,
  }

  const categoryChartData = categories
    .map((category, index) => ({
      name: category.name,
      value: products.filter((product) => product.categoryId === category.id && product.isActive).length,
      fill: chartColors[index % chartColors.length],
    }))
    .filter((category) => category.value > 0)

  const popularProducts = popularRows.map((row, index) => {
    const product = products.find((item) => item.id === row.productId)

    return {
      rank: index + 1,
      name: row.productName,
      sold: row._sum.quantity ?? 0,
      unit: product?.unit ?? "pcs",
      revenue: row._sum.subtotal ?? 0,
    }
  })

  const activityItems = activities.map((activity) => ({
    id: activity.id,
    label: activity.type === "IN" ? "Stok ditambahkan" : "Stok dikoreksi",
    product: `${activity.product.name} (${activity.stockBefore} -> ${activity.stockAfter})`,
    time: formatActivityTime(activity.createdAt),
    type: "stock" as const,
  }))

  return (
    <div className="flex flex-col gap-3 p-4 lg:gap-6 lg:p-6 min-w-0">
      {/* Header */}
      <ProdukHeader categories={categoryItems} />

      {/* Stat Cards */}
      <ProdukStatCards stats={stats} />

      {/* Main Content & Right Panel */}
      <div className="flex flex-col gap-6 xl:flex-row min-w-0">
        {/* Left: Table */}
        <div className="flex flex-1 flex-col gap-6 min-w-0 overflow-hidden">
          <ProdukTable products={productItems} categories={categoryItems} />
          {/* <ProdukAktivitas activities={activityItems} /> */}
        </div>

        {/* Right Panel */}
        <div className="flex w-full flex-col gap-6 lg:grid lg:grid-cols-2 xl:flex xl:w-[320px] xl:shrink-0 2xl:w-[350px]">
          <ProdukKategoriChart data={categoryChartData} total={stats.totalProducts} />
          <ProdukPopuler products={popularProducts} />
        </div>
      </div>
    </div>
  )
}
