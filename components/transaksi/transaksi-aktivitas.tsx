"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import {
  CheckmarkCircle02Icon,
  ShoppingCart01Icon,
  TimeQuarterPassIcon,
  Cancel01Icon,
} from "@hugeicons/core-free-icons"

const activities = [
  {
    icon: CheckmarkCircle02Icon,
    iconColor: "text-emerald-600",
    iconBg: "bg-emerald-500/10",
    label: "Pembayaran diterima",
    transactionNumber: "TRX-240524-101",
    time: "09:42",
  },
  {
    icon: ShoppingCart01Icon,
    iconColor: "text-blue-600",
    iconBg: "bg-blue-500/10",
    label: "Transaksi selesai",
    transactionNumber: "TRX-240524-100",
    time: "09:16",
  },
  {
    icon: TimeQuarterPassIcon,
    iconColor: "text-amber-600",
    iconBg: "bg-amber-500/10",
    label: "Transaksi pending",
    transactionNumber: "TRX-240524-098",
    time: "08:23",
  },
  {
    icon: Cancel01Icon,
    iconColor: "text-red-600",
    iconBg: "bg-red-500/10",
    label: "Transaksi dibatalkan",
    transactionNumber: "TRX-240524-096",
    time: "07:35",
  },
]

export function TransaksiAktivitas() {
  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm">
      <h3 className="mb-3 text-sm font-semibold">Aktivitas Transaksi Terbaru</h3>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {activities.map((activity) => (
          <div
            key={activity.transactionNumber + activity.label}
            className="flex items-center gap-3 rounded-lg border border-border/50 bg-muted/20 px-3 py-2.5"
          >
            <div
              className={`flex size-8 shrink-0 items-center justify-center rounded-full ${activity.iconBg}`}
            >
              <HugeiconsIcon
                icon={activity.icon}
                size={14}
                className={activity.iconColor}
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
        ))}
      </div>
    </div>
  )
}
