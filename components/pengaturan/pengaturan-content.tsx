"use client"

import { useTheme } from "next-themes"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  CheckmarkCircle02Icon,
  ComputerDesk01Icon,
  Moon02Icon,
  Sun03Icon,
  UserCircleIcon,
} from "@hugeicons/core-free-icons"

import { updateProfile, updateUserAccess } from "@/app/admin/pengaturan/actions"
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
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type SettingsUser = {
  id: string
  name: string
  email: string
  role: string | null
  banned: boolean | null
}

type PengaturanContentProps = {
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

export function PengaturanContent({ currentUser, users }: PengaturanContentProps) {
  const { theme, setTheme } = useTheme()
  const displayUser = currentUser ?? {
    id: "",
    name: "Pengguna",
    email: "-",
    role: "cashier",
    banned: false,
  }

  return (
    <div className="flex min-w-0 flex-col gap-3 p-4 lg:gap-6 lg:p-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight lg:text-2xl">Pengaturan</h1>
        <p className="text-sm text-muted-foreground">
          Kelola profile pengguna, hak akses pengguna, dan tema aplikasi.
        </p>
      </div>

      <Tabs defaultValue="profile" className="gap-4">
        <TabsList className="w-full justify-start overflow-x-auto rounded-2xl p-1 sm:w-fit">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="pengguna">Hak Akses Pengguna</TabsTrigger>
          <TabsTrigger value="tema">Tema</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="m-0">
          <Card>
            <CardHeader>
              <CardTitle>Profile Pengguna</CardTitle>
              <CardDescription>
                Data ini mengikuti skema database pengguna: nama, email, role, dan status akun.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex flex-col gap-4 rounded-2xl border bg-muted/30 p-4 sm:flex-row sm:items-center">
                <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <HugeiconsIcon icon={UserCircleIcon} size={28} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">{displayUser.name}</p>
                  <p className="text-sm text-muted-foreground">{displayUser.email}</p>
                </div>
                <Badge variant="outline">{formatRole(displayUser.role)}</Badge>
              </div>

              <form action={updateProfile} className="grid gap-4 md:grid-cols-2">
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
                  <Button type="submit">Simpan Profile</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pengguna" className="m-0">
          <Card>
            <CardHeader>
              <CardTitle>Hak Akses Pengguna</CardTitle>
              <CardDescription>
                Ubah role dan status akun berdasarkan field yang sudah ada di tabel user.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-hidden rounded-2xl border">
                <div className="grid grid-cols-[1fr_auto] gap-4 border-b bg-muted/40 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground lg:grid-cols-[1fr_160px_120px_96px]">
                  <span>Pengguna</span>
                  <span className="hidden lg:block">Role</span>
                  <span className="hidden lg:block">Status</span>
                  <span className="text-right">Aksi</span>
                </div>

                <div className="divide-y">
                  {users.map((user) => (
                    <form
                      key={user.id}
                      action={updateUserAccess}
                      className="grid grid-cols-[1fr_auto] items-center gap-4 px-4 py-4 lg:grid-cols-[1fr_160px_120px_96px]"
                    >
                      <input type="hidden" name="userId" value={user.id} />

                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-full border border-primary/20 bg-primary/10 text-xs font-bold text-primary">
                          {getInitials(user.name)}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold">{user.name}</p>
                          <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                          <div className="mt-2 flex items-center gap-2 lg:hidden">
                            <Badge variant="outline">{formatRole(user.role)}</Badge>
                            <Badge variant={user.banned ? "secondary" : "default"}>
                              {user.banned ? "Nonaktif" : "Aktif"}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <select
                        name="role"
                        defaultValue={user.role === "admin" ? "admin" : "cashier"}
                        className="hidden h-9 rounded-4xl border border-input bg-input/30 px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 lg:block"
                      >
                        <option value="admin">Admin</option>
                        <option value="cashier">Kasir</option>
                      </select>

                      <label className="hidden items-center gap-2 text-sm lg:flex">
                        <Switch name="banned" defaultChecked={Boolean(user.banned)} />
                        Nonaktif
                      </label>

                      <Button type="submit" size="sm" variant="outline">
                        Simpan
                      </Button>
                    </form>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tema" className="m-0">
          <Card>
            <CardHeader>
              <CardTitle>Tema Aplikasi</CardTitle>
              <CardDescription>
                Sesuaikan tema aplikasi untuk kenyamanan mata selama operasional toko.
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
        </TabsContent>
      </Tabs>
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
