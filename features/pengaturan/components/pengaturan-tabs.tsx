"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ComputerDesk01Icon,
  UserCircleIcon,
  UserSettings01Icon,
} from "@hugeicons/core-free-icons"

import { cn } from "@/lib/utils"

type PengaturanTabsProps = {
  basePath: "/admin/pengaturan" | "/cashier/pengaturan"
  canManageUsers?: boolean
}

export function PengaturanTabs({
  basePath,
  canManageUsers = false,
}: PengaturanTabsProps) {
  const pathname = usePathname()
  const tabs = [
    { href: basePath, label: "Profile", icon: UserCircleIcon },
    ...(canManageUsers
      ? [
          {
            href: `${basePath}/akun`,
            label: "Manajemen Akun",
            icon: UserSettings01Icon,
          },
        ]
      : []),
    { href: `${basePath}/tema`, label: "Tema", icon: ComputerDesk01Icon },
  ]

  return (
    <div className="scrollbar-none -mx-4 flex gap-1 overflow-x-auto border-b px-4 lg:mx-0 lg:px-0">
      {tabs.map((tab) => {
        const isActive =
          tab.href === basePath
            ? pathname === basePath
            : pathname === tab.href || pathname.startsWith(`${tab.href}/`)

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "inline-flex shrink-0 items-center gap-2 border-b-2 px-3 py-2.5 text-sm font-medium transition-colors",
              isActive
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
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
