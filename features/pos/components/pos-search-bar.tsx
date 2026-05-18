"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import { Search01Icon, Cancel01Icon } from "@hugeicons/core-free-icons"

import { cn } from "@/lib/utils"

type PosSearchBarProps = {
  value: string
  onChange: (value: string) => void
  className?: string
}

export function PosSearchBar({ value, onChange, className }: PosSearchBarProps) {
  return (
    <div className="relative h-full w-full">
      <HugeiconsIcon
        icon={Search01Icon}
        size={16}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Cari barang..."
        className={cn(
          "w-full bg-card border pl-9 pr-9 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors rounded-lg py-2 text-sm",
          className
        )}
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <HugeiconsIcon icon={Cancel01Icon} size={14} />
        </button>
      )}
    </div>
  )
}
