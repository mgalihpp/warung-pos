"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ChartHistogramIcon,
  PackageIcon,
} from "@hugeicons/core-free-icons"

import { cn } from "@/lib/utils"

const tabs = [
  { href: "/admin/laporan", label: "Penjualan", icon: ChartHistogramIcon },
  { href: "/admin/laporan/stok", label: "Stok", icon: PackageIcon },
]

export function LaporanTabs() {
  const pathname = usePathname()
  return (
    <div className="scrollbar-none -mx-4 flex gap-1 overflow-x-auto border-b px-4 lg:mx-0 lg:px-0">
      {tabs.map((tab) => {
        const isActive =
          tab.href === "/admin/laporan"
            ? pathname === "/admin/laporan"
            : pathname === tab.href || pathname.startsWith(`${tab.href}/`)
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "inline-flex shrink-0 items-center gap-2 border-b-2 px-3 py-2.5 text-sm font-medium transition-colors",
              isActive
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            <HugeiconsIcon icon={tab.icon} size={16} />
            {tab.label}
          </Link>
        )
      })}
    </div>
  )
}
