"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { HugeiconsIcon } from "@hugeicons/react"
import { UserCircleIcon } from "@hugeicons/core-free-icons"
import { toast } from "sonner"

import { createUserAccount } from "@/app/admin/pengaturan/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

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
    <label className="grid gap-1.5 text-xs font-bold text-foreground">
      <span className="px-1">
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
  const [isPending, startTransition] = React.useTransition()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    startTransition(async () => {
      const result = await createUserAccount(formData)
      if (result.success) {
        toast.success(result.message)
        formRef.current?.reset()
        router.push("/admin/pengaturan/akun")
      } else {
        toast.error(result.message)
      }
    })
  }

  return (
    <div className="flex min-w-0 flex-col gap-4">
      <div className="mx-auto flex w-full max-w-2xl min-w-0 flex-col gap-4">
        <form
          id="tambah-akun-form"
          ref={formRef}
          onSubmit={handleSubmit}
          autoComplete="off"
          className="grid gap-4"
        >
          <div className="rounded-[2rem] border bg-card p-4 shadow-sm sm:p-5">
            <div className="mb-4 flex items-center gap-3 rounded-3xl bg-primary/10 p-3 text-primary">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                <HugeiconsIcon icon={UserCircleIcon} size={22} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-black text-foreground">
                  Informasi Akun
                </p>
                <p className="text-xs text-muted-foreground">
                  Buat akun admin atau kasir baru.
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Nama Lengkap" required>
                <Input
                  name="name"
                  required
                  placeholder="Nama pengguna"
                  className="h-12 rounded-2xl border-0 bg-muted shadow-none"
                />
              </Field>

              <Field label="Email" required>
                <Input
                  name="email"
                  type="email"
                  required
                  placeholder="nama@email.com"
                  className="h-12 rounded-2xl border-0 bg-muted shadow-none"
                />
              </Field>

              <Field label="Password Awal" required>
                <Input
                  name="password"
                  type="password"
                  minLength={8}
                  required
                  placeholder="Minimal 8 karakter"
                  className="h-12 rounded-2xl border-0 bg-muted shadow-none"
                />
              </Field>

              <Field label="Role" required>
                <Select name="role" defaultValue="cashier">
                  <SelectTrigger className="h-12 rounded-2xl border-0 bg-muted shadow-none">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="cashier">Kasir</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant="outline"
                className="h-12 rounded-2xl"
                onClick={() => router.push("/admin/pengaturan/akun")}
              >
                Batal
              </Button>
              <Button
                type="submit"
                className="h-12 rounded-2xl font-black"
                loading={isPending}
                loadingText="Menyimpan..."
              >
                Simpan Akun
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
