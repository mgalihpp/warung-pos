"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import { Search01Icon, Cancel01Icon } from "@hugeicons/core-free-icons"

import { cn } from "@/lib/utils"

type PosSearchBarProps = {
  value: string
  onChange: (value: string) => void
  className?: string
}

export function PosSearchBar({
  value,
  onChange,
  className,
}: PosSearchBarProps) {
  return (
    <div className="relative h-full w-full">
      <HugeiconsIcon
        icon={Search01Icon}
        size={16}
        className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Cari barang..."
        className={cn(
          "w-full rounded-lg border bg-card py-2 pr-9 pl-9 text-sm text-foreground transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none",
          className
        )}
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
        >
          <HugeiconsIcon icon={Cancel01Icon} size={14} />
        </button>
      )}
    </div>
  )
}
