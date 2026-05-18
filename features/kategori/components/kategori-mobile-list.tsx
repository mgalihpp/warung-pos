"use client"

import * as React from "react"
import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import { Edit02Icon, Search01Icon, TagsIcon } from "@hugeicons/core-free-icons"

import type { KategoriItem } from "../types"

export function KategoriMobileList({ categories }: { categories: KategoriItem[] }) {
  const [q, setQ] = React.useState("")
  const query = q.trim().toLowerCase()
  const filtered = React.useMemo(() => {
    if (!query) return categories
    return categories.filter((category) => category.name.toLowerCase().includes(query))
  }, [categories, query])

  return (
    <div className="lg:hidden">
      <div className="px-4 pt-4">
        <div className="relative h-14 w-full overflow-hidden rounded-2xl bg-muted/40">
          <HugeiconsIcon
            icon={Search01Icon}
            size={20}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="text"
            value={q}
            onChange={(event) => setQ(event.target.value)}
            placeholder="Cari kategori..."
            className="h-full w-full bg-transparent pl-12 pr-4 text-base outline-none placeholder:text-muted-foreground"
            inputMode="search"
          />
        </div>
      </div>

      <div className="space-y-3 px-4 pb-6 pt-4">
        {filtered.map((category) => (
          <div key={category.id} className="rounded-2xl border bg-card p-4 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600">
                <HugeiconsIcon icon={TagsIcon} size={28} />
              </div>
              <p className="min-w-0 flex-1 truncate text-base font-semibold">{category.name}</p>
              <Link
                href={`/admin/kategori/${category.id}/edit`}
                className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"
                aria-label={`Edit kategori ${category.name}`}
              >
                <HugeiconsIcon icon={Edit02Icon} size={20} />
              </Link>
            </div>
          </div>
        ))}

        {filtered.length === 0 ? (
          <div className="p-4 text-center text-sm text-muted-foreground">Kategori tidak ditemukan.</div>
        ) : null}
      </div>
    </div>
  )
}
