"use server"

import { revalidatePath } from "next/cache"

import { prisma } from "@/lib/prisma"
import { getSessionUser, requireAdmin } from "@/lib/server/auth-guards"

function asRole(value: FormDataEntryValue | null) {
  return value === "admin" || value === "cashier" ? value : null
}

export async function updateProfile(formData: FormData) {
  const user = await getSessionUser()
  if (!user?.id) {
    return
  }

  const name = String(formData.get("name") ?? "").trim()
  const email = String(formData.get("email") ?? "").trim().toLowerCase()

  if (!name || !email) {
    return
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { name, email },
  })

  revalidatePath("/admin/pengaturan")
}

export async function updateUserAccess(formData: FormData) {
  const admin = await requireAdmin()
  if (!admin) {
    return
  }

  const userId = String(formData.get("userId") ?? "")
  const role = asRole(formData.get("role"))

  if (!userId || !role) {
    return
  }

  await prisma.user.update({
    where: { id: userId },
    data: {
      role,
      banned: formData.get("banned") === "on",
    },
  })

  revalidatePath("/admin/pengaturan")
}
