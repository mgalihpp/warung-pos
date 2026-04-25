import { HugeiconsIcon } from "@hugeicons/react"
import {
  MoneyBag02Icon,
  ShoppingCart01Icon,
  ChartHistogramIcon,
  Alert02Icon,
} from "@hugeicons/core-free-icons"
import { formatRupiah } from "@/lib/format"

const stats = [
  {
    title: "Penjualan Hari Ini",
    value: 2450000,
    formatted: true,
    change: "+12,5%",
    changeLabel: "dibanding kemarin",
    positive: true,
    icon: MoneyBag02Icon,
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
    chartColor: "text-primary",
    chartData: [40, 30, 45, 60, 50, 75, 80],
  },
  {
    title: "Jumlah Transaksi",
    value: 86,
    formatted: false,
    change: "+8,7%",
    changeLabel: "dibanding kemarin",
    positive: true,
    icon: ShoppingCart01Icon,
    iconBg: "bg-blue-500/10",
    iconColor: "text-blue-600",
    chartColor: "text-blue-600",
    chartData: [20, 40, 30, 50, 45, 70, 86],
  },
  {
    title: "Omzet Bulanan",
    value: 78650000,
    formatted: true,
    change: "+15,3%",
    changeLabel: "dibanding bulan lalu",
    positive: true,
    icon: ChartHistogramIcon,
    iconBg: "bg-emerald-500/10",
    iconColor: "text-emerald-600",
    chartColor: "text-emerald-600",
    chartData: [60, 50, 65, 70, 85, 80, 95],
  },
  {
    title: "Produk Hampir Habis",
    value: 5,
    formatted: false,
    change: null,
    changeLabel: "Perlu restok segera",
    positive: false,
    icon: Alert02Icon,
    iconBg: "bg-destructive/10",
    iconColor: "text-destructive",
    chartColor: "text-destructive",
    chartData: [10, 8, 12, 5, 7, 6, 5],
  },
]

function Sparkline({ data, className }: { data: number[], className?: string }) {
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * 100
    const y = 100 - ((d - min) / range) * 100
    return `${x},${y}`
  }).join(" ")

  return (
    <svg viewBox="-5 -5 110 110" className={className} preserveAspectRatio="none">
      <polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth="12"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function StatCards() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.title}
          className="group relative overflow-hidden rounded-xl border bg-card p-4 shadow-sm transition-shadow hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${stat.iconBg}`}>
                <HugeiconsIcon icon={stat.icon} size={20} className={stat.iconColor} />
              </div>
              <div className="space-y-0.5">
                <p className="text-[11px] font-medium text-muted-foreground sm:text-xs">{stat.title}</p>
                <p className="text-lg font-bold tracking-tight sm:text-xl">
                  {stat.formatted ? formatRupiah(stat.value) : stat.value.toLocaleString("id-ID")}
                </p>
              </div>
            </div>
            <div className={`h-8 w-14 shrink-0 opacity-70 ${stat.chartColor}`}>
              <Sparkline data={stat.chartData} className="size-full" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1.5 pl-[3.25rem]">
            {stat.change ? (
              <>
                <span className={`text-[11px] font-semibold ${stat.positive ? "text-emerald-600" : "text-destructive"}`}>
                  {stat.positive ? "▲" : "▼"} {stat.change}
                </span>
                <span className="text-[10px] text-muted-foreground sm:text-[11px] min-w-0 truncate">{stat.changeLabel}</span>
              </>
            ) : (
              <span className="text-[11px] font-medium text-destructive">{stat.changeLabel}</span>
            )}
          </div>
          {/* Subtle gradient overlay on hover */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/[0.02] to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
        </div>
      ))}
    </div>
  )
}
