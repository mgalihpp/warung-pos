"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { ComputerDesk01Icon, UserCircleIcon } from "@hugeicons/core-free-icons"

import { ProfileTab, TemaTab, type SettingsUser } from "@/components/pengaturan/pengaturan-content"
import { cn } from "@/lib/utils"

type PengaturanCashierContentProps = {
  currentUser: SettingsUser | null
}

export function PengaturanCashierContent({ currentUser }: PengaturanCashierContentProps) {
  const [activeTab, setActiveTab] = React.useState<"profile" | "tema">("profile")
  const displayUser = currentUser ?? {
    id: "",
    name: "Pengguna",
    email: "-",
    role: "cashier",
    banned: false,
  }

  return (
    <div className="flex flex-1 min-w-0 min-h-0 flex-col gap-3 overflow-y-auto p-4 lg:gap-6 lg:p-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight lg:text-2xl">Pengaturan</h1>
        <p className="text-sm text-muted-foreground">
          Kelola profil pengguna dan tema aplikasi.
        </p>
      </div>

      <div className="scrollbar-none -mx-4 flex gap-1 overflow-x-auto border-b px-4 lg:mx-0 lg:px-0">
        {[
          { value: "profile", label: "Profile", icon: UserCircleIcon },
          { value: "tema", label: "Tema", icon: ComputerDesk01Icon },
        ].map((tab) => {
          const isActive = activeTab === tab.value
          return (
            <button
              key={tab.value}
              type="button"
              onClick={() => setActiveTab(tab.value as "profile" | "tema")}
              className={cn(
                "inline-flex shrink-0 items-center gap-2 border-b-2 px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground",
              )}
            >
              <HugeiconsIcon icon={tab.icon} size={16} />
              {tab.label}
            </button>
          )
        })}
      </div>

      {activeTab === "profile" && <ProfileTab displayUser={displayUser} />}
      {activeTab === "tema" && <TemaTab />}
    </div>
  )
}
