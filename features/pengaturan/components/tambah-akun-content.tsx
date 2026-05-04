"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import { Cancel01Icon, FloppyDiskIcon, UserCircleIcon } from "@hugeicons/core-free-icons"
import { toast } from "sonner"

import { createUserAccount } from "@/app/admin/pengaturan/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

function Field({
  label,
  required,
  children,
}: {
  label: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <label className="grid gap-1.5 text-xs font-medium">
      <span>
        {label}
        {required && <span className="ml-0.5 text-destructive">*</span>}
      </span>
      {children}
    </label>
  )
}

export function TambahAkunContent() {
  const router = useRouter()
  const formRef = React.useRef<HTMLFormElement>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)
  const [isPending, startTransition] = React.useTransition()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    startTransition(async () => {
      const result = await createUserAccount(formData)
      if (result.success) {
        toast.success(result.message)
        formRef.current?.reset()
        setIsMobileMenuOpen(false)
        router.push("/admin/pengaturan")
      } else {
        toast.error(result.message)
      }
    })
  }

  return (
    <div className="flex min-w-0 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight lg:text-2xl">Tambah Akun</h1>
          <p className="text-sm text-muted-foreground">Buat akun admin atau kasir baru dari sini.</p>
        </div>

        <div className="hidden items-center gap-2 sm:flex">
          <Button asChild variant="outline" className="gap-2">
            <Link href="/admin/pengaturan">
              <HugeiconsIcon icon={Cancel01Icon} size={14} />
              Batal
            </Link>
          </Button>
          <Button type="submit" form="tambah-akun-form" className="gap-2" disabled={isPending}>
            <HugeiconsIcon icon={FloppyDiskIcon} size={16} />
            {isPending ? "Menyimpan..." : "Simpan Akun"}
          </Button>
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-5xl min-w-0 flex-col gap-6 pb-32 lg:pb-0">
        <form
          id="tambah-akun-form"
          ref={formRef}
          onSubmit={handleSubmit}
          autoComplete="off"
          className="grid gap-6"
        >
          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold">
              <span className="flex size-7 items-center justify-center rounded-lg border bg-muted/40 text-muted-foreground">
                <HugeiconsIcon icon={UserCircleIcon} size={16} />
              </span>
              Informasi Akun
            </h2>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Field label="Nama Lengkap" required>
                <Input name="name" required placeholder="Nama pengguna" className="bg-input/30" />
              </Field>

              <Field label="Email" required>
                <Input name="email" type="email" required placeholder="nama@email.com" className="bg-input/30" />
              </Field>

              <Field label="Password Awal" required>
                <Input name="password" type="password" minLength={8} required placeholder="Minimal 8 karakter" className="bg-input/30" />
              </Field>

              <Field label="Role" required>
                <select
                  name="role"
                  defaultValue="cashier"
                  className="h-10 rounded-4xl border border-input bg-input/30 px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                >
                  <option value="admin">Admin</option>
                  <option value="cashier">Kasir</option>
                </select>
              </Field>
            </div>
          </div>
        </form>
      </div>

      <div className="lg:hidden">
        {isMobileMenuOpen && (
          <div className="pointer-events-none fixed inset-0 z-30 bg-background/60 backdrop-blur-[2px]" />
        )}

        <div className="pointer-events-none fixed right-4 bottom-[calc(5rem+env(safe-area-inset-bottom))] z-40 flex flex-col items-end gap-3 sm:right-6">
          <div
            className={`flex flex-col items-end gap-3 transition-all duration-200 ${isMobileMenuOpen ? "pointer-events-auto translate-y-0 scale-100 opacity-100" : "pointer-events-none translate-y-4 scale-95 opacity-0"}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <Button
              type="button"
              className="h-12 rounded-full px-5 shadow-lg"
              onClick={() => formRef.current?.requestSubmit()}
              disabled={isPending}
            >
              <HugeiconsIcon icon={FloppyDiskIcon} size={18} />
              {isPending ? "Menyimpan..." : "Simpan"}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-12 rounded-full px-5 shadow-lg"
              onClick={() => router.push("/admin/pengaturan")}
            >
              <HugeiconsIcon icon={Cancel01Icon} size={16} />
              Batal
            </Button>
          </div>

          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`pointer-events-auto flex size-14 items-center justify-center rounded-full shadow-lg transition-all duration-200 active:scale-95 ${isMobileMenuOpen ? "border bg-card text-foreground" : "bg-primary text-primary-foreground"}`}
          >
            <HugeiconsIcon
              icon={FloppyDiskIcon}
              size={22}
              className={`transition-transform duration-200 ${isMobileMenuOpen ? "rotate-45" : ""}`}
            />
          </button>
        </div>
      </div>
    </div>
  )
}
