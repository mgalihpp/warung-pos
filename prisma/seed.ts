import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "@prisma/client"
import { config } from "dotenv"

config({ quiet: true })

const adapter = new PrismaPg({
  connectionString: process.env.DIRECT_URL ?? process.env.DATABASE_URL ?? "",
})

const prisma = new PrismaClient({ adapter })

// ============================================================================
// Kategori Default
// ============================================================================

const categories = [
  {
    name: "Sembako",
    slug: "sembako",
    description: "Beras, minyak, gula, tepung, dll",
  },
  {
    name: "Sabun & Deterjen",
    slug: "sabun-deterjen",
    description: "Sabun mandi, sabun cuci, deterjen, pewangi",
  },
  {
    name: "Rokok",
    slug: "rokok",
    description: "Rokok filter, kretek, dan vape",
  },
  {
    name: "Minuman",
    slug: "minuman",
    description: "Air mineral, susu, kopi, teh, jus",
  },
  {
    name: "Snack",
    slug: "snack",
    description: "Makanan ringan, keripik, biskuit, permen",
  },
  {
    name: "Bumbu Dapur",
    slug: "bumbu-dapur",
    description: "Kecap, saus, sambal, garam, merica",
  },
  {
    name: "Obat & Kesehatan",
    slug: "obat-kesehatan",
    description: "Obat ringan, plester, masker, hand sanitizer",
  },
  {
    name: "ATK & Lainnya",
    slug: "atk-lainnya",
    description: "Alat tulis, baterai, korek api, kantong plastik",
  },
]

// ============================================================================
// Produk Contoh (per kategori)
// ============================================================================

interface ProductSeed {
  name: string
  categorySlug: string
  unit: string
  stock: number
  minStock: number
  buyPrice: number
  sellPrice: number
}

const products: ProductSeed[] = [
  // Sembako
  {
    name: "Beras Premium 5kg",
    categorySlug: "sembako",
    unit: "karung",
    stock: 25,
    minStock: 5,
    buyPrice: 62000,
    sellPrice: 68000,
  },
  {
    name: "Minyak Goreng Bimoli 1L",
    categorySlug: "sembako",
    unit: "botol",
    stock: 40,
    minStock: 10,
    buyPrice: 18000,
    sellPrice: 21000,
  },
  {
    name: "Gula Pasir 1kg",
    categorySlug: "sembako",
    unit: "pcs",
    stock: 30,
    minStock: 8,
    buyPrice: 14000,
    sellPrice: 16000,
  },
  {
    name: "Tepung Terigu Segitiga Biru 1kg",
    categorySlug: "sembako",
    unit: "pcs",
    stock: 20,
    minStock: 5,
    buyPrice: 11000,
    sellPrice: 13000,
  },
  {
    name: "Telur Ayam 1kg",
    categorySlug: "sembako",
    unit: "kg",
    stock: 15,
    minStock: 5,
    buyPrice: 26000,
    sellPrice: 29000,
  },
  {
    name: "Mie Instan Indomie Goreng",
    categorySlug: "sembako",
    unit: "pcs",
    stock: 120,
    minStock: 24,
    buyPrice: 2800,
    sellPrice: 3500,
  },

  // Sabun & Deterjen
  {
    name: "Sabun Lifebuoy 100g",
    categorySlug: "sabun-deterjen",
    unit: "pcs",
    stock: 35,
    minStock: 10,
    buyPrice: 3500,
    sellPrice: 5000,
  },
  {
    name: "Deterjen Rinso 800g",
    categorySlug: "sabun-deterjen",
    unit: "pcs",
    stock: 20,
    minStock: 5,
    buyPrice: 14000,
    sellPrice: 17000,
  },
  {
    name: "Sabun Cuci Piring Sunlight 400ml",
    categorySlug: "sabun-deterjen",
    unit: "botol",
    stock: 18,
    minStock: 5,
    buyPrice: 8000,
    sellPrice: 10000,
  },
  {
    name: "Pewangi Molto Sachet",
    categorySlug: "sabun-deterjen",
    unit: "sachet",
    stock: 60,
    minStock: 15,
    buyPrice: 1000,
    sellPrice: 1500,
  },

  // Rokok
  {
    name: "Gudang Garam Surya 12",
    categorySlug: "rokok",
    unit: "bungkus",
    stock: 50,
    minStock: 10,
    buyPrice: 22000,
    sellPrice: 25000,
  },
  {
    name: "Sampoerna Mild 16",
    categorySlug: "rokok",
    unit: "bungkus",
    stock: 40,
    minStock: 10,
    buyPrice: 28000,
    sellPrice: 31000,
  },
  {
    name: "Djarum Super 12",
    categorySlug: "rokok",
    unit: "bungkus",
    stock: 30,
    minStock: 10,
    buyPrice: 20000,
    sellPrice: 23000,
  },

  // Minuman
  {
    name: "Aqua 600ml",
    categorySlug: "minuman",
    unit: "botol",
    stock: 80,
    minStock: 24,
    buyPrice: 2500,
    sellPrice: 3500,
  },
  {
    name: "Teh Botol Sosro 450ml",
    categorySlug: "minuman",
    unit: "botol",
    stock: 48,
    minStock: 12,
    buyPrice: 3500,
    sellPrice: 5000,
  },
  {
    name: "Susu Ultra Milk 250ml Coklat",
    categorySlug: "minuman",
    unit: "pcs",
    stock: 30,
    minStock: 10,
    buyPrice: 5000,
    sellPrice: 6500,
  },
  {
    name: "Kopi Kapal Api Sachet",
    categorySlug: "minuman",
    unit: "sachet",
    stock: 100,
    minStock: 20,
    buyPrice: 1200,
    sellPrice: 2000,
  },

  // Snack
  {
    name: "Chitato 68g",
    categorySlug: "snack",
    unit: "pcs",
    stock: 24,
    minStock: 6,
    buyPrice: 8000,
    sellPrice: 10000,
  },
  {
    name: "Oreo Original 137g",
    categorySlug: "snack",
    unit: "pcs",
    stock: 18,
    minStock: 5,
    buyPrice: 7500,
    sellPrice: 9500,
  },
  {
    name: "Permen Kopiko Sachet",
    categorySlug: "snack",
    unit: "sachet",
    stock: 50,
    minStock: 10,
    buyPrice: 500,
    sellPrice: 1000,
  },
  {
    name: "Roti Sari Roti Tawar",
    categorySlug: "snack",
    unit: "pcs",
    stock: 10,
    minStock: 3,
    buyPrice: 13000,
    sellPrice: 15000,
  },

  // Bumbu Dapur
  {
    name: "Kecap Manis ABC 135ml",
    categorySlug: "bumbu-dapur",
    unit: "botol",
    stock: 20,
    minStock: 5,
    buyPrice: 6000,
    sellPrice: 8000,
  },
  {
    name: "Saus Sambal ABC 135ml",
    categorySlug: "bumbu-dapur",
    unit: "botol",
    stock: 20,
    minStock: 5,
    buyPrice: 5500,
    sellPrice: 7500,
  },
  {
    name: "Garam Cap Kapal 250g",
    categorySlug: "bumbu-dapur",
    unit: "pcs",
    stock: 30,
    minStock: 8,
    buyPrice: 2500,
    sellPrice: 4000,
  },
  {
    name: "Royco Ayam 100g",
    categorySlug: "bumbu-dapur",
    unit: "sachet",
    stock: 40,
    minStock: 10,
    buyPrice: 3000,
    sellPrice: 4500,
  },

  // Obat & Kesehatan
  {
    name: "Paracetamol Strip",
    categorySlug: "obat-kesehatan",
    unit: "strip",
    stock: 15,
    minStock: 5,
    buyPrice: 3000,
    sellPrice: 5000,
  },
  {
    name: "Masker Medis 3ply (1 box)",
    categorySlug: "obat-kesehatan",
    unit: "dus",
    stock: 8,
    minStock: 3,
    buyPrice: 15000,
    sellPrice: 20000,
  },
  {
    name: "Hansaplast 10s",
    categorySlug: "obat-kesehatan",
    unit: "pcs",
    stock: 12,
    minStock: 5,
    buyPrice: 8000,
    sellPrice: 11000,
  },

  // ATK & Lainnya
  {
    name: "Baterai ABC AA 2pcs",
    categorySlug: "atk-lainnya",
    unit: "pcs",
    stock: 20,
    minStock: 5,
    buyPrice: 8000,
    sellPrice: 10000,
  },
  {
    name: "Korek Api Cricket",
    categorySlug: "atk-lainnya",
    unit: "pcs",
    stock: 25,
    minStock: 5,
    buyPrice: 5000,
    sellPrice: 7000,
  },
  {
    name: "Kantong Plastik Kresek Sedang (50pcs)",
    categorySlug: "atk-lainnya",
    unit: "pak",
    stock: 10,
    minStock: 3,
    buyPrice: 8000,
    sellPrice: 12000,
  },
]

// ============================================================================
// Seed Execution
// ============================================================================

async function main() {
  console.log("🌱 Mulai seeding database...\n")

  // 1. Upsert Kategori
  console.log("📁 Seeding kategori...")
  const categoryMap = new Map<string, string>()

  for (const cat of categories) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, description: cat.description },
      create: cat,
    })
    categoryMap.set(cat.slug, created.id)
    console.log(`   ✓ ${created.name}`)
  }

  // 2. Upsert Produk
  console.log("\n📦 Seeding produk...")
  for (const prod of products) {
    const categoryId = categoryMap.get(prod.categorySlug)
    if (!categoryId) {
      console.log(
        `   ✗ Kategori "${prod.categorySlug}" tidak ditemukan, skip ${prod.name}`
      )
      continue
    }

    // Use upsert by checking name + categoryId combo
    const existing = await prisma.product.findFirst({
      where: { name: prod.name, categoryId },
    })

    if (existing) {
      await prisma.product.update({
        where: { id: existing.id },
        data: {
          unit: prod.unit,
          stock: prod.stock,
          minStock: prod.minStock,
          buyPrice: prod.buyPrice,
          sellPrice: prod.sellPrice,
        },
      })
      console.log(`   ↻ ${prod.name} (updated)`)
    } else {
      await prisma.product.create({
        data: {
          name: prod.name,
          categoryId,
          unit: prod.unit,
          stock: prod.stock,
          minStock: prod.minStock,
          buyPrice: prod.buyPrice,
          sellPrice: prod.sellPrice,
        },
      })
      console.log(`   ✓ ${prod.name}`)
    }
  }

  console.log("\n✅ Seeding selesai!")
  console.log(`   → ${categories.length} kategori`)
  console.log(`   → ${products.length} produk`)
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
