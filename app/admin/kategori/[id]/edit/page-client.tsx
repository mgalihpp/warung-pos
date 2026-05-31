"use client"

import { notFound } from "next/navigation"
import { use } from "react"

import { KategoriFormPage } from "@/features/kategori/components/kategori-form-page"
import { useKategori } from "@/features/kategori/hooks/use-kategori-queries"
import type { KategoriPageData } from "@/features/kategori/types"

export function EditKategoriPageClient({
  params,
  initialData,
}: {
  params: Promise<{ id: string }>
  initialData: KategoriPageData
}) {
  const { id } = use(params)
  const { data, isLoading } = useKategori(initialData)

  if (isLoading || !data) {
    return <KategoriFormPageSkeleton />
  }

  const category = data.categories.find((item) => item.id === id)

  if (!category) {
    notFound()
  }

  return <KategoriFormPage mode="edit" category={category} />
}

function KategoriFormPageSkeleton() {
  return (
    <div className="flex min-w-0 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="mx-auto w-full max-w-3xl space-y-2">
        <div className="h-8 w-52 animate-pulse rounded-lg bg-muted" />
        <div className="h-4 w-80 animate-pulse rounded-lg bg-muted" />
      </div>
      <div className="mx-auto w-full max-w-3xl">
        <div className="h-72 animate-pulse rounded-xl bg-muted" />
      </div>
    </div>
  )
}
