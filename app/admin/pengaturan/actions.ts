"use server"

import { revalidatePath } from "next/cache"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getSessionUser, requireAdmin } from "@/lib/server/auth-guards"
import { headers } from "next/headers"

type ActionResult = { success: boolean; message: string }

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

export async function updateUserAccess(formData: FormData): Promise<ActionResult> {
  const admin = await requireAdmin()
  if (!admin) {
    return { success: false, message: "Akses ditolak." }
  }

  const userId = String(formData.get("userId") ?? "")
  const role = asRole(formData.get("role"))
  const email = String(formData.get("email") ?? "").trim().toLowerCase()
  const newPassword = String(formData.get("newPassword") ?? "")

  if (!userId || !role) {
    return { success: false, message: "Data pengguna tidak valid." }
  }

  if (!email) {
    return { success: false, message: "Email pengguna tidak boleh kosong." }
  }

  if (newPassword && newPassword.length < 8) {
    return { success: false, message: "Password baru minimal 8 karakter." }
  }

  if (admin.id === userId) {
    return { success: false, message: "Akun sendiri tidak bisa diubah dari tab ini." }
  }

  const targetUser = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, role: true, banned: true },
  })

  if (!targetUser) {
    return { success: false, message: "Pengguna tidak ditemukan." }
  }

  const status = String(formData.get("status") ?? "")
  const nextBanned = status ? status === "inactive" : formData.get("banned") === "on"
  const nextRole = role
  const willRemainActiveAdmin = nextRole === "admin" && !nextBanned

  if (targetUser.role === "admin" && !willRemainActiveAdmin) {
    const activeAdminCount = await prisma.user.count({
      where: { role: "admin", banned: false },
    })

    if (activeAdminCount <= 1) {
      return { success: false, message: "Tidak bisa menonaktifkan admin terakhir." }
    }
  }

  await prisma.user.update({
    where: { id: userId },
    data: {
      email,
      role: nextRole,
      banned: nextBanned,
    },
  })

  if (newPassword) {
    await auth.api.setUserPassword({
      body: {
        userId,
        newPassword,
      },
      headers: await headers(),
    })
  }

  revalidatePath("/admin/pengaturan")
  return { success: true, message: "Data pengguna berhasil diperbarui." }
}

export async function deleteUserAccount(formData: FormData): Promise<ActionResult> {
  const admin = await requireAdmin()
  if (!admin) {
    return { success: false, message: "Akses ditolak." }
  }

  const userId = String(formData.get("userId") ?? "")
  if (!userId) {
    return { success: false, message: "Data akun tidak valid." }
  }

  if (admin.id === userId) {
    return { success: false, message: "Akun sendiri tidak bisa dihapus." }
  }

  const targetUser = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      role: true,
      banned: true,
      _count: {
        select: {
          transactions: true,
          stockAdjustments: true,
        },
      },
    },
  })

  if (!targetUser) {
    return { success: false, message: "Akun tidak ditemukan." }
  }

  if (targetUser.role === "admin" && !targetUser.banned) {
    const activeAdminCount = await prisma.user.count({
      where: { role: "admin", banned: false },
    })

    if (activeAdminCount <= 1) {
      return { success: false, message: "Tidak bisa menghapus admin terakhir." }
    }
  }

  if (targetUser._count.transactions > 0 || targetUser._count.stockAdjustments > 0) {
    return {
      success: false,
      message: "Akun memiliki riwayat transaksi/stok. Nonaktifkan akun sebagai gantinya.",
    }
  }

  await prisma.user.delete({ where: { id: userId } })

  revalidatePath("/admin/pengaturan")
  return { success: true, message: "Akun berhasil dihapus." }
}

export async function createUserAccount(formData: FormData): Promise<ActionResult> {
  const admin = await requireAdmin()
  if (!admin) {
    return { success: false, message: "Akses ditolak." }
  }

  const name = String(formData.get("name") ?? "").trim()
  const email = String(formData.get("email") ?? "").trim().toLowerCase()
  const password = String(formData.get("password") ?? "")
  const role = asRole(formData.get("role")) ?? "cashier"

  if (!name || !email || !password) {
    return { success: false, message: "Nama, email, dan password wajib diisi." }
  }

  if (password.length < 8) {
    return { success: false, message: "Password minimal 8 karakter." }
  }

  try {
    await auth.api.createUser({
      body: {
        name,
        email,
        password,
        role,
      },
      headers: await headers(),
    })

    revalidatePath("/admin/pengaturan")
    return { success: true, message: "Akun baru berhasil dibuat." }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gagal membuat akun baru."
    return { success: false, message }
  }
}
