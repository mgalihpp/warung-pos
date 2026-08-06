"use client"

import * as React from "react"
import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Alert02Icon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
  Delete02Icon,
  Edit02Icon,
  MoreVerticalCircle01Icon,
  SearchIcon,
  TagsIcon,
} from "@hugeicons/core-free-icons"
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useSearchParamsState } from "@/hooks/use-search-param"
import { useDeleteKategori } from "../hooks/use-kategori-actions"
import type { KategoriItem } from "../types"

const pageSize = 8

function CategoryActionMenu({ category }: { category: KategoriItem }) {
  const [deleteOpen, setDeleteOpen] = React.useState(false)
  const deleteMutation = useDeleteKategori()

  function handleDelete() {
    deleteMutation.mutate(category.id, {
      onSuccess: (result) => {
        if (result.success) {
          toast.success("Kategori berhasil dihapus")
          setDeleteOpen(false)
          return
        }

        toast.error(result.error ?? "Kategori gagal dihapus")
      },
    })
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Aksi kategori"
          >
            <HugeiconsIcon icon={MoreVerticalCircle01Icon} size={15} />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48 rounded-xl p-2">
          <DropdownMenuItem
            asChild
            className="cursor-pointer gap-2 rounded-lg py-2"
          >
            <Link href={`/admin/kategori/${category.id}/edit`}>
              <HugeiconsIcon
                icon={Edit02Icon}
                size={16}
                className="text-muted-foreground"
              />
              Edit Kategori
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="my-1" />
          <DropdownMenuItem
            variant="destructive"
            onSelect={() => setDeleteOpen(true)}
            className="cursor-pointer gap-2 rounded-lg py-2"
          >
            <HugeiconsIcon icon={Delete02Icon} size={16} />
            Hapus Kategori
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent className="sm:max-w-[400px]">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
              <HugeiconsIcon icon={Alert02Icon} size={20} />
              Hapus Kategori?
            </AlertDialogTitle>
            <AlertDialogDescription className="pt-2 leading-relaxed">
              Anda yakin ingin menghapus{" "}
              <strong className="font-semibold text-foreground">
                {category.name}
              </strong>
              ?
              {category.productCount > 0 && (
                <>
                  <br />
                  <br />
                  Kategori ini masih digunakan oleh {category.productCount}{" "}
                  barang, sehingga tidak bisa dihapus.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter className="gap-2 pt-4">
            <AlertDialogCancel className="mt-0 w-full sm:w-auto">
              Batal
            </AlertDialogCancel>
            <Button
              type="button"
              variant="destructive"
              className="w-full sm:w-auto"
              disabled={category.productCount > 0}
              loading={deleteMutation.isPending}
              loadingText="Menghapus..."
              onClick={handleDelete}
            >
              Hapus
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export function KategoriTable({ categories }: { categories: KategoriItem[] }) {
  const { values, setParams } = useSearchParamsState({
    search: "",
    page: "1",
    status: "all",
  })
  const searchQuery = values.search
  const statusFilter = values.status
  const currentPage = Number(values.page)

  const filteredCategories = React.useMemo(() => {
    const query = searchQuery.toLowerCase()
    return categories.filter((category) => {
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "used" && category.productCount > 0) ||
        (statusFilter === "empty" && category.productCount === 0)
      const matchesQuery =
        category.name.toLowerCase().includes(query) ||
        category.slug.toLowerCase().includes(query) ||
        (category.description ?? "").toLowerCase().includes(query)

      return matchesStatus && matchesQuery
    })
  }, [categories, searchQuery, statusFilter])

  const totalPages = Math.max(
    1,
    Math.ceil(filteredCategories.length / pageSize)
  )
  const safePage = Math.min(currentPage, totalPages)
  const pageCategories = filteredCategories.slice(
    (safePage - 1) * pageSize,
    safePage * pageSize
  )
  const startItem =
    filteredCategories.length === 0 ? 0 : (safePage - 1) * pageSize + 1
  const endItem = Math.min(safePage * pageSize, filteredCategories.length)

  return (
    <div className="flex flex-col gap-3 lg:gap-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
        <div className="relative flex-1 p-[3px]">
          <HugeiconsIcon
            icon={SearchIcon}
            size={16}
            className="absolute top-1/2 left-[15px] -translate-y-1/2 text-muted-foreground"
          />
          <Input
            type="text"
            placeholder="Cari nama kategori..."
            value={searchQuery}
            onChange={(event) => {
              setParams({ search: event.target.value, page: "1" })
            }}
            className="h-9 rounded-lg bg-background pr-3 pl-9 text-sm"
          />
        </div>
        <div className="hidden flex-wrap items-center gap-2 lg:flex">
          <Select
            value={statusFilter}
            onValueChange={(value) => {
              setParams({ status: value, page: "1" })
            }}
          >
            <SelectTrigger className="w-full lg:w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua kategori</SelectItem>
              <SelectItem value="used">Ada barang</SelectItem>
              <SelectItem value="empty">Kosong</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="hidden overflow-x-auto rounded-xl border bg-card shadow-sm lg:block">
        <table className="w-full min-w-[760px] text-left">
          <thead>
            <tr className="border-b bg-muted/30">
              <th className="px-4 py-3 text-xs font-medium text-muted-foreground">
                Kategori
              </th>
              <th className="px-4 py-3 text-xs font-medium text-muted-foreground">
                Slug
              </th>
              <th className="px-4 py-3 text-xs font-medium text-muted-foreground">
                Barang
              </th>
              <th className="px-4 py-3 text-xs font-medium text-muted-foreground">
                Deskripsi
              </th>
              <th className="px-4 py-3 text-xs font-medium text-muted-foreground">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody>
            {pageCategories.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-8 text-center text-sm text-muted-foreground"
                >
                  Tidak ada kategori yang cocok.
                </td>
              </tr>
            )}
            {pageCategories.map((category) => (
              <tr
                key={category.id}
                className="border-b transition-colors last:border-0 hover:bg-muted/20"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/5 text-primary">
                      <HugeiconsIcon icon={TagsIcon} size={17} />
                    </div>
                    <p className="truncate text-sm font-medium">
                      {category.name}
                    </p>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground">
                  {category.slug}
                </td>
                <td className="px-4 py-3 text-sm font-medium">
                  {category.productCount} barang
                </td>
                <td className="max-w-[320px] px-4 py-3 text-sm text-muted-foreground">
                  <span className="line-clamp-1">
                    {category.description || "-"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <CategoryActionMenu category={category} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-3 lg:hidden">
        {pageCategories.length === 0 ? (
          <div className="rounded-xl border bg-card px-4 py-10 text-center text-sm text-muted-foreground shadow-sm">
            Tidak ada kategori yang cocok.
          </div>
        ) : (
          pageCategories.map((category) => (
            <div
              key={category.id}
              className="rounded-xl border bg-card p-3.5 shadow-sm"
            >
              <div className="flex items-start gap-3">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/5 text-primary">
                  <HugeiconsIcon icon={TagsIcon} size={20} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm leading-tight font-semibold">
                    {category.name}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {category.slug}
                  </p>
                </div>
                <CategoryActionMenu category={category} />
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2 rounded-lg bg-muted/40 px-3 py-2.5">
                <div>
                  <p className="text-[10px] font-medium text-muted-foreground">
                    Barang
                  </p>
                  <p className="text-xs font-bold text-primary">
                    {category.productCount} barang
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-medium text-muted-foreground">
                    Status
                  </p>
                  <p className="text-xs font-semibold">
                    {category.productCount > 0 ? "Terpakai" : "Kosong"}
                  </p>
                </div>
              </div>

              {category.description && (
                <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                  {category.description}
                </p>
              )}
            </div>
          ))
        )}
      </div>

      <div className="flex flex-col items-center justify-between gap-3 lg:flex-row">
        <p className="text-xs text-muted-foreground">
          Menampilkan {startItem}-{endItem} dari {filteredCategories.length}{" "}
          kategori
        </p>
        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={safePage === 1}
            onClick={() =>
              setParams({ page: String(Math.max(1, safePage - 1)) })
            }
            className="flex size-8 items-center justify-center rounded-lg border text-muted-foreground transition-colors hover:bg-muted disabled:opacity-50"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} size={14} />
          </button>
          {Array.from({ length: totalPages }, (_, index) => index + 1)
            .slice(0, 5)
            .map((page) => (
              <button
                type="button"
                key={page}
                onClick={() => setParams({ page: String(page) })}
                className={`flex size-8 items-center justify-center rounded-lg text-xs font-medium transition-colors ${safePage === page ? "bg-primary text-primary-foreground" : "border text-muted-foreground hover:bg-muted"}`}
              >
                {page}
              </button>
            ))}
          <button
            type="button"
            disabled={safePage === totalPages}
              onClick={() =>
                setParams({
                  page: String(Math.min(totalPages, safePage + 1)),
                })
              }
            className="flex size-8 items-center justify-center rounded-lg border text-muted-foreground transition-colors hover:bg-muted disabled:opacity-50"
          >
            <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}
