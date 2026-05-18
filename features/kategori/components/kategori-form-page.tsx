"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { HugeiconsIcon } from "@hugeicons/react"
import { Cancel01Icon, Delete02Icon, FloppyDiskIcon, TagsIcon } from "@hugeicons/core-free-icons"
import { toast } from "sonner"

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useCreateKategori, useDeleteKategori, useUpdateKategori } from "../hooks/use-kategori-actions"
import type { KategoriItem } from "../types"

function Field({
  label,
  required,
  children,
  error,
}: {
  label: string
  required?: boolean
  children: React.ReactNode
  error?: string[]
}) {
  return (
    <label className="grid gap-1.5 text-xs font-medium">
      <span>
        {label}
        {required && <span className="ml-0.5 text-destructive">*</span>}
      </span>
      {children}
      {error?.[0] && <span className="text-[10px] font-normal text-destructive">{error[0]}</span>}
    </label>
  )
}

type KategoriFormPageProps =
  | {
      mode: "create"
      category?: undefined
    }
  | {
      mode: "edit"
      category: KategoriItem
    }

export function KategoriFormPage(props: KategoriFormPageProps) {
  const { mode } = props
  const category = mode === "edit" ? props.category : undefined
  const router = useRouter()
  const formRef = React.useRef<HTMLFormElement>(null)
  const createMutation = useCreateKategori()
  const updateMutation = useUpdateKategori()
  const deleteMutation = useDeleteKategori()
  const mutation = mode === "create" ? createMutation : updateMutation
  const errors = mutation.data?.success === false ? (mutation.data.errors ?? null) : null
  const [deleteOpen, setDeleteOpen] = React.useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)
  const productCount = category?.productCount ?? 0

  function collectFormData(): Record<string, unknown> & { id?: string } {
    const fd = new FormData(formRef.current!)
    const data: Record<string, unknown> = {
      name: String(fd.get("name") ?? "").trim(),
      description: String(fd.get("description") ?? "").trim(),
    }
    if (category) data.id = category.id
    return data as Record<string, unknown> & { id?: string }
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = collectFormData()

    if (mode === "create") {
      createMutation.mutate(data, {
        onSuccess: (result) => {
          if (result.success) {
            toast.success("Kategori berhasil ditambahkan")
            router.push("/admin/kategori")
          } else {
            toast.error(result.error ?? "Kategori gagal ditambahkan")
          }
        },
      })
      return
    }

    updateMutation.mutate(data as Record<string, unknown> & { id: string }, {
      onSuccess: (result) => {
        if (result.success) {
          toast.success("Kategori berhasil diperbarui")
          router.push("/admin/kategori")
        } else {
          toast.error(result.error ?? "Kategori gagal diperbarui")
        }
      },
    })
  }

  function handleDelete() {
    if (!category) return

    deleteMutation.mutate(category.id, {
      onSuccess: (result) => {
        if (result.success) {
          toast.success("Kategori berhasil dihapus")
          router.push("/admin/kategori")
          return
        }

        toast.error(result.error ?? "Kategori gagal dihapus")
      },
    })
  }

  return (
    <div className="flex min-w-0 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight lg:text-2xl">
            {mode === "create" ? "Tambah Kategori" : "Edit Kategori"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {mode === "create" ? "Tambahkan kategori baru untuk barang warung" : "Perbarui nama dan deskripsi kategori"}
          </p>
        </div>
        <div className="hidden flex-wrap items-center gap-2 lg:flex">
          {mode === "edit" && (
            <Button
              type="button"
              variant="outline"
              className="gap-2 border-destructive/30 text-destructive hover:bg-destructive/5 hover:text-destructive"
              onClick={() => setDeleteOpen(true)}
              disabled={productCount > 0}
            >
              <HugeiconsIcon icon={Delete02Icon} size={16} />
              <span className="hidden sm:inline">Hapus Kategori</span>
            </Button>
          )}
          <Button type="button" variant="outline" className="gap-2" onClick={() => router.push("/admin/kategori")}>
            <HugeiconsIcon icon={Cancel01Icon} size={14} />
            Batal
          </Button>
          <Button type="submit" form="kategori-form" className="gap-2" disabled={mutation.isPending}>
            <HugeiconsIcon icon={FloppyDiskIcon} size={16} />
            {mutation.isPending ? "Menyimpan..." : mode === "create" ? "Simpan Kategori" : "Simpan Perubahan"}
          </Button>
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-3xl min-w-0 flex-col gap-6 pb-32 lg:pb-0">
        <form
          id="kategori-form"
          ref={formRef}
          onSubmit={handleSubmit}
          autoComplete="off"
          className="flex min-w-0 flex-1 flex-col gap-6"
        >
          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold">
              <span className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <HugeiconsIcon icon={TagsIcon} size={14} />
              </span>
              Informasi Kategori
            </h2>

            <div className="grid gap-4">
              <Field label="Nama Kategori" required error={errors?.name}>
                <Input
                  name="name"
                  required
                  defaultValue={category?.name}
                  placeholder="Contoh: Beras, Minuman, Rokok"
                  className="bg-input/30"
                />
              </Field>

              {category && (
                <Field label="Slug">
                  <Input value={category.slug} readOnly className="bg-muted/50 text-muted-foreground" />
                </Field>
              )}

              <Field label="Deskripsi (opsional)" error={errors?.description}>
                <Textarea
                  name="description"
                  defaultValue={category?.description ?? ""}
                  className="min-h-[120px] bg-input/30"
                  placeholder="Catatan singkat untuk kategori ini..."
                />
              </Field>
            </div>
          </div>
        </form>
      </div>

      <div className="lg:hidden">
        {isMobileMenuOpen && <div className="pointer-events-none fixed inset-0 z-30 bg-background/60 backdrop-blur-[2px]" />}
        <div className="pointer-events-none fixed right-4 bottom-[calc(5rem+env(safe-area-inset-bottom))] z-40 flex flex-col items-end gap-3 sm:right-6">
          <div
            className={`flex flex-col items-end gap-3 transition-all duration-200 ${isMobileMenuOpen ? "pointer-events-auto translate-y-0 scale-100 opacity-100" : "pointer-events-none translate-y-4 scale-95 opacity-0"}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <Button
              type="button"
              className="h-12 rounded-full px-5 shadow-lg"
              onClick={() => formRef.current?.requestSubmit()}
              disabled={mutation.isPending}
            >
              <HugeiconsIcon icon={FloppyDiskIcon} size={18} />
              {mutation.isPending ? "Menyimpan..." : "Simpan"}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-12 rounded-full px-5 shadow-lg"
              onClick={() => router.push("/admin/kategori")}
            >
              <HugeiconsIcon icon={Cancel01Icon} size={16} />
              Batal
            </Button>
            {mode === "edit" && (
              <Button
                type="button"
                variant="outline"
                className="h-12 rounded-full border-destructive/30 px-5 text-destructive shadow-lg hover:bg-destructive/5 hover:text-destructive disabled:opacity-50"
                onClick={() => setDeleteOpen(true)}
                disabled={productCount > 0}
              >
                <HugeiconsIcon icon={Delete02Icon} size={16} />
                Hapus
              </Button>
            )}
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`pointer-events-auto flex size-14 items-center justify-center rounded-full shadow-lg transition-all duration-200 active:scale-95 ${isMobileMenuOpen ? "border bg-card text-foreground" : "bg-primary text-primary-foreground"}`}
          >
            <HugeiconsIcon icon={FloppyDiskIcon} size={22} className={`transition-transform duration-200 ${isMobileMenuOpen ? "rotate-45" : ""}`} />
          </button>
        </div>
      </div>

      {mode === "edit" && category && (
        <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Hapus Kategori?</AlertDialogTitle>
              <AlertDialogDescription>
                Kategori &ldquo;{category.name}&rdquo; akan dihapus permanen.
                {productCount > 0 && ` Kategori ini masih digunakan oleh ${productCount} barang.`}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Batal</AlertDialogCancel>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={deleteMutation.isPending || productCount > 0}
              >
                {deleteMutation.isPending ? "Menghapus..." : "Ya, Hapus"}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  )
}
