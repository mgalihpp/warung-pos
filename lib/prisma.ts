import { config } from "dotenv"

import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "@prisma/client"

config({ path: ".env.local", override: true })
config()

const globalForPrisma = globalThis as typeof globalThis & {
  prisma?: PrismaClient
}

const adapter = new PrismaPg({
  connectionString: process.env.DIRECT_URL ?? process.env.DATABASE_URL ?? "",
})

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
  })

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma
}
