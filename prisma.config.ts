import { config } from "dotenv"
import { defineConfig, env } from "prisma/config"

config({ quiet: true })

type Env = {
  DATABASE_URL: string
  DIRECT_URL: string
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "npx tsx prisma/seed.ts",
  },
  datasource: {
    // Prisma 7 expects CLI and migration connection URLs here.
    url: env<Env>("DIRECT_URL"),
  },
})
