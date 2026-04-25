"use server"

import { headers } from "next/headers"
import { revalidatePath } from "next/cache"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

function asRole(value: FormDataEntryValue | null) {
  return value === "admin" || value === "cashier" ? value : null
}

export async function updateProfile(formData: FormData) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user.id) {
    return
  }

  const name = String(formData.get("name") ?? "").trim()
  const email = String(formData.get("email") ?? "").trim().toLowerCase()

  if (!name || !email) {
    return
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { name, email },
  })

  revalidatePath("/admin/pengaturan")
}

export async function updateUserAccess(formData: FormData) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (session?.user.role !== "admin") {
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
