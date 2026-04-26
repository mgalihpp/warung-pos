import "server-only"

import { headers } from "next/headers"

import { auth } from "@/lib/auth"

type Role = "admin" | "cashier"

export async function getSessionUser() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  return session?.user ?? null
}

export async function requireRole(roles: Role[]) {
  const user = await getSessionUser()
  if (!user) return null

  const role = user.role as Role | undefined
  if (!role || !roles.includes(role)) return null

  return user
}

export async function requireAdmin() {
  return requireRole(["admin"])
}

export async function requireCashierOrAdmin() {
  return requireRole(["cashier", "admin"])
}
