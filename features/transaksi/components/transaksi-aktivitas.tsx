"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import {
  CheckmarkCircle02Icon,
  TimeQuarterPassIcon,
  Cancel01Icon,
} from "@hugeicons/core-free-icons"
import type { TransactionActivity } from "../hooks/use-transaksi-queries"

const iconMap = {
  completed: {
    icon: CheckmarkCircle02Icon,
    iconColor: "text-emerald-600",
    iconBg: "bg-emerald-500/10",
  },
  pending: {
    icon: TimeQuarterPassIcon,
    iconColor: "text-amber-600",
    iconBg: "bg-amber-500/10",
  },
  cancelled: {
    icon: Cancel01Icon,
    iconColor: "text-red-600",
    iconBg: "bg-red-500/10",
  },
} as const

export function TransaksiAktivitas({ activities }: { activities: TransactionActivity[] }) {
  if (activities.length === 0) {
    return (
      <div className="rounded-xl border bg-card p-4 shadow-sm">
        <h3 className="mb-3 text-sm font-semibold">Aktivitas Transaksi Terbaru</h3>
        <p className="py-6 text-center text-sm text-muted-foreground">Belum ada aktivitas transaksi.</p>
      </div>
    )
  }

  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm">
      <h3 className="mb-3 text-sm font-semibold">Aktivitas Transaksi Terbaru</h3>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {activities.map((activity) => {
          const visual = iconMap[activity.type] ?? iconMap.completed

          return (
            <div
              key={activity.transactionNumber + activity.label}
              className="flex items-center gap-3 rounded-lg border border-border/50 bg-muted/20 px-3 py-2.5"
            >
              <div
                className={`flex size-8 shrink-0 items-center justify-center rounded-full ${visual.iconBg}`}
              >
                <HugeiconsIcon
                  icon={visual.icon}
                  size={14}
                  className={visual.iconColor}
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-medium text-muted-foreground">{activity.label}</p>
                <p className="truncate text-xs font-medium">
                  {activity.transactionNumber}
                </p>
              </div>
              <span className="shrink-0 text-[10px] text-muted-foreground">
                {activity.time}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
