"use client"

import { use } from "react"
import { useProducts } from "@/features/barang/hooks/use-barang-queries"
import { BarangFormPage } from "@/features/barang/components/barang-form-page"
import { notFound } from "next/navigation"

export default function EditBarangPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const { data, isLoading } = useProducts()

  if (isLoading || !data) {
    return <BarangFormPageSkeleton />
  }

  const product = data.products.find((p) => p.id === id)

  if (!product) {
    notFound()
  }

  return (
    <BarangFormPage
      mode="edit"
      product={product}
      categories={data.categories}
      units={data.units}
      stats={data.stats}
    />
  )
}

function BarangFormPageSkeleton() {
  return (
    <div className="flex min-w-0 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="space-y-2">
        <div className="h-8 w-48 animate-pulse rounded-lg bg-muted" />
        <div className="h-4 w-72 animate-pulse rounded-lg bg-muted" />
      </div>
      <div className="flex gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-20 flex-1 animate-pulse rounded-xl bg-muted" />
        ))}
      </div>
      <div className="flex flex-col gap-6 xl:flex-row">
        <div className="flex-1 space-y-6">
          <div className="h-64 animate-pulse rounded-xl bg-muted" />
          <div className="h-48 animate-pulse rounded-xl bg-muted" />
        </div>
        <div className="w-full xl:w-[340px]">
          <div className="h-96 animate-pulse rounded-xl bg-muted" />
        </div>
      </div>
    </div>
  )
}
