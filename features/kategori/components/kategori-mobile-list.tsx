"use client"

import * as React from "react"
import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Cancel01Icon,
  Edit02Icon,
  Search01Icon,
  TagsIcon,
} from "@hugeicons/core-free-icons"

import { useSearchParam } from "@/hooks/use-search-param"
import type { KategoriItem } from "../types"

export function KategoriMobileList({
  categories,
}: {
  categories: KategoriItem[]
}) {
  const [q, setQ] = useSearchParam("search", "")
  const query = q.trim().toLowerCase()
  const filtered = React.useMemo(() => {
    if (!query) return categories
    return categories.filter((category) =>
      category.name.toLowerCase().includes(query)
    )
  }, [categories, query])

  return (
    <div className="flex h-full min-h-0 flex-col lg:hidden">
      <div className="relative shrink-0 px-4 pt-3">
        <div className="flex h-11 items-center overflow-hidden rounded-xl border bg-card px-2 shadow-sm">
          <HugeiconsIcon
            icon={Search01Icon}
            size={16}
            className="ml-2 shrink-0 text-muted-foreground"
          />
          <input
            type="text"
            value={q}
            onChange={(event) => setQ(event.target.value)}
            placeholder="Cari kategori..."
            className="h-full min-w-0 flex-1 bg-transparent px-3 text-[13px] leading-none outline-none placeholder:text-muted-foreground"
            inputMode="search"
          />
          {q ? (
            <button
              type="button"
              onClick={() => setQ("")}
              className="flex h-full w-10 items-center justify-center text-muted-foreground hover:text-foreground"
              aria-label="Hapus pencarian"
            >
              <HugeiconsIcon icon={Cancel01Icon} size={16} />
            </button>
          ) : null}
        </div>
      </div>

      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 pt-4 pb-[calc(1.5rem+env(safe-area-inset-bottom))]">
        {filtered.map((category) => (
          <div
            key={category.id}
            className="rounded-2xl border bg-card p-4 shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600">
                <HugeiconsIcon icon={TagsIcon} size={28} />
              </div>
              <p className="min-w-0 flex-1 truncate text-base font-semibold">
                {category.name}
              </p>
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
          <div className="p-4 text-center text-sm text-muted-foreground">
            Kategori tidak ditemukan.
          </div>
        ) : null}
      </div>
    </div>
  )
}
