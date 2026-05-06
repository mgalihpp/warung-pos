"use client"

import * as React from "react"
import { useTransition } from "react"
import Image from "next/image"
import { useTheme } from "next-themes"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  CheckmarkCircle02Icon,
  ComputerDesk01Icon,
  Moon02Icon,
  PlusSignIcon,
  Sun03Icon,
  UserCircleIcon,
  LockPasswordIcon,
  Camera01Icon,
  Delete02Icon,
} from "@hugeicons/core-free-icons"
import { generateReactHelpers } from "@uploadthing/react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { useSession } from "@/lib/auth-client"
import { updateProfile, changePassword, updateAvatar, updateUserAccess } from "@/app/admin/pengaturan/actions"
import type { AppFileRouter } from "@/app/api/uploadthing/core"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import {
  DEFAULT_PRIMARY_COLOR,
  getReadableForeground,
  loadCustomTheme,
  normalizeHexColor,
  removeCustomTheme,
  saveCustomTheme,
} from "@/lib/custom-theme"

const { useUploadThing } = generateReactHelpers<AppFileRouter>()

export type SettingsUser = {
  id: string
  name: string
  email: string
  role: string | null
  banned: boolean | null
  image?: string | null
}

type PengaturanContentProps = {
  currentUser: SettingsUser | null
  users: SettingsUser[]
  canManageUsers?: boolean
}

type PengaturanTab = "profile" | "pengguna" | "tema"

const themeOptions = [
  {
    value: "system",
    label: "Ikuti Sistem",
    description: "Otomatis menyesuaikan perangkat.",
    icon: ComputerDesk01Icon,
  },
  {
    value: "light",
    label: "Terang",
    description: "Tampilan cerah untuk siang.",
    icon: Sun03Icon,
  },
  {
    value: "dark",
    label: "Gelap",
    description: "Tampilan gelap untuk malam.",
    icon: Moon02Icon,
  },
]

const colorPresets = [
  { label: "Oranye Toko", value: "#c2410c" },
  { label: "Hijau Sembako", value: "#15803d" },
  { label: "Biru Kasir", value: "#2563eb" },
  { label: "Ungu Modern", value: "#7c3aed" },
  { label: "Merah Maroon", value: "#be123c" },
  { label: "Coklat Kopi", value: "#92400e" },
]

export function PengaturanContent({ currentUser, users, canManageUsers = true }: PengaturanContentProps) {
  const [activeTab, setActiveTab] = React.useState<PengaturanTab>("profile")
  const [isAccessPending, startAccessTransition] = useTransition()
  const router = useRouter()
  const tabs = [
    { value: "profile", label: "Profile", icon: UserCircleIcon },
    ...(canManageUsers
      ? [{ value: "pengguna" as const, label: "Manajemen Pengguna", icon: CheckmarkCircle02Icon }]
      : []),
    { value: "tema", label: "Tema", icon: ComputerDesk01Icon },
  ] satisfies Array<{ value: PengaturanTab; label: string; icon: typeof UserCircleIcon }>
  const displayUser = currentUser ?? {
    id: "",
    name: "Pengguna",
    email: "-",
    role: "cashier",
    banned: false,
  }

  function handleUserAccessSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    startAccessTransition(async () => {
      const result = await updateUserAccess(formData)
      if (result.success) {
        toast.success(result.message)
        router.refresh()
      } else {
        toast.error(result.message)
      }
    })
  }

  return (
    <div className="flex min-w-0 flex-col gap-3 p-4 pb-28 lg:gap-6 lg:p-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight lg:text-2xl">Pengaturan</h1>
        <p className="text-sm text-muted-foreground">
          {canManageUsers
            ? "Kelola profile pengguna, manajemen pengguna, dan tema aplikasi."
            : "Kelola profile pengguna dan tema aplikasi."}
        </p>
      </div>

      <div className="scrollbar-none -mx-4 flex gap-1 overflow-x-auto border-b px-4 lg:mx-0 lg:px-0">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.value
          return (
            <button
              key={tab.value}
              type="button"
              onClick={() => setActiveTab(tab.value)}
              className={cn(
                "inline-flex shrink-0 items-center gap-2 border-b-2 px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground",
              )}
            >
              <HugeiconsIcon icon={tab.icon} size={16} />
              {tab.label}
            </button>
          )
        })}
      </div>

      {activeTab === "profile" && <ProfileTab displayUser={displayUser} />}

      {activeTab === "pengguna" && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold tracking-tight">Manajemen Pengguna</h2>
              <p className="text-sm text-muted-foreground">
                Ubah role dan status akun berdasarkan field yang sudah ada di tabel user.
              </p>
            </div>

            <Button asChild className="hidden gap-2 lg:inline-flex">
              <Link href="/admin/pengaturan/tambah-akun">
                <HugeiconsIcon icon={PlusSignIcon} size={16} />
                Tambah Akun
              </Link>
            </Button>
          </div>

          <Card>
            <CardContent className="px-3 pt-3 sm:px-6 sm:pt-6">
              <div className="overflow-hidden rounded-2xl border lg:hidden">
                <div className="border-b bg-muted/40 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Pengguna
                </div>

                <div className="divide-y">
                  {users.map((user) => (
                    <form key={user.id} onSubmit={handleUserAccessSubmit} className="grid gap-3 p-4">
                      <input type="hidden" name="userId" value={user.id} />

                      <div className="flex min-w-0 items-start gap-3">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-full border border-primary/20 bg-primary/10 text-xs font-bold text-primary">
                          {getInitials(user.name)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold leading-5">{user.name}</p>
                          <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                          <div className="mt-2 flex flex-wrap gap-2">
                            <Badge variant="outline">{formatRole(user.role)}</Badge>
                            <Badge variant={user.banned ? "secondary" : "default"}>
                              {user.banned ? "Nonaktif" : "Aktif"}
                            </Badge>
                            {currentUser?.id === user.id && <Badge variant="outline">Akun Anda</Badge>}
                          </div>
                        </div>
                      </div>

                      <div className="grid gap-3 min-[420px]:grid-cols-2">
                        <label className="grid gap-1.5 text-sm">
                          <span className="text-xs font-medium text-muted-foreground">Role</span>
                          <Select
                            name="role"
                            defaultValue={user.role === "admin" ? "admin" : "cashier"}
                            disabled={currentUser?.id === user.id}
                          >
                            <SelectTrigger className="h-10 w-full">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="admin">Admin</SelectItem>
                              <SelectItem value="cashier">Kasir</SelectItem>
                            </SelectContent>
                          </Select>
                        </label>

                        <label className="grid gap-1.5 text-sm">
                          <span className="text-xs font-medium text-muted-foreground">Status</span>
                          <Select
                            name="status"
                            defaultValue={user.banned ? "inactive" : "active"}
                            disabled={currentUser?.id === user.id}
                          >
                            <SelectTrigger className="h-10 w-full">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="active">Aktif</SelectItem>
                              <SelectItem value="inactive">Nonaktif</SelectItem>
                            </SelectContent>
                          </Select>
                        </label>
                      </div>

                      {currentUser?.id === user.id && (
                        <p className="text-xs text-muted-foreground">Akun Anda hanya bisa diubah dari tab Profile.</p>
                      )}

                      <Button
                        type="submit"
                        size="sm"
                        variant="outline"
                        className="w-full"
                        disabled={isAccessPending || currentUser?.id === user.id}
                      >
                        Simpan
                      </Button>
                    </form>
                  ))}
                </div>
              </div>

              <div className="hidden overflow-hidden rounded-2xl border lg:block">
                <div className="grid grid-cols-[1fr_180px_140px_120px] gap-4 border-b bg-muted/40 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  <span>Pengguna</span>
                  <span>Role</span>
                  <span>Status</span>
                  <span className="text-right">Aksi</span>
                </div>

                <div className="divide-y">
                  {users.map((user) => (
                    <form
                      key={user.id}
                      onSubmit={handleUserAccessSubmit}
                      className="grid grid-cols-[1fr_180px_140px_120px] items-center gap-4 px-4 py-4"
                    >
                      <input type="hidden" name="userId" value={user.id} />

                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-full border border-primary/20 bg-primary/10 text-xs font-bold text-primary">
                          {getInitials(user.name)}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold">{user.name}</p>
                          <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                          {currentUser?.id === user.id && (
                            <Badge className="mt-2" variant="outline">
                              Akun Anda
                            </Badge>
                          )}
                        </div>
                      </div>

                      <label className="grid gap-1.5 text-sm">
                        <span className="sr-only">Role</span>
                        <Select
                          name="role"
                          defaultValue={user.role === "admin" ? "admin" : "cashier"}
                          disabled={currentUser?.id === user.id}
                        >
                          <SelectTrigger className="h-10 w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="cashier">Kasir</SelectItem>
                          </SelectContent>
                        </Select>
                      </label>

                      <label className="grid gap-1.5 text-sm">
                        <span className="sr-only">Status</span>
                        <Select
                          name="status"
                          defaultValue={user.banned ? "inactive" : "active"}
                          disabled={currentUser?.id === user.id}
                        >
                          <SelectTrigger className="h-10 w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Aktif</SelectItem>
                            <SelectItem value="inactive">Nonaktif</SelectItem>
                          </SelectContent>
                        </Select>
                      </label>

                      <div className="flex items-center justify-end">
                        <Button
                          type="submit"
                          size="sm"
                          variant="outline"
                          disabled={isAccessPending || currentUser?.id === user.id}
                        >
                          Simpan
                        </Button>
                      </div>
                    </form>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="lg:hidden">
            <Button
              asChild
              className="fixed right-4 bottom-[calc(5rem+env(safe-area-inset-bottom))] z-40 size-14 rounded-full shadow-lg sm:right-6"
              aria-label="Tambah akun"
            >
              <Link href="/admin/pengaturan/tambah-akun">
                <HugeiconsIcon icon={PlusSignIcon} size={28} />
              </Link>
            </Button>
          </div>
        </div>
      )}

      {activeTab === "tema" && <TemaTab canCustomizeColors={canManageUsers} />}
    </div>
  )
}

export function ProfileTab({ displayUser }: { displayUser: SettingsUser }) {
  const [isPending, startTransition] = useTransition()
  const [isPwPending, startPwTransition] = useTransition()
  const [avatarUrl, setAvatarUrl] = React.useState<string | null>(displayUser.image ?? null)
  const avatarInputRef = React.useRef<HTMLInputElement>(null)
  const pwFormRef = React.useRef<HTMLFormElement>(null)
  const router = useRouter()
  const { refetch: refetchSession } = useSession()

  async function syncSessionAndRoute() {
    await refetchSession()
    router.refresh()
  }

  const { startUpload, isUploading } = useUploadThing("avatarUpload", {
    onClientUploadComplete: async (res) => {
      const url = res[0]?.url ?? null
      if (!url) return
      setAvatarUrl(url)
      const result = await updateAvatar(url)
      if (result.success) {
        toast.success(result.message)
        await syncSessionAndRoute()
      } else {
        toast.error(result.message)
      }
    },
    onUploadError: () => {
      toast.error("Gagal mengupload foto profil.")
    },
  })

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) startUpload([file])
  }

  async function handleAvatarRemove() {
    setAvatarUrl(null)
    if (avatarInputRef.current) avatarInputRef.current.value = ""
    const result = await updateAvatar(null)
    if (result.success) {
      toast.success(result.message)
      await syncSessionAndRoute()
    } else {
      toast.error(result.message)
    }
  }

  function handleProfileSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    startTransition(async () => {
      const result = await updateProfile(formData)
      if (result.success) {
        toast.success(result.message)
        await syncSessionAndRoute()
      } else {
        toast.error(result.message)
      }
    })
  }

  function handlePasswordSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    startPwTransition(async () => {
      const result = await changePassword(formData)
      if (result.success) {
        toast.success(result.message)
        pwFormRef.current?.reset()
      } else {
        toast.error(result.message)
      }
    })
  }

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Profile Pengguna</CardTitle>
          <CardDescription>
            Perbarui nama dan email akun yang sedang login.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="flex items-center gap-4 rounded-2xl border bg-muted/30 p-4">
            <div className="relative shrink-0">
              <div className="relative flex size-14 items-center justify-center overflow-hidden rounded-2xl border-2 border-background bg-primary/10 text-primary shadow-sm sm:size-16">
                {avatarUrl ? (
                  <Image src={avatarUrl} alt="Avatar" fill className="object-cover" />
                ) : (
                  <HugeiconsIcon icon={UserCircleIcon} size={32} />
                )}
              </div>
              
              {/* Tombol Aksi di Pojok Kanan Atas */}
              {avatarUrl ? (
                <button
                  type="button"
                  onClick={handleAvatarRemove}
                  className="absolute -right-2 -top-2 flex size-7 items-center justify-center rounded-full bg-destructive text-white shadow-md transition-transform hover:scale-110 active:scale-95"
                  title="Hapus foto"
                >
                  <HugeiconsIcon icon={Delete02Icon} size={14} />
                </button>
              ) : (
                <button
                  type="button"
                  disabled={isUploading}
                  onClick={() => avatarInputRef.current?.click()}
                  className="absolute -right-2 -top-2 flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md transition-transform hover:scale-110 active:scale-95 disabled:opacity-50"
                  title="Upload foto"
                >
                  {isUploading ? (
                    <span className="size-3 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                  ) : (
                    <HugeiconsIcon icon={Camera01Icon} size={14} />
                  )}
                </button>
              )}
              
              <input
                ref={avatarInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </div>
            <div className="min-w-0 flex-1 space-y-0.5">
              <p className="truncate font-semibold sm:text-lg">{displayUser.name}</p>
              <p className="truncate text-xs text-muted-foreground sm:text-sm">{displayUser.email}</p>
              <div className="pt-1">
                <Badge variant="outline" className="h-5 px-1.5 text-[10px] sm:h-6 sm:px-2 sm:text-xs">
                  {formatRole(displayUser.role)}
                </Badge>
              </div>
            </div>
          </div>

          <form onSubmit={handleProfileSubmit} className="grid gap-4 md:grid-cols-2">
            <FieldGroup label="Nama Pengguna">
              <Input name="name" defaultValue={displayUser.name} required />
            </FieldGroup>

            <FieldGroup label="Email Akun">
              <Input name="email" type="email" defaultValue={displayUser.email} required />
            </FieldGroup>

            <FieldGroup label="Role">
              <Input value={formatRole(displayUser.role)} disabled />
            </FieldGroup>

            <FieldGroup label="Status Akun">
              <Input value={displayUser.banned ? "Nonaktif" : "Aktif"} disabled />
            </FieldGroup>

            <div className="md:col-span-2">
              <Button type="submit" disabled={isPending}>
                {isPending ? "Menyimpan..." : "Simpan Profile"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <HugeiconsIcon icon={LockPasswordIcon} size={20} />
            </div>
            <div>
              <CardTitle>Ganti Password</CardTitle>
              <CardDescription className="mt-0.5">
                Masukkan password saat ini lalu buat password baru.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form ref={pwFormRef} onSubmit={handlePasswordSubmit} className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <FieldGroup label="Password Saat Ini">
                <Input name="currentPassword" type="password" autoComplete="current-password" required />
              </FieldGroup>
            </div>

            <FieldGroup label="Password Baru">
              <Input name="newPassword" type="password" autoComplete="new-password" minLength={8} required />
            </FieldGroup>

            <FieldGroup label="Konfirmasi Password Baru">
              <Input name="confirmPassword" type="password" autoComplete="new-password" minLength={8} required />
            </FieldGroup>

            <div className="md:col-span-2">
              <Button type="submit" disabled={isPwPending} variant="outline">
                {isPwPending ? "Mengubah..." : "Ganti Password"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export function TemaTab({ canCustomizeColors }: { canCustomizeColors: boolean }) {
  const { theme, setTheme } = useTheme()
  const [primaryColor, setPrimaryColor] = React.useState(() => loadCustomTheme()?.primaryColor ?? DEFAULT_PRIMARY_COLOR)

  function handleColorChange(value: string) {
    const normalizedColor = normalizeHexColor(value)

    setPrimaryColor(normalizedColor)
    saveCustomTheme({ primaryColor: normalizedColor })
  }

  function handleResetTheme() {
    setPrimaryColor(DEFAULT_PRIMARY_COLOR)
    removeCustomTheme()
    toast.success("Warna tema dikembalikan ke bawaan.")
  }

  const foregroundColor = getReadableForeground(primaryColor)

  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Tema Aplikasi</CardTitle>
          <CardDescription>
            Sesuaikan mode tampilan untuk kenyamanan mata selama operasional toko.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {themeOptions.map((option) => {
              const isActive = (theme ?? "system") === option.value

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setTheme(option.value)}
                  className={`rounded-2xl border p-4 text-left transition-colors hover:bg-muted/50 ${
                    isActive ? "border-primary bg-primary/10" : "bg-card"
                  }`}
                >
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <HugeiconsIcon icon={option.icon} size={20} />
                    </div>
                    {isActive && (
                      <div className="flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        <HugeiconsIcon icon={CheckmarkCircle02Icon} size={16} />
                      </div>
                    )}
                  </div>
                  <p className="font-semibold">{option.label}</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {option.description}
                  </p>
                </button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {canCustomizeColors ? (
      <Card>
        <CardHeader>
          <CardTitle>Warna Toko</CardTitle>
          <CardDescription>
            Pilih warna utama aplikasi. Untuk sementara warna ini tersimpan di browser perangkat ini saja.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-5">
            <FieldGroup label="Warna utama">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Input
                  type="color"
                  value={primaryColor}
                  onChange={(event) => handleColorChange(event.target.value)}
                  className="h-12 w-full cursor-pointer p-1 sm:w-24"
                  aria-label="Pilih warna utama aplikasi"
                />
                <Input
                  value={primaryColor}
                  onChange={(event) => setPrimaryColor(event.target.value)}
                  onBlur={(event) => handleColorChange(event.target.value)}
                  className="font-mono uppercase"
                  aria-label="Kode warna utama aplikasi"
                />
                <Button type="button" variant="outline" onClick={handleResetTheme} className="sm:w-auto">
                  Reset
                </Button>
              </div>
            </FieldGroup>

            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {colorPresets.map((preset) => {
                const isSelected = primaryColor === preset.value

                return (
                  <button
                    key={preset.value}
                    type="button"
                    onClick={() => handleColorChange(preset.value)}
                    className={cn(
                      "flex items-center gap-3 rounded-2xl border bg-card p-3 text-left text-sm transition-colors hover:bg-muted/50",
                      isSelected && "border-primary bg-primary/10",
                    )}
                  >
                    <span
                      className="size-8 shrink-0 rounded-xl border shadow-sm"
                      style={{ backgroundColor: preset.value }}
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-medium">{preset.label}</span>
                      <span className="block font-mono text-xs uppercase text-muted-foreground">{preset.value}</span>
                    </span>
                    {isSelected && <HugeiconsIcon icon={CheckmarkCircle02Icon} size={18} className="text-primary" />}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="rounded-3xl border bg-muted/30 p-4">
            <div
              className="rounded-2xl p-5 shadow-sm"
              style={{ backgroundColor: primaryColor, color: foregroundColor }}
            >
              <p className="text-xs font-semibold uppercase tracking-wide opacity-80">Preview Tema</p>
              <p className="mt-2 text-lg font-bold">Warung Mama Nia</p>
              <p className="mt-1 text-sm opacity-85">Tombol, sidebar, tab aktif, dan highlight akan mengikuti warna ini.</p>
              <div className="mt-4 inline-flex rounded-full bg-white/20 px-3 py-1 text-xs font-semibold">
                Kasir Siap Jualan
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Warna Toko</CardTitle>
            <CardDescription>
              Warna utama aplikasi hanya bisa diubah oleh admin/pemilik toko.
            </CardDescription>
          </CardHeader>
        </Card>
      )}
    </div>
  )
}

function FieldGroup({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <label className="grid gap-2 text-sm font-medium">
      <span>{label}</span>
      {children}
    </label>
  )
}

function formatRole(role?: string | null) {
  return role === "admin" ? "Admin" : "Kasir"
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("")
}
