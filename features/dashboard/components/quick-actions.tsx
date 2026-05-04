"use client"

import Link from "next/link"
import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  AddInvoiceIcon,
  PackageIcon,
  ArrowRight01Icon,
  InvoiceIcon,
  PlusSignIcon,
} from "@hugeicons/core-free-icons"

const actions = [
  {
    href: "/admin/pos",
    label: "Tambah Transaksi",
    icon: AddInvoiceIcon,
    cardClass:
      "bg-primary text-primary-foreground hover:bg-primary/90",
    iconClass: "",
    fabClass:
      "bg-primary text-primary-foreground hover:bg-primary/90",
  },
  {
    href: "/admin/transaksi",
    label: "Lihat Transaksi",
    icon: InvoiceIcon,
    cardClass: "bg-primary/10 text-primary hover:bg-primary/20",
    iconClass: "text-primary",
    fabClass: "border bg-card text-foreground hover:bg-muted",
  },
  {
    href: "/admin/produk/tambah",
    label: "Tambah Produk",
    icon: PackageIcon,
    cardClass:
      "bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20 dark:text-yellow-500",
    iconClass: "text-yellow-600 dark:text-yellow-500",
    fabClass:
      "border bg-card text-yellow-600 hover:bg-yellow-500/10 dark:text-yellow-500",
  },
] as const

export function QuickActions() {
  return (
    <div className="hidden grid-cols-1 gap-2 2xl:grid">
      {actions.map((action) => (
        <Link
          key={action.href}
          href={action.href}
          className={`group flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium shadow-sm transition-colors ${action.cardClass}`}
        >
          <div className="flex items-center gap-2.5">
            <HugeiconsIcon
              icon={action.icon}
              size={18}
              className={action.iconClass}
            />
            <span>{action.label}</span>
          </div>
          <HugeiconsIcon
            icon={ArrowRight01Icon}
            size={16}
            className="-translate-x-2 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100"
          />
        </Link>
      ))}
    </div>
  )
}

export function QuickActionsFab() {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <div className="2xl:hidden">
      {isOpen && (
        <div className="pointer-events-none fixed inset-0 z-30 bg-background/60 backdrop-blur-[2px]" />
      )}

      <div className="pointer-events-none fixed right-4 bottom-[calc(5rem+env(safe-area-inset-bottom))] z-40 flex flex-col items-end gap-3 sm:right-6 lg:bottom-6">
        <div
          className={`flex flex-col items-end gap-3 transition-all duration-200 ${
            isOpen
              ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
              : "pointer-events-none translate-y-4 scale-95 opacity-0"
          }`}
          onClick={() => setIsOpen(false)}
        >
          {actions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="group flex items-center justify-end gap-3"
            >
              <span className="rounded-md border bg-card px-2.5 py-1.5 text-xs font-semibold shadow-sm transition-colors group-hover:bg-muted">
                {action.label}
              </span>
              <span
                className={`flex size-11 items-center justify-center rounded-full shadow-sm transition-colors ${action.fabClass}`}
              >
                <HugeiconsIcon icon={action.icon} size={20} />
              </span>
            </Link>
          ))}
        </div>

        <button
          type="button"
          aria-label={isOpen ? "Tutup aksi cepat" : "Buka aksi cepat"}
          aria-expanded={isOpen}
          onClick={() => setIsOpen((current) => !current)}
          className={`pointer-events-auto flex size-14 items-center justify-center rounded-full shadow-lg transition-all duration-200 active:scale-95 ${
            isOpen
              ? "border bg-card text-foreground"
              : "bg-primary text-primary-foreground"
          }`}
        >
          <HugeiconsIcon
            icon={PlusSignIcon}
            size={28}
            className={`transition-transform duration-200 ${isOpen ? "rotate-45" : ""}`}
          />
        </button>
      </div>
    </div>
  )
}
