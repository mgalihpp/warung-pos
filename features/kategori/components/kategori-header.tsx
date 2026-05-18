"use client"

import * as React from "react"
import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import { PlusSignIcon } from "@hugeicons/core-free-icons"

import { Button } from "@/components/ui/button"

function KategoriCreateButton() {
  return (
    <Button asChild className="gap-2">
      <Link href="/admin/kategori/tambah">
        <HugeiconsIcon icon={PlusSignIcon} size={16} />
        Tambah Kategori
      </Link>
    </Button>
  )
}

export function KategoriHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)

  return (
    <>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight lg:text-2xl">Manajemen Kategori</h1>
          <p className="text-sm text-muted-foreground">Kelola kategori barang untuk katalog warung Anda</p>
        </div>

        <div className="hidden items-center gap-2 lg:flex">
          <KategoriCreateButton />
        </div>
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
            <KategoriCreateButton />
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`pointer-events-auto flex size-14 items-center justify-center rounded-full shadow-lg transition-all duration-200 active:scale-95 ${isMobileMenuOpen ? "border bg-card text-foreground" : "bg-primary text-primary-foreground"}`}
          >
            <HugeiconsIcon icon={PlusSignIcon} size={28} className={`transition-transform duration-200 ${isMobileMenuOpen ? "rotate-45" : ""}`} />
          </button>
        </div>
      </div>
    </>
  )
}
