import type { AppRole } from "@/lib/permissions"

export const roleHome = {
  admin: "/admin",
  cashier: "/cashier",
} as const satisfies Record<AppRole, string>

export function getDashboardPath(role?: string | null) {
  return role === "admin" ? roleHome.admin : roleHome.cashier
}

export function canAccessPath(pathname: string, role?: string | null) {
  if (pathname.startsWith("/admin")) {
    return role === "admin"
  }

  if (pathname.startsWith("/cashier")) {
    return role === "cashier"
  }

  return true
}
