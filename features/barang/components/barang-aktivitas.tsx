"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import { PlusSignIcon, ArrowRight01Icon } from "@hugeicons/core-free-icons"
import type { BarangActivityItem } from "../types"

type BarangAktivitasProps = {
  activities: BarangActivityItem[]
}

export function BarangAktivitas({ activities }: BarangAktivitasProps) {
  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold">Aktivitas Barang Terbaru</h3>
        <button className="text-xs font-medium text-primary hover:underline">Lihat Semua</button>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {activities.length === 0 && (
          <div className="rounded-lg border border-dashed p-4 text-xs text-muted-foreground sm:col-span-2 xl:col-span-4">
            Belum ada aktivitas stok.
          </div>
        )}
        {activities.map((act, i) => (
          <div key={i} className="flex items-center gap-3 rounded-lg border border-border/50 bg-muted/20 px-3 py-2.5">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <HugeiconsIcon icon={act.type === "added" ? PlusSignIcon : ArrowRight01Icon} size={14} className="text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-medium text-muted-foreground">{act.label}</p>
              <p className="truncate text-xs font-medium">{act.product}</p>
            </div>
            <span className="shrink-0 text-[10px] text-muted-foreground">{act.time}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
