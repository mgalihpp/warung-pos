"use server"

import { revalidatePath } from "next/cache"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getSessionUser, requireAdmin } from "@/lib/server/auth-guards"
import { headers } from "next/headers"

function asRole(value: FormDataEntryValue | null) {
  return value === "admin" || value === "cashier" ? value : null
}

export async function updateProfile(
  formData: FormData
): Promise<{ success: boolean; message: string }> {
  const user = await getSessionUser()
  if (!user?.id) {
    return { success: false, message: "Sesi tidak valid, silakan login ulang." }
  }

  const name = String(formData.get("name") ?? "").trim()
  const email = String(formData.get("email") ?? "").trim().toLowerCase()

  if (!name || !email) {
    return { success: false, message: "Nama dan email tidak boleh kosong." }
  }

  try {
    await prisma.user.update({
      where: { id: user.id },
      data: { name, email },
    })
    revalidatePath("/admin/pengaturan")
    return { success: true, message: "Profile berhasil diperbarui." }
  } catch {
    return { success: false, message: "Gagal memperbarui profile. Coba lagi." }
  }
}

export async function changePassword(
  formData: FormData
): Promise<{ success: boolean; message: string }> {
  const user = await getSessionUser()
  if (!user?.id) {
    return { success: false, message: "Sesi tidak valid, silakan login ulang." }
  }

  const currentPassword = String(formData.get("currentPassword") ?? "")
  const newPassword = String(formData.get("newPassword") ?? "")
  const confirmPassword = String(formData.get("confirmPassword") ?? "")

  if (!currentPassword || !newPassword || !confirmPassword) {
    return { success: false, message: "Semua field password harus diisi." }
  }

  if (newPassword.length < 8) {
    return { success: false, message: "Password baru minimal 8 karakter." }
  }

  if (newPassword !== confirmPassword) {
    return { success: false, message: "Konfirmasi password tidak cocok." }
  }

  try {
    await auth.api.changePassword({
      body: { currentPassword, newPassword, revokeOtherSessions: false },
      headers: await headers(),
    })
    return { success: true, message: "Password berhasil diubah." }
  } catch {
    return { success: false, message: "Password saat ini salah atau gagal diubah." }
  }
}

export async function updateAvatar(
  url: string | null
): Promise<{ success: boolean; message: string }> {
  const user = await getSessionUser()
  if (!user?.id) {
    return { success: false, message: "Sesi tidak valid, silakan login ulang." }
  }

  try {
    await prisma.user.update({
      where: { id: user.id },
      data: { image: url },
    })
    revalidatePath("/admin/pengaturan")
    return { success: true, message: url ? "Foto profil berhasil diperbarui." : "Foto profil dihapus." }
  } catch {
    return { success: false, message: "Gagal memperbarui foto profil." }
  }
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
