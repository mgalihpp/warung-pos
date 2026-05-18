"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  AnalyticsUpIcon,
  ArrowDown01Icon,
  ArrowUp01Icon,
  ChartLineData01Icon,
  Clock01Icon,
  DollarCircleIcon,
  InvoiceIcon,
  StarIcon,
  Wallet03Icon,
} from "@hugeicons/core-free-icons"
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Label,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Skeleton } from "@/components/ui/skeleton"
import { formatRupiah, formatNumber } from "@/lib/format-currency"
import {
  useLaporanPenjualan,
  type LaporanRange,
  type PenjualanData,
} from "@/features/laporan/hooks/use-laporan-queries"

const RANGE_OPTIONS: { value: LaporanRange; label: string }[] = [
  { value: "7d", label: "7 Hari" },
  { value: "30d", label: "30 Hari" },
  { value: "ytd", label: "Tahun Ini" },
]

const RANGE_LABEL: Record<LaporanRange, string> = {
  "7d": "7 hari terakhir",
  "30d": "30 hari terakhir",
  ytd: "tahun ini",
}

export function LaporanContent({ initialData }: { initialData?: PenjualanData }) {
  const [range, setRange] = React.useState<LaporanRange>(initialData?.range ?? "30d")
  const { data, isLoading, error } = useLaporanPenjualan(range, initialData)

  return (
    <div className="flex min-w-0 flex-col gap-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          Ringkasan penjualan {RANGE_LABEL[range]}
        </p>
        <RangeSelector value={range} onChange={setRange} />
      </div>

      {error ? (
        <div className="rounded-xl border bg-card p-6 text-center text-sm text-destructive">
          Gagal memuat laporan penjualan. Silakan coba lagi.
        </div>
      ) : isLoading || !data ? (
        <PenjualanSkeleton />
      ) : (
        <PenjualanDashboard data={data} />
      )}
    </div>
  )
}

function RangeSelector({
  value,
  onChange,
}: {
  value: LaporanRange
  onChange: (value: LaporanRange) => void
}) {
  return (
    <div className="inline-flex w-fit items-center gap-1 rounded-lg border bg-card p-1 shadow-sm">
      {RANGE_OPTIONS.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
            value === opt.value
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-muted"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}

function PenjualanDashboard({ data }: { data: PenjualanData }) {
  const stats = [
    {
      title: "Penjualan",
      value: formatRupiah(data.stats.penjualan.value),
      change: data.stats.penjualan.change,
      icon: DollarCircleIcon,
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
    },
    {
      title: "Laba Kotor",
      value: formatRupiah(data.stats.labaKotor.value),
      change: data.stats.labaKotor.change,
      icon: ChartLineData01Icon,
      iconBg: "bg-emerald-500/10",
      iconColor: "text-emerald-600",
    },
    {
      title: "Total Transaksi",
      value: formatNumber(data.stats.totalTransaksi.value),
      change: data.stats.totalTransaksi.change,
      icon: InvoiceIcon,
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-600",
    },
    {
      title: "Rata-rata Belanja",
      value: formatRupiah(data.stats.rataBelanja.value),
      change: data.stats.rataBelanja.change,
      icon: Wallet03Icon,
      iconBg: "bg-violet-500/10",
      iconColor: "text-violet-600",
    },
  ]

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      <div className="grid min-w-0 grid-cols-1 gap-4 2xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className="flex min-w-0 flex-col gap-4">
          <div className="grid min-w-0 grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.5fr)_minmax(340px,0.9fr)]">
            <SalesTrendCard data={data.salesTrend} />
            <div className="flex min-w-0 flex-col gap-4">
              <CategoryCard data={data.categoryBreakdown} />
              <PaymentMethodCard data={data.paymentMethods} />
            </div>
          </div>
          <DailySummaryTable rows={data.dailySummary} />
        </div>

        <div className="grid h-fit content-start items-start gap-4 lg:grid-cols-2 2xl:grid-cols-1">
          <TopProductsCard items={data.topProducts} />
          <TopCashiersCard items={data.topCashiers} />
          <QuickInsightCard data={data} />
        </div>
      </div>
    </div>
  )
}

function StatCard({
  title,
  value,
  change,
  icon,
  iconBg,
  iconColor,
}: {
  title: string
  value: string
  change: number | null
  icon: typeof DollarCircleIcon
  iconBg: string
  iconColor: string
}) {
  const positive = change !== null && change >= 0
  return (
    <div className="flex items-center gap-3 rounded-xl border bg-card p-3 shadow-sm lg:gap-4 lg:p-4">
      <div
        className={`flex size-10 shrink-0 items-center justify-center rounded-xl lg:size-12 ${iconBg}`}
      >
        <HugeiconsIcon icon={icon} size={20} className={iconColor} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-medium text-muted-foreground">{title}</p>
        <p className="truncate text-base font-bold tracking-tight lg:text-lg">
          {value}
        </p>
        <p className="flex items-center gap-1 text-[10px] text-muted-foreground">
          {change !== null ? (
            <>
              <HugeiconsIcon
                icon={positive ? ArrowUp01Icon : ArrowDown01Icon}
                size={12}
                className={positive ? "text-emerald-600" : "text-rose-600"}
              />
              <span
                className={`font-semibold ${positive ? "text-emerald-600" : "text-rose-600"}`}
              >
                {Math.abs(change)}%
              </span>
              <span>vs periode lalu</span>
            </>
          ) : (
            "Belum ada pembanding"
          )}
        </p>
      </div>
    </div>
  )
}

const salesChartConfig = {
  penjualan: { label: "Penjualan", color: "var(--color-chart-4)" },
  laba: { label: "Laba", color: "var(--color-chart-2)" },
} satisfies ChartConfig

function SalesTrendCard({
  data,
}: {
  data: PenjualanData["salesTrend"]
}) {
  const total = data.reduce((s, d) => s + d.penjualan, 0)
  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold">Tren Penjualan</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Penjualan & laba per periode
          </p>
        </div>
        <div className="hidden rounded-lg border bg-background px-3 py-2 text-xs shadow-sm sm:block">
          <p className="text-muted-foreground">Total Periode</p>
          <p className="font-bold">{formatRupiah(total)}</p>
        </div>
      </div>
      {data.length === 0 ? (
        <EmptyState message="Belum ada transaksi pada periode ini" />
      ) : (
        <ChartContainer config={salesChartConfig} className="h-[260px] w-full">
          <AreaChart
            data={data}
            margin={{ left: 2, right: 8, top: 8, bottom: 0 }}
          >
            <defs>
              <linearGradient id="penjualanGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-chart-4)" stopOpacity={0.28} />
                <stop offset="95%" stopColor="var(--color-chart-4)" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="labaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-chart-2)" stopOpacity={0.28} />
                <stop offset="95%" stopColor="var(--color-chart-2)" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              fontSize={11}
              tickMargin={10}
              interval="preserveStartEnd"
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              fontSize={11}
              tickFormatter={(v) =>
                Number(v) >= 1_000_000
                  ? `${(Number(v) / 1_000_000).toFixed(1)}M`
                  : `${Math.round(Number(v) / 1000)}k`
              }
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area
              type="monotone"
              dataKey="penjualan"
              stroke="var(--color-chart-4)"
              strokeWidth={3}
              fill="url(#penjualanGradient)"
              activeDot={{ r: 4 }}
            />
            <Area
              type="monotone"
              dataKey="laba"
              stroke="var(--color-chart-2)"
              strokeWidth={2}
              fill="url(#labaGradient)"
              activeDot={{ r: 3 }}
            />
          </AreaChart>
        </ChartContainer>
      )}
    </div>
  )
}

function CategoryCard({
  data,
}: {
  data: PenjualanData["categoryBreakdown"]
}) {
  const config: ChartConfig = Object.fromEntries(
    data.map((d) => [d.name, { label: d.name, color: d.fill }]),
  )
  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm">
      <h2 className="mb-3 text-sm font-semibold">Komposisi Penjualan</h2>
      {data.length === 0 ? (
        <EmptyState message="Belum ada data kategori" />
      ) : (
        <div className="grid items-center gap-3 sm:grid-cols-[180px_1fr] xl:grid-cols-1 2xl:grid-cols-[170px_1fr]">
          <ChartContainer config={config} className="mx-auto aspect-square h-[180px]">
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent />} />
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={52}
                outerRadius={78}
                strokeWidth={4}
                stroke="var(--color-card)"
              >
                {data.map((entry) => (
                  <Cell key={entry.name} fill={entry.fill} />
                ))}
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) - 6}
                            className="fill-muted-foreground text-[10px]"
                          >
                            Total
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 10}
                            className="fill-foreground text-[10px] font-medium"
                          >
                            Penjualan
                          </tspan>
                        </text>
                      )
                    }
                  }}
                />
              </Pie>
            </PieChart>
          </ChartContainer>
          <div className="space-y-2">
            {data.map((item) => (
              <div key={item.name} className="flex items-center gap-2 text-xs">
                <span
                  className="size-2.5 rounded-full"
                  style={{ backgroundColor: item.fill }}
                />
                <span className="truncate text-muted-foreground">{item.name}</span>
                <span className="ml-auto font-bold">{item.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function PaymentMethodCard({
  data,
}: {
  data: PenjualanData["paymentMethods"]
}) {
  const colorMap: Record<string, string> = {
    Tunai: "bg-emerald-600",
    QRIS: "bg-blue-600",
    Transfer: "bg-violet-600",
  }
  const total = data.reduce((s, d) => s + d.amount, 0)
  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm">
      <h2 className="mb-4 text-sm font-semibold">Metode Pembayaran</h2>
      {total === 0 ? (
        <EmptyState message="Belum ada pembayaran tercatat" />
      ) : (
        <>
          <div className="mb-4 flex h-3 overflow-hidden rounded-full bg-muted">
            {data.map((p) => (
              <div
                key={p.name}
                className={colorMap[p.name]}
                style={{ width: `${p.percentage}%` }}
                title={`${p.name} ${p.percentage}%`}
              />
            ))}
          </div>
          <div className="space-y-3">
            {data.map((p) => (
              <div
                key={p.name}
                className="grid grid-cols-[72px_minmax(0,1fr)_36px] items-center gap-3 text-xs"
              >
                <div className="flex items-center gap-2 font-semibold">
                  <span className={`size-2.5 rounded-full ${colorMap[p.name]}`} />
                  <span>{p.name}</span>
                </div>
                <span className="truncate text-right font-semibold">
                  {formatRupiah(p.amount)}
                </span>
                <span className="text-right text-muted-foreground">
                  {p.percentage}%
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

function DailySummaryTable({ rows }: { rows: PenjualanData["dailySummary"] }) {
  return (
    <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
      <div className="flex flex-col gap-2 border-b p-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-sm font-semibold">Ringkasan Penjualan Harian</h2>
        <span className="inline-flex w-fit items-center gap-2 rounded-md border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground">
          <HugeiconsIcon icon={Clock01Icon} size={14} />
          {rows.length > 0 ? `${rows.length} hari` : "Tidak ada data"}
        </span>
      </div>
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[760px] text-left text-xs">
          <thead className="bg-muted/50 text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-semibold">Tanggal</th>
              <th className="px-4 py-3 text-center font-semibold">Transaksi</th>
              <th className="px-4 py-3 text-right font-semibold">Penjualan</th>
              <th className="px-4 py-3 text-right font-semibold">Laba Kotor</th>
              <th className="px-4 py-3 text-right font-semibold">
                Rata-rata Belanja
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-8 text-center text-muted-foreground"
                >
                  Belum ada data penjualan
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr
                  key={row.dateKey}
                  className="border-t transition-colors hover:bg-muted/30"
                >
                  <td className="px-4 py-2.5 font-medium">{row.date}</td>
                  <td className="px-4 py-2.5 text-center">{row.transaksi}</td>
                  <td className="px-4 py-2.5 text-right font-medium">
                    {formatRupiah(row.penjualan)}
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    {formatRupiah(row.laba)}
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    {formatRupiah(row.rataBelanja)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ── Mobile/Tablet Card List (<md) ── */}
      <div className="flex flex-col gap-2 md:hidden p-4 pt-0">
        {rows.length === 0 ? (
          <div className="py-6 text-center text-xs text-muted-foreground">
            Belum ada data penjualan
          </div>
        ) : (
          rows.map((row) => (
            <div
              key={row.dateKey}
              className="flex items-center justify-between gap-3 rounded-lg border border-border/50 bg-background px-3 py-2.5"
            >
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold">{row.date}</p>
                <p className="text-[11px] text-muted-foreground">
                  {row.transaksi} transaksi
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold">{formatRupiah(row.penjualan)}</p>
                <p className="text-[10px] text-muted-foreground">
                  Laba {formatRupiah(row.laba)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

function TopProductsCard({
  items,
}: {
  items: PenjualanData["topProducts"]
}) {
  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm">
      <h2 className="mb-3 text-sm font-semibold">Barang Terlaris</h2>
      {items.length === 0 ? (
        <EmptyState message="Belum ada barang terjual" small />
      ) : (
        <div className="space-y-3">
          {items.map((item, index) => (
            <div
              key={item.id}
              className="grid grid-cols-[26px_1fr_auto] items-center gap-3"
            >
              <span className="flex size-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                {index + 1}
              </span>
              <div className="min-w-0">
                <p className="truncate text-xs font-bold">{item.name}</p>
                <p className="text-[11px] text-muted-foreground">
                  Terjual {item.sold} {item.unit}
                </p>
              </div>
              <p className="text-xs font-bold whitespace-nowrap text-primary">
                {formatRupiah(item.revenue)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function TopCashiersCard({
  items,
}: {
  items: PenjualanData["topCashiers"]
}) {
  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm">
      <h2 className="mb-3 text-sm font-semibold">Performa Kasir</h2>
      {items.length === 0 ? (
        <EmptyState message="Belum ada aktivitas kasir" small />
      ) : (
        <div className="space-y-3">
          {items.map((item, index) => (
            <div
              key={item.id}
              className="grid grid-cols-[26px_36px_1fr_auto] items-center gap-3"
            >
              <span className="flex size-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                {index + 1}
              </span>
              <span className="flex size-9 items-center justify-center rounded-lg bg-sky-500/10 text-[11px] font-bold text-sky-600">
                {item.name.slice(0, 1).toUpperCase()}
              </span>
              <div className="min-w-0">
                <p className="truncate text-xs font-bold">{item.name}</p>
                <p className="text-[11px] text-muted-foreground">
                  {item.count} transaksi
                </p>
              </div>
              <p className="text-xs font-bold whitespace-nowrap text-primary">
                {formatRupiah(item.revenue)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function QuickInsightCard({ data }: { data: PenjualanData }) {
  const bestDay = [...data.salesTrend].sort((a, b) => b.penjualan - a.penjualan)[0]
  const topCategory = data.categoryBreakdown[0]
  const topProduct = data.topProducts[0]

  const insights = [
    bestDay && bestDay.penjualan > 0
      ? {
          text: `Hari terbaik: ${bestDay.date} (${formatRupiah(bestDay.penjualan)})`,
          icon: StarIcon,
          tone: "bg-primary/10 text-primary",
        }
      : null,
    topCategory
      ? {
          text: `Kategori unggulan: ${topCategory.name} (${topCategory.pct}%)`,
          icon: AnalyticsUpIcon,
          tone: "bg-blue-500/10 text-blue-600",
        }
      : null,
    topProduct
      ? {
          text: `Barang terlaris: ${topProduct.name}`,
          icon: ChartLineData01Icon,
          tone: "bg-emerald-500/10 text-emerald-600",
        }
      : null,
  ].filter((i): i is NonNullable<typeof i> => Boolean(i))

  if (insights.length === 0) return null

  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm lg:col-span-2 2xl:col-span-1">
      <h2 className="mb-4 text-sm font-semibold">Insight Cepat</h2>
      <div className="space-y-3">
        {insights.map((insight) => (
          <div
            key={insight.text}
            className={`flex items-center gap-3 rounded-lg px-3 py-3 text-xs font-semibold ${insight.tone}`}
          >
            <HugeiconsIcon icon={insight.icon} size={18} />
            <span className="leading-snug">{insight.text}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function EmptyState({
  message,
  small = false,
}: {
  message: string
  small?: boolean
}) {
  return (
    <div
      className={`flex items-center justify-center text-center text-xs text-muted-foreground ${small ? "py-6" : "py-12"}`}
    >
      {message}
    </div>
  )
}

function PenjualanSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-20 rounded-xl" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.5fr)_minmax(340px,0.9fr)]">
        <Skeleton className="h-[320px] rounded-xl" />
        <div className="flex flex-col gap-4">
          <Skeleton className="h-[180px] rounded-xl" />
          <Skeleton className="h-[180px] rounded-xl" />
        </div>
      </div>
      <Skeleton className="h-[280px] rounded-xl" />
    </div>
  )
}
