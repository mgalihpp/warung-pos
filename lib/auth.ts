import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { nextCookies } from "better-auth/next-js"
import { admin as adminPlugin } from "better-auth/plugins"

import { ac, admin, cashier } from "@/lib/permissions"
import { prisma } from "@/lib/prisma"

export const auth = betterAuth({
  appName: "Warung Sembako Pos",
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      role: {
        type: ["admin", "cashier"],
        required: false,
        defaultValue: "cashier",
        input: false,
      },
    },
  },
  trustedOrigins: ["http://localhost:3000", "http://192.168.100.101:3000"],
  plugins: [
    adminPlugin({
      ac,
      roles: {
        admin,
        cashier,
      },
      defaultRole: "cashier",
      adminRoles: ["admin"],
    }),
    nextCookies(),
  ],
})

export type Session = typeof auth.$Infer.Session
export type AuthUser = Session["user"]
