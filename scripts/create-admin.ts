import { config } from "dotenv"

config({ quiet: true })

process.env.DATABASE_URL ??= process.env.DIRECT_URL

const email = process.env.ADMIN_EMAIL?.trim().toLowerCase()
const password = process.env.ADMIN_PASSWORD
const name = process.env.ADMIN_NAME?.trim() || "Admin"

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL atau DIRECT_URL harus diisi sebelum membuat admin.")
}

if (!email || !password) {
  throw new Error("ADMIN_EMAIL dan ADMIN_PASSWORD wajib diisi.")
}

if (password.length < 8) {
  throw new Error("ADMIN_PASSWORD minimal 8 karakter.")
}

const { auth } = await import("../lib/auth")
const { prisma } = await import("../lib/prisma")

try {
  const existing = await prisma.user.findUnique({ where: { email } })

  if (!existing) {
    await auth.api.signUpEmail({
      body: {
        name,
        email,
        password,
      },
    })
  }

  await prisma.user.update({
    where: { email },
    data: {
      role: "admin",
      emailVerified: true,
      banned: false,
    },
  })

  console.log(`Admin siap: ${email}`)
} finally {
  await prisma.$disconnect()
}
