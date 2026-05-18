"use client"

import * as React from "react"
import { useTransition } from "react"
import Image from "next/image"
import { useTheme } from "next-themes"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Alert02Icon,
  ArrowRight01Icon,
  CheckmarkCircle02Icon,
  ComputerDesk01Icon,
  Moon02Icon,
  PlusSignIcon,
  Sun03Icon,
  UserCircleIcon,
  LockPasswordIcon,
  Logout03Icon,
  Camera01Icon,
  Delete02Icon,
  Edit02Icon,
  MoreVerticalCircle01Icon,
  UserSettings01Icon,
} from "@hugeicons/core-free-icons"
import { generateReactHelpers } from "@uploadthing/react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { toast } from "sonner"

import { authClient, useSession } from "@/lib/auth-client"
import {
  updateProfile,
  changePassword,
  updateAvatar,
  updateUserAccess,
  deleteUserAccount,
} from "@/app/admin/pengaturan/actions"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

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
  basePath?: "/admin/pengaturan" | "/cashier/pengaturan"
}

type PengaturanPenggunaContentProps = {
  currentUser: SettingsUser | null
  users: SettingsUser[]
}

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

export function PengaturanContent({
  currentUser,
  basePath = "/admin/pengaturan",
}: PengaturanContentProps) {
  const displayUser = currentUser ?? {
    id: "",
    name: "Pengguna",
    email: "-",
    role: "cashier",
    banned: false,
  }

  return <ProfileTab displayUser={displayUser} basePath={basePath} />
}

export function PengaturanPenggunaContent({
  currentUser,
  users,
}: PengaturanPenggunaContentProps) {
  const [isAccessPending, startAccessTransition] = useTransition()
  const [selectedUser, setSelectedUser] = React.useState<SettingsUser | null>(null)
  const [deleteUser, setDeleteUser] = React.useState<SettingsUser | null>(null)
  const [isDesktopSheet, setIsDesktopSheet] = React.useState(false)
  const [isDeletePending, startDeleteTransition] = useTransition()
  const router = useRouter()

  React.useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)")
    const syncDesktopSheet = () => setIsDesktopSheet(mediaQuery.matches)

    syncDesktopSheet()
    mediaQuery.addEventListener("change", syncDesktopSheet)

    return () => mediaQuery.removeEventListener("change", syncDesktopSheet)
  }, [])

  function handleUserAccessSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    startAccessTransition(async () => {
      const result = await updateUserAccess(formData)
      if (result.success) {
        toast.success(result.message)
        setSelectedUser(null)
        router.refresh()
      } else {
        toast.error(result.message)
      }
    })
  }

  function handleDeleteUser() {
    if (!deleteUser) return

    const formData = new FormData()
    formData.set("userId", deleteUser.id)

    startDeleteTransition(async () => {
      const result = await deleteUserAccount(formData)
      if (result.success) {
        toast.success(result.message)
        setDeleteUser(null)
        router.refresh()
      } else {
        toast.error(result.message)
      }
    })
  }

  function handleDeleteFromSheet(user: SettingsUser) {
    setSelectedUser(null)
    window.setTimeout(() => setDeleteUser(user), 180)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="hidden items-center justify-between gap-3 lg:flex">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">
            Manajemen Akun
          </h2>
          <p className="text-sm text-muted-foreground">
            Tambah akun, ubah role, status, dan reset password.
          </p>
        </div>

        <Button asChild className="hidden gap-2 lg:inline-flex">
          <Link href="/admin/pengaturan/tambah-akun">
            <HugeiconsIcon icon={PlusSignIcon} size={16} />
            Tambah Akun
          </Link>
        </Button>
      </div>

      <Card className="py-3 sm:py-4 lg:py-6">
        <CardContent className="px-3 sm:px-4 lg:px-6">
          <div className="lg:hidden">
            <div className="overflow-hidden rounded-2xl bg-muted/30">
              <div className="divide-y">
                {users.map((user) => {
                  const isCurrentUser = currentUser?.id === user.id

                  return (
                    <button
                      key={user.id}
                      type="button"
                      onClick={() => !isCurrentUser && setSelectedUser(user)}
                      disabled={isCurrentUser}
                      className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors active:bg-muted/60 disabled:cursor-default disabled:opacity-100"
                    >
                      <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-xs font-black text-primary">
                        {getInitials(user.name)}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-black text-foreground">
                              {user.name}
                            </p>
                            <p className="truncate text-xs text-muted-foreground">
                              {user.email}
                            </p>
                          </div>

                          {!isCurrentUser && (
                            <HugeiconsIcon
                              icon={ArrowRight01Icon}
                              size={18}
                              className="mt-1 shrink-0 text-muted-foreground"
                            />
                          )}
                        </div>

                        <div className="mt-2 flex flex-wrap gap-1.5">
                          <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-bold text-primary">
                            {formatRole(user.role)}
                          </span>
                          <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${user.banned ? "bg-muted text-muted-foreground" : "bg-primary text-primary-foreground"}`}>
                            {user.banned ? "Nonaktif" : "Aktif"}
                          </span>
                          {isCurrentUser && (
                            <span className="rounded-full bg-muted px-2.5 py-1 text-[11px] font-bold text-muted-foreground">
                              Akun Anda
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          <div className="hidden overflow-hidden rounded-2xl border lg:block">
            <div className="grid grid-cols-[1fr_180px_140px_120px] gap-4 border-b bg-muted/40 px-4 py-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              <span>Akun</span>
              <span>Role</span>
              <span>Status</span>
              <span className="text-right">Aksi</span>
            </div>

            <div className="divide-y">
              {users.map((user) => {
                const isCurrentUser = currentUser?.id === user.id

                return (
                <div
                  key={user.id}
                  className="grid grid-cols-[1fr_180px_140px_120px] items-center gap-4 px-4 py-4"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-full border border-primary/20 bg-primary/10 text-xs font-bold text-primary">
                      {getInitials(user.name)}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">
                        {user.name}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {user.email}
                      </p>
                      {isCurrentUser && (
                        <Badge className="mt-2" variant="outline">
                          Akun Anda
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div>
                    <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-bold text-primary">
                      {formatRole(user.role)}
                    </span>
                  </div>

                  <div>
                    <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${user.banned ? "bg-muted text-muted-foreground" : "bg-primary text-primary-foreground"}`}>
                      {user.banned ? "Nonaktif" : "Aktif"}
                    </span>
                  </div>

                  <div className="flex items-center justify-end">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          type="button"
                          className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
                          aria-label="Aksi akun"
                          disabled={isCurrentUser}
                        >
                          <HugeiconsIcon icon={MoreVerticalCircle01Icon} size={15} />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-44 rounded-xl p-2">
                        <DropdownMenuItem
                          className="cursor-pointer gap-2 rounded-lg py-2"
                          onSelect={() => setSelectedUser(user)}
                        >
                          <HugeiconsIcon icon={Edit02Icon} size={16} className="text-muted-foreground" />
                          Edit Akun
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="my-1" />
                        <DropdownMenuItem
                          variant="destructive"
                          className="cursor-pointer gap-2 rounded-lg py-2"
                          onSelect={() => setDeleteUser(user)}
                        >
                          <HugeiconsIcon icon={Delete02Icon} size={16} />
                          Hapus Akun
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                )
              })}
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

      <Sheet open={!!selectedUser} onOpenChange={(open) => !open && setSelectedUser(null)}>
        <SheetContent
          side={isDesktopSheet ? "right" : "bottom"}
          className={isDesktopSheet ? "w-[420px] p-0" : "rounded-t-[2rem] border-0 p-0"}
          showCloseButton={false}
        >
          {selectedUser && (
            <UserAccountEditForm
              user={selectedUser}
              isAccessPending={isAccessPending}
              onSubmit={handleUserAccessSubmit}
              onCancel={() => setSelectedUser(null)}
              onDelete={() => handleDeleteFromSheet(selectedUser)}
            />
          )}
        </SheetContent>
      </Sheet>

      <AlertDialog open={!!deleteUser} onOpenChange={(open) => !open && setDeleteUser(null)}>
        <AlertDialogContent className="sm:max-w-[400px]">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
              <HugeiconsIcon icon={Alert02Icon} size={20} />
              Hapus Akun?
            </AlertDialogTitle>
            <AlertDialogDescription className="pt-2 leading-relaxed">
              Akun <strong className="font-semibold text-foreground">{deleteUser?.name}</strong> akan dihapus permanen.
              Jika akun memiliki riwayat transaksi atau stok, sistem akan menolak penghapusan.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter className="gap-2 pt-4">
            <AlertDialogCancel className="mt-0 w-full sm:w-auto">Batal</AlertDialogCancel>
            <Button
              type="button"
              variant="destructive"
              className="w-full sm:w-auto"
              disabled={isDeletePending}
              onClick={handleDeleteUser}
            >
              {isDeletePending ? "Menghapus..." : "Hapus"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export function PengaturanTemaContent() {
  return <TemaTab />
}

function UserAccountEditForm({
  user,
  isAccessPending,
  onSubmit,
  onCancel,
  onDelete,
}: {
  user: SettingsUser
  isAccessPending: boolean
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  onCancel: () => void
  onDelete: () => void
}) {
  return (
    <form onSubmit={onSubmit} className="grid gap-3 p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] lg:h-full lg:content-start lg:p-4">
      <input type="hidden" name="userId" value={user.id} />

      <SheetHeader className="p-0 text-left">
        <div className="mx-auto mb-1 h-1.5 w-12 rounded-full bg-muted lg:hidden" />
        <div className="flex items-center gap-3 rounded-3xl bg-muted p-2.5">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-sm font-black text-primary-foreground">
            {getInitials(user.name)}
          </div>
          <div className="min-w-0">
            <SheetTitle className="truncate text-base font-black">
              {user.name}
            </SheetTitle>
            <SheetDescription className="truncate text-xs">
              {user.email}
            </SheetDescription>
          </div>
        </div>
      </SheetHeader>

      <div className="grid gap-3">
        <label className="grid gap-1.5 text-xs font-bold text-foreground">
          <span className="px-1">Email Akun</span>
          <Input name="email" type="email" defaultValue={user.email} required className="h-11 rounded-2xl border-0 bg-muted shadow-none" />
        </label>

        <div className="grid grid-cols-2 gap-3">
          <label className="grid gap-1.5 text-xs font-bold text-foreground">
            <span className="px-1">Role Akun</span>
            <Select name="role" defaultValue={user.role === "admin" ? "admin" : "cashier"}>
              <SelectTrigger className="h-11 rounded-2xl border-0 bg-muted shadow-none">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="cashier">Kasir</SelectItem>
              </SelectContent>
            </Select>
          </label>

          <label className="grid gap-1.5 text-xs font-bold text-foreground">
            <span className="px-1">Status Akun</span>
            <Select name="status" defaultValue={user.banned ? "inactive" : "active"}>
              <SelectTrigger className="h-11 rounded-2xl border-0 bg-muted shadow-none">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Aktif</SelectItem>
                <SelectItem value="inactive">Nonaktif</SelectItem>
              </SelectContent>
            </Select>
          </label>
        </div>

        <label className="grid gap-1.5 text-xs font-bold text-foreground">
          <span className="px-1">Reset Password</span>
          <Input name="newPassword" type="password" minLength={8} placeholder="Kosongkan jika tidak diganti" className="h-11 rounded-2xl border-0 bg-muted shadow-none" />
        </label>
      </div>

      <div className="grid grid-cols-2 gap-3 pt-1">
        <Button type="button" variant="outline" className="h-11 rounded-2xl" onClick={onCancel}>
          Batal
        </Button>
        <Button type="submit" disabled={isAccessPending} className="h-11 rounded-2xl font-black">
          {isAccessPending ? "Menyimpan..." : "Simpan"}
        </Button>
      </div>

      <Button
        type="button"
        variant="ghost"
        className="h-10 rounded-2xl text-destructive hover:bg-destructive/10 hover:text-destructive"
        onClick={onDelete}
      >
        Hapus Akun
      </Button>
    </form>
  )
}

export function ProfileTab({
  displayUser,
  basePath,
}: {
  displayUser: SettingsUser
  basePath: "/admin/pengaturan" | "/cashier/pengaturan"
}) {
  const [isPending, startTransition] = useTransition()
  const [isPwPending, startPwTransition] = useTransition()
  const [mobileView, setMobileView] = React.useState<
    "menu" | "profile" | "password"
  >("menu")
  const [avatarUrl, setAvatarUrl] = React.useState<string | null>(
    displayUser.image ?? null
  )
  const [isProfileChanged, setIsProfileChanged] = React.useState(false)
  const [isPasswordReady, setIsPasswordReady] = React.useState(false)
  const avatarInputRef = React.useRef<HTMLInputElement>(null)
  const pwFormRef = React.useRef<HTMLFormElement>(null)
  const router = useRouter()
  const { refetch: refetchSession } = useSession()
  const canManageUsers = basePath === "/admin/pengaturan"

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
        setIsProfileChanged(false)
        await syncSessionAndRoute()
      } else {
        toast.error(result.message)
      }
    })
  }

  function handleProfileChange(e: React.FormEvent<HTMLFormElement>) {
    const formData = new FormData(e.currentTarget)
    setIsProfileChanged(
      formData.get("name") !== displayUser.name ||
        formData.get("email") !== displayUser.email
    )
  }

  function handlePasswordChange(e: React.FormEvent<HTMLFormElement>) {
    const formData = new FormData(e.currentTarget)
    setIsPasswordReady(
      Boolean(formData.get("currentPassword")) &&
        Boolean(formData.get("newPassword")) &&
        Boolean(formData.get("confirmPassword"))
    )
  }

  function handlePasswordSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    startPwTransition(async () => {
      const result = await changePassword(formData)
      if (result.success) {
        toast.success(result.message)
        pwFormRef.current?.reset()
        setIsPasswordReady(false)
      } else {
        toast.error(result.message)
      }
    })
  }

  React.useEffect(() => {
    const title =
      mobileView === "profile"
        ? "Profil Akun"
        : mobileView === "password"
          ? "Keamanan Akun"
          : null

    if (title) {
      document.body.dataset.pengaturanDetailTitle = title
    } else {
      delete document.body.dataset.pengaturanDetailTitle
    }

    window.dispatchEvent(new Event("pengaturan-detail-change"))

    const handleBackRequest = () => setMobileView("menu")
    window.addEventListener("pengaturan-detail-back", handleBackRequest)

    return () => {
      delete document.body.dataset.pengaturanDetailTitle
      window.dispatchEvent(new Event("pengaturan-detail-change"))
      window.removeEventListener("pengaturan-detail-back", handleBackRequest)
    }
  }, [mobileView])

  return (
    <div className="flex flex-col gap-4">
      <div className="space-y-4 lg:hidden">
        {mobileView === "menu" && (
          <>
            <section className="relative overflow-hidden rounded-3xl bg-primary p-4 text-primary-foreground shadow-lg shadow-primary/20">
              <div className="absolute -top-12 -right-10 size-32 rounded-full bg-primary-foreground/10" />
              <div className="absolute -bottom-16 left-10 size-40 rounded-full bg-primary-foreground/10" />

              <div className="relative flex items-center gap-4">
                <div className="relative flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-3xl border border-primary-foreground/30 bg-primary-foreground/15 text-primary-foreground shadow-sm">
                  {avatarUrl ? (
                    <Image
                      src={avatarUrl}
                      alt="Avatar"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <HugeiconsIcon icon={UserCircleIcon} size={34} />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-lg leading-tight font-black">
                    {displayUser.name}
                  </p>
                  <p className="truncate text-xs font-medium text-primary-foreground/75">
                    {displayUser.email}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="rounded-full bg-primary-foreground/15 px-2.5 py-1 text-[11px] font-bold ring-1 ring-primary-foreground/15">
                      {formatRole(displayUser.role)}
                    </span>
                    <span className="rounded-full bg-primary-foreground/15 px-2.5 py-1 text-[11px] font-bold ring-1 ring-primary-foreground/15">
                      {displayUser.banned ? "Nonaktif" : "Aktif"}
                    </span>
                  </div>
                </div>
              </div>
            </section>

            <section className="overflow-hidden rounded-3xl border bg-card shadow-sm">
              <SettingsRow
                icon={UserCircleIcon}
                title="Profil Akun"
                description="Ubah nama, email, dan foto profil."
                onClick={() => setMobileView("profile")}
              />
              <div className="mx-4 border-t" />
              {canManageUsers && (
                <>
                  <SettingsRow
                    href={`${basePath}/akun`}
                    icon={UserSettings01Icon}
                    title="Manajemen Akun"
                    description="Tambah akun, ubah role, dan status akun."
                  />
                  <div className="mx-4 border-t" />
                </>
              )}
              <SettingsRow
                href={`${basePath}/tema`}
                icon={ComputerDesk01Icon}
                title="Tema Tampilan"
                description="Ubah mode terang, gelap, atau sistem."
              />
              <div className="mx-4 border-t" />
              <SettingsRow
                icon={LockPasswordIcon}
                title="Keamanan Akun"
                description="Ganti password akun saat ini."
                onClick={() => setMobileView("password")}
              />
            </section>

            <section className="overflow-hidden rounded-3xl border bg-card shadow-sm">
              <SettingsRow
                icon={Logout03Icon}
                title="Logout"
                description="Keluar dari akun kasir saat ini."
                variant="destructive"
                onClick={() =>
                  authClient.signOut({
                    fetchOptions: {
                      onSuccess: () => {
                        window.location.href = "/login"
                      },
                    },
                  })
                }
              />
            </section>
          </>
        )}

        {mobileView === "profile" && (
          <section className="space-y-4">
            <div className="rounded-[2rem] border bg-card p-4 shadow-sm">
              <div className="flex flex-col items-center py-2 text-center">
                <div className="relative mb-3">
                  <div className="relative flex size-24 items-center justify-center overflow-hidden rounded-[2rem] bg-primary/10 text-primary ring-4 ring-primary/10">
                    {avatarUrl ? (
                      <Image
                        src={avatarUrl}
                        alt="Avatar"
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <HugeiconsIcon icon={UserCircleIcon} size={48} />
                    )}
                  </div>
                  <button
                    type="button"
                    disabled={isUploading}
                    onClick={() => avatarInputRef.current?.click()}
                    className="absolute -right-1 bottom-1 flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform active:scale-95 disabled:opacity-50"
                  >
                    {isUploading ? (
                      <span className="size-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                    ) : (
                      <HugeiconsIcon icon={Camera01Icon} size={17} />
                    )}
                  </button>
                </div>
                <p className="text-base font-black text-foreground">
                  {displayUser.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {displayUser.email}
                </p>
              </div>

              <form
                onSubmit={handleProfileSubmit}
                onChange={handleProfileChange}
                className="mt-4 grid gap-3"
              >
                <MobileInput label="Nama Pengguna">
                  <Input
                    name="name"
                    defaultValue={displayUser.name}
                    required
                    className="h-12 rounded-2xl border-0 bg-muted shadow-none"
                  />
                </MobileInput>

                <MobileInput label="Email Akun">
                  <Input
                    name="email"
                    type="email"
                    defaultValue={displayUser.email}
                    required
                    className="h-12 rounded-2xl border-0 bg-muted shadow-none"
                  />
                </MobileInput>

                <div className="grid grid-cols-2 gap-3">
                  <MobileInput label="Role">
                    <Input
                      value={formatRole(displayUser.role)}
                      disabled
                      className="h-12 rounded-2xl border-0 bg-muted shadow-none"
                    />
                  </MobileInput>
                  <MobileInput label="Status">
                    <Input
                      value={displayUser.banned ? "Nonaktif" : "Aktif"}
                      disabled
                      className="h-12 rounded-2xl border-0 bg-muted shadow-none"
                    />
                  </MobileInput>
                </div>

                <div className="grid gap-2 pt-2">
                  <Button
                    type="submit"
                    disabled={isPending || !isProfileChanged}
                    className="h-12 rounded-2xl font-black"
                  >
                    {isPending ? "Menyimpan..." : "Simpan Perubahan"}
                  </Button>
                  {avatarUrl && (
                    <Button
                      type="button"
                      variant="ghost"
                      className="h-11 rounded-2xl text-destructive"
                      onClick={handleAvatarRemove}
                    >
                      Hapus Foto Profil
                    </Button>
                  )}
                </div>
              </form>
            </div>
          </section>
        )}

        {mobileView === "password" && (
          <section className="space-y-4">
            <div className="rounded-[2rem] border bg-card p-4 shadow-sm">
              <div className="mb-5 flex items-center gap-3 rounded-3xl bg-primary/10 p-3 text-primary">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                  <HugeiconsIcon icon={LockPasswordIcon} size={21} />
                </div>
                <p className="text-xs leading-relaxed font-semibold text-primary">
                  Ubah Password
                </p>
              </div>

              <form
                ref={pwFormRef}
                onSubmit={handlePasswordSubmit}
                onChange={handlePasswordChange}
                className="grid gap-3"
              >
                <MobileInput label="Password Saat Ini">
                  <Input
                    name="currentPassword"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="h-12 rounded-2xl border-0 bg-muted shadow-none"
                  />
                </MobileInput>

                <MobileInput label="Password Baru">
                  <Input
                    name="newPassword"
                    type="password"
                    autoComplete="new-password"
                    minLength={8}
                    required
                    className="h-12 rounded-2xl border-0 bg-muted shadow-none"
                  />
                </MobileInput>

                <MobileInput label="Konfirmasi Password Baru">
                  <Input
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    minLength={8}
                    required
                    className="h-12 rounded-2xl border-0 bg-muted shadow-none"
                  />
                </MobileInput>

                <Button
                  type="submit"
                  disabled={isPwPending || !isPasswordReady}
                  className="mt-2 h-12 rounded-2xl font-black"
                >
                  {isPwPending ? "Mengubah..." : "Update Password"}
                </Button>
              </form>
            </div>
          </section>
        )}
      </div>

      <Card className="hidden lg:block">
        <CardHeader className="px-4 pb-2 sm:px-6">
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
                  <Image
                    src={avatarUrl}
                    alt="Avatar"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <HugeiconsIcon icon={UserCircleIcon} size={32} />
                )}
              </div>

              {/* Tombol Aksi di Pojok Kanan Atas */}
              {avatarUrl ? (
                <button
                  type="button"
                  onClick={handleAvatarRemove}
                  className="absolute -top-2 -right-2 flex size-7 items-center justify-center rounded-full bg-destructive text-white shadow-md transition-transform hover:scale-110 active:scale-95"
                  title="Hapus foto"
                >
                  <HugeiconsIcon icon={Delete02Icon} size={14} />
                </button>
              ) : (
                <button
                  type="button"
                  disabled={isUploading}
                  onClick={() => avatarInputRef.current?.click()}
                  className="absolute -top-2 -right-2 flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md transition-transform hover:scale-110 active:scale-95 disabled:opacity-50"
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
              <p className="truncate font-semibold sm:text-lg">
                {displayUser.name}
              </p>
              <p className="truncate text-xs text-muted-foreground sm:text-sm">
                {displayUser.email}
              </p>
              <div className="pt-1">
                <Badge
                  variant="outline"
                  className="h-5 px-1.5 text-[10px] sm:h-6 sm:px-2 sm:text-xs"
                >
                  {formatRole(displayUser.role)}
                </Badge>
              </div>
            </div>
          </div>

          <form
            onSubmit={handleProfileSubmit}
            onChange={handleProfileChange}
            className="grid gap-4 md:grid-cols-2"
          >
            <FieldGroup label="Nama Pengguna">
              <Input name="name" defaultValue={displayUser.name} required />
            </FieldGroup>

            <FieldGroup label="Email Akun">
              <Input
                name="email"
                type="email"
                defaultValue={displayUser.email}
                required
              />
            </FieldGroup>

            <FieldGroup label="Role">
              <Input value={formatRole(displayUser.role)} disabled />
            </FieldGroup>

            <FieldGroup label="Status Akun">
              <Input
                value={displayUser.banned ? "Nonaktif" : "Aktif"}
                disabled
              />
            </FieldGroup>

            <div className="md:col-span-2">
              <Button type="submit" disabled={isPending || !isProfileChanged}>
                {isPending ? "Menyimpan..." : "Simpan Profile"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="hidden lg:block">
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
          <form
            ref={pwFormRef}
            onSubmit={handlePasswordSubmit}
            onChange={handlePasswordChange}
            className="grid gap-4 md:grid-cols-2"
          >
            <div className="md:col-span-2">
              <FieldGroup label="Password Saat Ini">
                <Input
                  name="currentPassword"
                  type="password"
                  autoComplete="current-password"
                  required
                />
              </FieldGroup>
            </div>

            <FieldGroup label="Password Baru">
              <Input
                name="newPassword"
                type="password"
                autoComplete="new-password"
                minLength={8}
                required
              />
            </FieldGroup>

            <FieldGroup label="Konfirmasi Password Baru">
              <Input
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                minLength={8}
                required
              />
            </FieldGroup>

            <div className="md:col-span-2">
              <Button type="submit" disabled={isPwPending || !isPasswordReady}>
                {isPwPending ? "Mengubah..." : "Ganti Password"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

function SettingsRow({
  href,
  icon,
  title,
  description,
  onClick,
  variant = "default",
}: {
  href?: string
  icon: typeof UserCircleIcon
  title: string
  description: string
  onClick?: () => void
  variant?: "default" | "destructive"
}) {
  const isDestructive = variant === "destructive"
  const content = (
    <>
      <div
        className={`flex size-10 shrink-0 items-center justify-center rounded-2xl ${isDestructive ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"}`}
      >
        <HugeiconsIcon icon={icon} size={20} />
      </div>
      <div className="min-w-0 flex-1">
        <p
          className={`text-sm font-bold ${isDestructive ? "text-destructive" : "text-foreground"}`}
        >
          {title}
        </p>
        <p className="truncate text-xs text-muted-foreground">{description}</p>
      </div>
      <HugeiconsIcon
        icon={ArrowRight01Icon}
        size={18}
        className="shrink-0 text-muted-foreground"
      />
    </>
  )

  if (href) {
    return (
      <Link
        href={href}
        className="flex w-full items-center gap-3 p-4 text-left transition-colors active:bg-muted/60"
      >
        {content}
      </Link>
    )
  }

  return (
    <button
      type="button"
      className="flex w-full items-center gap-3 p-4 text-left transition-colors active:bg-muted/60"
      onClick={onClick}
    >
      {content}
    </button>
  )
}

function MobileInput({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <label className="grid gap-1.5 text-xs font-bold text-foreground">
      <span className="px-1">{label}</span>
      {children}
    </label>
  )
}

export function TemaTab() {
  const { theme, setTheme } = useTheme()
  const pathname = usePathname()
  const router = useRouter()
  const basePath = pathname.startsWith("/cashier")
    ? "/cashier/pengaturan"
    : "/admin/pengaturan"

  React.useEffect(() => {
    if (!pathname.startsWith("/cashier")) {
      return
    }

    document.body.dataset.pengaturanDetailTitle = "Tema Tampilan"
    window.dispatchEvent(new Event("pengaturan-detail-change"))

    const handleBackRequest = () => router.push(basePath)
    window.addEventListener("pengaturan-detail-back", handleBackRequest)

    return () => {
      delete document.body.dataset.pengaturanDetailTitle
      window.dispatchEvent(new Event("pengaturan-detail-change"))
      window.removeEventListener("pengaturan-detail-back", handleBackRequest)
    }
  }, [basePath, pathname, router])

  return (
    <>
      <div className="space-y-4 lg:hidden">
        <section className="overflow-hidden rounded-3xl border bg-card shadow-sm">
          {themeOptions.map((option, index) => {
            const isActive = (theme ?? "system") === option.value

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => setTheme(option.value)}
                className="flex w-full items-center gap-3 p-4 text-left transition-colors active:bg-muted/60"
              >
                <div
                  className={`flex size-11 shrink-0 items-center justify-center rounded-2xl ${isActive ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary"}`}
                >
                  <HugeiconsIcon icon={option.icon} size={21} />
                </div>
                <div
                  className={`min-w-0 flex-1 ${index < themeOptions.length - 1 ? "border-b pb-4" : ""}`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-black text-foreground">
                        {option.label}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {option.description}
                      </p>
                    </div>
                    {isActive && (
                      <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        <HugeiconsIcon icon={CheckmarkCircle02Icon} size={15} />
                      </div>
                    )}
                  </div>
                </div>
              </button>
            )
          })}
        </section>
      </div>

      <Card className="hidden lg:block">
        <CardHeader className="px-4 pb-2 sm:px-6">
          <CardTitle>Tema Aplikasi</CardTitle>
          <CardDescription>
            Sesuaikan tema aplikasi untuk kenyamanan mata selama operasional
            toko.
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
    </>
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
