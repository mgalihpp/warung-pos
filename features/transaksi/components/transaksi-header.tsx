"use client"

import * as React from "react"
import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  PlusSignIcon,
} from "@hugeicons/core-free-icons"

export function TransaksiHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)

  return (
    <>
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight lg:text-2xl">Manajemen Transaksi</h1>
          <p className="text-sm text-muted-foreground">Pantau, cari, dan kelola seluruh transaksi warung Anda</p>
        </div>

        {/* Desktop Actions */}
        <div className="hidden xl:flex items-center gap-2">
          <Link
            href="/admin/pos"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
          >
            <HugeiconsIcon icon={PlusSignIcon} size={16} />
            Transaksi Baru
          </Link>
        </div>
      </div>

      {/* Mobile Floating Action Button Overlay & Menu */}
      <div className="contents xl:hidden">
        {isMobileMenuOpen && (
          <div
            className="pointer-events-none fixed inset-0 z-30 bg-background/60 backdrop-blur-[2px] transition-opacity"
          />
        )}

        <div className="pointer-events-none fixed right-4 bottom-[calc(5rem+env(safe-area-inset-bottom))] z-40 flex flex-col items-end gap-3 sm:right-6 lg:bottom-6">
          <div
            className={`flex flex-col items-end gap-3 transition-all duration-200 origin-bottom ${
              isMobileMenuOpen
                ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
                : "pointer-events-none translate-y-4 scale-95 opacity-0"
            }`}
          >
            <Link
              href="/admin/pos"
              className="group flex items-center justify-end gap-3"
            >
              <span className="rounded-md bg-primary px-2.5 py-1.5 text-xs font-semibold text-primary-foreground shadow-sm transition-colors group-hover:bg-primary/90">
                Transaksi Baru
              </span>
              <div className="flex size-11 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm transition-colors group-hover:bg-primary/90">
                <HugeiconsIcon icon={PlusSignIcon} size={20} />
              </div>
            </Link>
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`pointer-events-auto flex size-14 items-center justify-center rounded-full shadow-lg transition-all duration-200 active:scale-95 ${
              isMobileMenuOpen ? "bg-card text-foreground border" : "bg-primary text-primary-foreground"
            }`}
          >
            <HugeiconsIcon
              icon={PlusSignIcon}
              size={28}
              className={`transition-transform duration-200 ${isMobileMenuOpen ? "rotate-45" : ""}`}
            />
          </button>
        </div>
      </div>
    </>
  )
}
