import { createAccessControl } from "better-auth/plugins/access"

export const statement = {
  inventory: ["read", "create", "update", "delete"],
  category: ["read", "create", "update", "delete"],
  transaction: ["read", "create", "update"],
  report: ["read"],
  user: ["read", "create", "update", "delete", "set-password"],
} as const

export const ac = createAccessControl(statement)

export const admin = ac.newRole({
  inventory: ["read", "create", "update", "delete"],
  category: ["read", "create", "update", "delete"],
  transaction: ["read", "create", "update"],
  report: ["read"],
  user: ["read", "create", "update", "delete", "set-password"],
})

export const cashier = ac.newRole({
  inventory: ["read"],
  category: ["read"],
  transaction: ["read", "create", "update"],
})

export const authRoles = {
  admin,
  cashier,
} as const

export type AppRole = keyof typeof authRoles
