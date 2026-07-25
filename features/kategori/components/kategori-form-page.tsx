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
import { Field } from "@/features/shared/components/form-field"
import { PageShell } from "@/features/shared/components/page-shell"
import { useCreateKategori, useDeleteKategori, useUpdateKategori } from "../hooks/use-kategori-actions"
import type { KategoriItem } from "../types"

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
    <PageShell
      width="narrow"
      backHref="/admin/kategori"
      title={mode === "create" ? "Tambah Kategori" : "Edit Kategori"}
      subtitle={
        mode === "create" ? "Tambahkan kategori baru untuk barang warung" : "Perbarui nama dan deskripsi kategori"
      }
      actions={
        <>
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
          <Button type="submit" form="kategori-form" className="gap-2" loading={mutation.isPending} loadingText="Menyimpan...">
            <HugeiconsIcon icon={FloppyDiskIcon} size={16} />
            {mode === "create" ? "Simpan Kategori" : "Simpan Perubahan"}
          </Button>
        </>
      }
      bottomBar={
        <Button
          type="button"
          className="h-12 w-full rounded-2xl gap-2"
          onClick={() => formRef.current?.requestSubmit()}
          loading={mutation.isPending}
          loadingText="Menyimpan..."
        >
          <HugeiconsIcon icon={FloppyDiskIcon} size={18} />
          {mode === "create" ? "Simpan Kategori" : "Perbarui Kategori"}
        </Button>
      }
    >
      <form
          id="kategori-form"
          ref={formRef}
          onSubmit={handleSubmit}
          autoComplete="off"
          className="flex min-w-0 flex-1 flex-col gap-6"
        >
          <div className="rounded-2xl border bg-card p-5 shadow-sm lg:rounded-xl">
            <h2 className="mb-4 flex items-center gap-3 text-base font-semibold lg:gap-2 lg:text-sm">
              <span className="flex size-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 lg:size-7 lg:rounded-lg lg:bg-primary/10 lg:text-primary">
                <HugeiconsIcon icon={TagsIcon} size={18} className="lg:size-3.5" />
              </span>
              Informasi Kategori
            </h2>

            <div className="grid gap-4">
              <Field label="Nama Kategori" required error={errors?.name}>
                <Input
                  name="name"
                  required
                  defaultValue={category?.name}
                  placeholder="Nama kategori"
                  className="h-14 rounded-xl bg-input/30 text-base lg:h-9 lg:rounded-md lg:text-sm"
                />
              </Field>

              {category && (
                <div className="hidden lg:block">
                <Field label="Slug">
                  <Input value={category.slug} readOnly className="bg-muted/50 text-muted-foreground" />
                </Field>
                </div>
              )}

              <div className="hidden lg:block">
              <Field label="Deskripsi (opsional)" error={errors?.description}>
                <Textarea
                  name="description"
                  defaultValue={category?.description ?? ""}
                  className="min-h-[120px] bg-input/30"
                  placeholder="Catatan singkat untuk kategori ini..."
                />
              </Field>
              </div>
              <input type="hidden" name="description" value={category?.description ?? ""} />
            </div>
          </div>
      </form>

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
                disabled={productCount > 0}
                loading={deleteMutation.isPending}
                loadingText="Menghapus..."
              >
                Ya, Hapus
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </PageShell>
  )
}
