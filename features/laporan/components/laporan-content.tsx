"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  AnalyticsUpIcon,
  ArrowDown01Icon,
  ArrowRight01Icon,
  ArrowUp01Icon,
  Calendar02Icon,
  ChartLineData01Icon,
  Clock01Icon,
  DollarCircleIcon,
  InvoiceIcon,
  StarIcon,
  TickDouble01Icon,
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Skeleton } from "@/components/ui/skeleton"
import { formatRupiah, formatNumber } from "@/lib/format-currency"
import { BestSellersPanel } from "@/features/dashboard/components/best-sellers-panel"
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

export function LaporanContent({
  initialData,
}: {
  initialData?: PenjualanData
}) {
  const [range, setRange] = React.useState<LaporanRange>(
    initialData?.range ?? "30d"
  )
  const { data, isLoading, error } = useLaporanPenjualan(range, initialData)

  return (
    <div className="flex min-w-0 flex-col gap-4">
      <div className="hidden flex-col gap-2 lg:flex lg:flex-row lg:items-center lg:justify-between">
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
        <PenjualanDashboard
          data={data}
          range={range}
          onRangeChange={setRange}
        />
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

function PenjualanDashboard({
  data,
  range,
  onRangeChange,
}: {
  data: PenjualanData
  range: LaporanRange
  onRangeChange: (value: LaporanRange) => void
}) {
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
    <div className="flex min-w-0 max-w-full flex-col gap-4">
      <MobileReportHero
        data={data}
        range={range}
        onRangeChange={onRangeChange}
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
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

        <div className="flex w-full min-w-0 flex-col gap-4 lg:grid lg:grid-cols-2 2xl:flex 2xl:w-[380px] 2xl:shrink-0">
          <BestSellersPanel
            items={data.topProducts.map((item, index) => ({
              ...item,
              rank: index + 1,
            }))}
          />
          <TopCashiersCard items={data.topCashiers} />
          <QuickInsightCard data={data} />
        </div>
      </div>
    </div>
  )
}

function MobileReportHero({
  data,
  range,
  onRangeChange,
}: {
  data: PenjualanData
  range: LaporanRange
  onRangeChange: (value: LaporanRange) => void
}) {
  const [open, setOpen] = React.useState(false)
  const bestDay = [...data.salesTrend].sort(
    (a, b) => b.penjualan - a.penjualan
  )[0]

  return (
    <div className="lg:hidden">
      <div className="relative overflow-hidden rounded-[28px] bg-primary p-4 text-primary-foreground shadow-lg">
        <div className="pointer-events-none absolute -top-16 -right-16 size-36 rounded-full bg-primary-foreground/10" />
        <div className="pointer-events-none absolute right-10 -bottom-20 size-44 rounded-full bg-primary-foreground/10" />

        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerTrigger asChild>
            <button
              type="button"
              className="relative flex w-full items-center justify-between rounded-2xl bg-primary-foreground/10 p-3 text-left transition active:scale-[0.99]"
            >
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-xl bg-primary-foreground/15">
                  <HugeiconsIcon icon={Calendar02Icon} size={20} />
                </span>
                <span>
                  <span className="block text-[11px] font-medium opacity-80">
                    Periode laporan
                  </span>
                  <span className="block text-sm font-bold">
                    {RANGE_LABEL[range]}
                  </span>
                </span>
              </div>
              <span className="flex size-8 items-center justify-center rounded-full bg-primary-foreground/10">
                <HugeiconsIcon icon={ArrowRight01Icon} size={18} />
              </span>
            </button>
          </DrawerTrigger>
          <DrawerContent>
            <div className="mx-auto w-full max-w-sm">
              <DrawerHeader className="text-left">
                <DrawerTitle>Pilih Periode Laporan</DrawerTitle>
              </DrawerHeader>
              <div className="flex flex-col gap-2 p-4 pb-8">
                {RANGE_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      onRangeChange(opt.value)
                      setOpen(false)
                    }}
                    className={`flex items-center justify-between rounded-2xl border p-4 text-left transition active:scale-[0.99] ${
                      range === opt.value
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border bg-card"
                    }`}
                  >
                    <span>
                      <span className="block text-base font-bold">
                        {opt.label}
                      </span>
                      <span className="block text-xs text-muted-foreground">
                        Ringkasan {RANGE_LABEL[opt.value]}
                      </span>
                    </span>
                    {range === opt.value ? (
                      <HugeiconsIcon icon={TickDouble01Icon} size={20} />
                    ) : null}
                  </button>
                ))}
              </div>
            </div>
          </DrawerContent>
        </Drawer>

        <div className="relative mt-5">
          <p className="text-[11px] font-medium tracking-[0.18em] uppercase opacity-75">
            Total penjualan
          </p>
          <p className="mt-1 text-3xl font-black tracking-tight break-words min-[420px]:text-4xl">
            {formatRupiah(data.stats.penjualan.value)}
          </p>
        </div>

        <div className="relative mt-5 grid grid-cols-2 gap-3 border-t border-primary-foreground/20 pt-4">
          <div>
            <p className="text-[10px] font-medium opacity-75">Laba kotor</p>
            <p className="mt-1 text-sm font-bold break-words min-[420px]:text-base">
              {formatRupiah(data.stats.labaKotor.value)}
            </p>
          </div>
          <div className="border-l border-primary-foreground/20 pl-3">
            <p className="text-[10px] font-medium opacity-75">Transaksi</p>
            <p className="mt-1 text-2xl font-black">
              {formatNumber(data.stats.totalTransaksi.value)}
            </p>
          </div>
        </div>

        {bestDay && bestDay.penjualan > 0 ? (
          <div className="relative mt-4 rounded-2xl bg-primary-foreground/10 px-3 py-2 text-xs font-semibold">
            Hari terbaik: {bestDay.date}, {formatRupiah(bestDay.penjualan)}
          </div>
        ) : null}
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
    <div className="group relative min-h-24 overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-[0_2px_8px_-3px_rgba(0,0,0,0.05)] transition-all duration-200 active:scale-[0.98] lg:flex lg:min-h-0 lg:items-center lg:gap-4 lg:rounded-xl lg:p-4 lg:shadow-sm">
      <div className="flex items-start gap-3.5 lg:contents">
      <div
        className={`flex size-11 shrink-0 items-center justify-center rounded-[14px] transition-transform duration-300 group-hover:scale-105 lg:size-12 lg:rounded-xl ${iconBg}`}
      >
        <HugeiconsIcon icon={icon} size={22} className={iconColor} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase lg:font-medium lg:normal-case lg:tracking-normal">
          {title}
        </p>
        <p className="break-words text-xl font-extrabold tracking-tight text-foreground lg:truncate lg:text-lg lg:font-bold">
          {value}
        </p>
        <p className="mt-3 flex flex-wrap items-center gap-1.5 text-[10px] text-muted-foreground lg:mt-0 lg:flex-nowrap">
          {change !== null ? (
            <>
              <span
                className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[11px] font-bold ${
                  positive
                    ? "bg-emerald-500/10 text-emerald-600"
                    : "bg-rose-500/10 text-rose-600"
                }`}
              >
                <HugeiconsIcon
                  icon={positive ? ArrowUp01Icon : ArrowDown01Icon}
                  size={11}
                />
                {Math.abs(change)}%
              </span>
              <span className="min-w-0 truncate font-medium">vs periode lalu</span>
            </>
          ) : (
            <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-semibold text-muted-foreground">
              Belum ada pembanding
            </span>
          )}
        </p>
      </div>
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/[0.03] to-transparent opacity-0 transition-opacity group-hover:opacity-100 lg:hidden" />
    </div>
  )
}

const salesChartConfig = {
  penjualan: { label: "Penjualan", color: "var(--color-chart-4)" },
  laba: { label: "Laba", color: "var(--color-chart-2)" },
} satisfies ChartConfig

function SalesTrendCard({ data }: { data: PenjualanData["salesTrend"] }) {
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
        <ChartContainer
          config={salesChartConfig}
          className="h-[220px] w-full sm:h-[260px]"
        >
          <AreaChart
            data={data}
            margin={{ left: 2, right: 8, top: 8, bottom: 0 }}
          >
            <defs>
              <linearGradient
                id="penjualanGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor="var(--color-chart-4)"
                  stopOpacity={0.28}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-chart-4)"
                  stopOpacity={0.02}
                />
              </linearGradient>
              <linearGradient id="labaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-chart-2)"
                  stopOpacity={0.28}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-chart-2)"
                  stopOpacity={0.02}
                />
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

function CategoryCard({ data }: { data: PenjualanData["categoryBreakdown"] }) {
  const config: ChartConfig = Object.fromEntries(
    data.map((d) => [d.name, { label: d.name, color: d.fill }])
  )
  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm">
      <h2 className="mb-3 text-sm font-semibold">Komposisi Penjualan</h2>
      {data.length === 0 ? (
        <EmptyState message="Belum ada data kategori" />
      ) : (
        <div className="grid items-center gap-3 sm:grid-cols-[180px_1fr] xl:grid-cols-1 2xl:grid-cols-[170px_1fr]">
          <ChartContainer
            config={config}
            className="mx-auto aspect-square h-[180px]"
          >
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
                <span className="truncate text-muted-foreground">
                  {item.name}
                </span>
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
                  <span
                    className={`size-2.5 rounded-full ${colorMap[p.name]}`}
                  />
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

type DailySummaryView = "table" | "calendar"

function DailySummaryTable({ rows }: { rows: PenjualanData["dailySummary"] }) {
  const [view, setView] = React.useState<DailySummaryView>("table")

  return (
    <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
      <div className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-sm font-semibold">Ringkasan Penjualan Harian</h2>
          <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
            <HugeiconsIcon icon={Clock01Icon} size={14} />
            {rows.length > 0
              ? `${rows.length} hari tercatat`
              : "Tidak ada data"}
          </p>
        </div>
        <div className="ml-auto flex w-fit items-center rounded-xl border bg-background p-1 sm:ml-0">
          <button
            type="button"
            onClick={() => setView("table")}
            className={`inline-flex size-8 items-center justify-center rounded-lg transition-colors ${
              view === "table"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted"
            }`}
            title="Tabel"
            aria-label="Tabel"
          >
            <HugeiconsIcon icon={InvoiceIcon} size={16} />
          </button>
          <button
            type="button"
            onClick={() => setView("calendar")}
            className={`inline-flex size-8 items-center justify-center rounded-lg transition-colors ${
              view === "calendar"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted"
            }`}
            title="Kalender"
            aria-label="Kalender"
          >
            <HugeiconsIcon icon={Calendar02Icon} size={16} />
          </button>
        </div>
      </div>

      {view === "calendar" ? (
        <DailySummaryCalendar rows={rows} />
      ) : (
        <DailySummaryTableView rows={rows} />
      )}
    </div>
  )
}

function DailySummaryTableView({
  rows,
}: {
  rows: PenjualanData["dailySummary"]
}) {
  const totalTransaksi = rows.reduce((sum, r) => sum + r.transaksi, 0)
  const totalPenjualan = rows.reduce((sum, r) => sum + r.penjualan, 0)
  const totalLaba = rows.reduce((sum, r) => sum + r.laba, 0)
  const rataBelanja = totalTransaksi > 0 ? totalPenjualan / totalTransaksi : 0

  return (
    <>
      <div className="hidden overflow-x-auto lg:block">
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
              <>
                {rows.map((row) => (
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
                ))}
                <tr className="border-t-2 border-border bg-muted/40 font-bold">
                  <td className="px-4 py-3">Total Semua</td>
                  <td className="px-4 py-3 text-center">{totalTransaksi}</td>
                  <td className="px-4 py-3 text-right text-primary">
                    {formatRupiah(totalPenjualan)}
                  </td>
                  <td
                    className={`px-4 py-3 text-right ${totalLaba > 0 ? "text-emerald-600 dark:text-emerald-400" : totalLaba < 0 ? "text-rose-600 dark:text-rose-400" : ""}`}
                  >
                    {formatRupiah(totalLaba)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {formatRupiah(rataBelanja)}
                  </td>
                </tr>
              </>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-2 p-4 pt-0 lg:hidden">
        {rows.length === 0 ? (
          <div className="py-6 text-center text-xs text-muted-foreground">
            Belum ada data penjualan
          </div>
        ) : (
          <>
            {rows.map((row) => (
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
                  <p className="text-xs font-bold">
                    {formatRupiah(row.penjualan)}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    Laba {formatRupiah(row.laba)}
                  </p>
                </div>
              </div>
            ))}

            <div className="mt-2 flex flex-col gap-2 rounded-xl border border-dashed border-border bg-muted/30 p-3">
              <p className="text-xs font-bold text-foreground">Total Semua</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="block text-[10px] text-muted-foreground">
                    Transaksi
                  </span>
                  <span className="font-semibold">{totalTransaksi}</span>
                </div>
                <div className="text-right">
                  <span className="block text-[10px] text-muted-foreground">
                    Rata-rata Belanja
                  </span>
                  <span className="font-semibold">
                    {formatRupiah(rataBelanja)}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] text-muted-foreground">
                    Penjualan
                  </span>
                  <span className="font-bold text-primary">
                    {formatRupiah(totalPenjualan)}
                  </span>
                </div>
                <div className="text-right">
                  <span className="block text-[10px] text-muted-foreground">
                    Total Laba
                  </span>
                  <span
                    className={`font-bold ${totalLaba > 0 ? "text-emerald-600 dark:text-emerald-400" : totalLaba < 0 ? "text-rose-600 dark:text-rose-400" : ""}`}
                  >
                    {formatRupiah(totalLaba)}
                  </span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  )
}

function DailySummaryCalendar({
  rows,
}: {
  rows: PenjualanData["dailySummary"]
}) {
  const rowMap = new Map(rows.map((row) => [row.dateKey, row]))
  const months = buildCalendarMonths(rows)
  const [monthIndex, setMonthIndex] = React.useState(() =>
    Math.max(0, months.length - 1)
  )
  const effectiveMonthIndex = Math.min(
    monthIndex,
    Math.max(0, months.length - 1)
  )
  const currentMonth = months[effectiveMonthIndex]
  const monthRows = currentMonth
    ? rows.filter((row) => row.dateKey.startsWith(currentMonth.key))
    : []

  if (rows.length === 0) {
    return (
      <div className="p-8 text-center text-xs text-muted-foreground">
        Belum ada data penjualan
      </div>
    )
  }

  if (!currentMonth) return null

  const monthlyLaba = monthRows.reduce((sum, row) => sum + row.laba, 0)
  const canGoPrev = effectiveMonthIndex > 0
  const canGoNext = effectiveMonthIndex < months.length - 1

  return (
    <div className="p-2 sm:p-4">
      <div className="rounded-[22px] bg-background p-2.5 shadow-sm sm:p-4">
        {/* Sleek Monthly Laba Header */}
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => {
                  setMonthIndex((index) => Math.max(0, index - 1))
                }}
                disabled={!canGoPrev}
                className="flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-lg border bg-card text-sm font-bold transition hover:bg-muted disabled:opacity-35"
                aria-label="Bulan sebelumnya"
              >
                ‹
              </button>
              <span className="min-w-[70px] truncate px-1 text-center text-xs font-semibold sm:min-w-[90px] sm:text-sm">
                {currentMonth.label}
              </span>
              <button
                type="button"
                onClick={() => {
                  setMonthIndex((index) =>
                    Math.min(months.length - 1, index + 1)
                  )
                }}
                disabled={!canGoNext}
                className="flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-lg border bg-card text-sm font-bold transition hover:bg-muted disabled:opacity-35"
                aria-label="Bulan berikutnya"
              >
                ›
              </button>
            </div>
            <div className="hidden rounded-full bg-muted px-2 py-0.5 text-[11px] font-semibold text-muted-foreground sm:block">
              {currentMonth.activeDays} hari aktif
            </div>
          </div>

          <div className="text-left sm:text-right">
            <span className="block text-[8px] font-semibold tracking-wider text-muted-foreground uppercase sm:text-[9px]">
              Laba Bulanan
            </span>
            <span
              className={`text-sm font-bold tracking-tight sm:text-base ${monthlyLaba > 0 ? "text-emerald-500" : monthlyLaba < 0 ? "text-rose-500" : "text-muted-foreground"}`}
            >
              {formatPnLFull(monthlyLaba)}
            </span>
          </div>
        </div>

        {/* Days Header Row (Sunday-First) */}
        <div className="mb-2 grid grid-cols-7 gap-1 border-b pb-2 text-center text-[10px] font-semibold text-muted-foreground">
          {["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"].map((day) => (
            <div key={day} className="py-1">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Cells */}
        <div className="mt-1 grid grid-cols-7 gap-1 sm:gap-1.5">
          {currentMonth.cells.map((cell, index) => {
            if (!cell)
              return (
                <div
                  key={`${currentMonth.key}-blank-${index}`}
                  className="aspect-square rounded-lg bg-muted/5 opacity-30 sm:aspect-auto sm:h-12 md:h-14 lg:h-16"
                />
              )

            const row = rowMap.get(cell.dateKey)
            const laba = row ? row.laba : 0
            const hasTransactions = !!row && row.transaksi > 0

            let cellStyle = "border-border/60 bg-card hover:bg-muted/40"
            let borderLeftStyle = "border-l-transparent"
            let numberColor = "text-muted-foreground"
            let valColor = "text-muted-foreground/60"

            if (hasTransactions) {
              if (laba > 0) {
                cellStyle =
                  "border-emerald-500/20 bg-emerald-500/8 dark:bg-emerald-500/12 hover:bg-emerald-500/12 dark:hover:bg-emerald-500/18"
                borderLeftStyle = "border-l-[3px] border-l-emerald-500"
                numberColor =
                  "text-emerald-600 dark:text-emerald-400 font-semibold"
                valColor =
                  "text-emerald-600 dark:text-emerald-400 font-semibold"
              } else if (laba < 0) {
                cellStyle =
                  "border-rose-500/20 bg-rose-500/8 dark:bg-rose-500/12 hover:bg-rose-500/12 dark:hover:bg-rose-500/18"
                borderLeftStyle = "border-l-[3px] border-l-rose-500"
                numberColor = "text-rose-600 dark:text-rose-400 font-semibold"
                valColor = "text-rose-600 dark:text-rose-400 font-semibold"
              } else {
                cellStyle = "border-border/80 bg-muted/20 hover:bg-muted/30"
                borderLeftStyle = "border-l-[3px] border-l-muted-foreground/30"
                numberColor = "text-foreground font-medium"
                valColor = "text-muted-foreground font-medium"
              }
            }

            return (
              <div
                key={cell.dateKey}
                className={`relative flex aspect-square flex-col justify-between rounded-lg border p-1 text-left transition sm:aspect-auto sm:h-12 sm:p-1.5 md:h-14 lg:h-16 ${cellStyle} ${borderLeftStyle}`}
              >
                {/* Day number */}
                <span
                  className={`block text-[10px] font-semibold sm:text-xs sm:text-[13px] ${numberColor}`}
                >
                  {cell.day}
                </span>

                {/* Compact Text PnL */}
                <span
                  className={`block truncate text-[7.5px] leading-tight font-semibold tracking-tight min-[360px]:text-[8.5px] sm:text-[10px] ${valColor}`}
                >
                  {formatPnLCompact(laba)}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function buildCalendarMonths(rows: PenjualanData["dailySummary"]) {
  const dates = rows
    .map((row) => parseDateKey(row.dateKey))
    .filter((date): date is Date => Boolean(date))
    .sort((a, b) => a.getTime() - b.getTime())

  if (dates.length === 0) return []

  const first = dates[0]
  const last = dates[dates.length - 1]
  const months: Array<{
    key: string
    label: string
    activeDays: number
    cells: Array<{ dateKey: string; day: number } | null>
  }> = []

  const cursor = new Date(first.getFullYear(), first.getMonth(), 1)
  const lastMonth = new Date(last.getFullYear(), last.getMonth(), 1)

  while (cursor <= lastMonth) {
    const year = cursor.getFullYear()
    const month = cursor.getMonth()
    const daysInMonth = new Date(year, month + 1, 0).getDate()

    // Sunday-First Calendar Offset
    const firstDay = new Date(year, month, 1).getDay()
    const cells: Array<{ dateKey: string; day: number } | null> = Array.from(
      { length: firstDay },
      () => null
    )

    for (let day = 1; day <= daysInMonth; day++) {
      cells.push({ dateKey: formatDateKey(new Date(year, month, day)), day })
    }

    const monthKey = `${year}-${String(month + 1).padStart(2, "0")}`
    months.push({
      key: monthKey,
      label: new Intl.DateTimeFormat("id-ID", {
        month: "long",
        year: "numeric",
      }).format(cursor),
      activeDays: rows.filter(
        (row) => row.dateKey.startsWith(monthKey) && row.penjualan > 0
      ).length,
      cells,
    })

    cursor.setMonth(cursor.getMonth() + 1)
  }

  return months
}

function parseDateKey(dateKey: string) {
  const [year, month, day] = dateKey.split("-").map(Number)
  if (!year || !month || !day) return null
  return new Date(year, month - 1, day)
}

function formatDateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
}

function formatPnLCompact(value: number) {
  if (value === 0) return "0"
  const absValue = Math.abs(value)
  const sign = value > 0 ? "+" : "-"

  let formatted = ""
  if (absValue >= 1_000_000) {
    const val = absValue / 1_000_000
    formatted = `${val.toFixed(val % 1 === 0 ? 0 : 1)}jt`
  } else if (absValue >= 1_000) {
    const val = absValue / 1_000
    formatted = `${val.toFixed(val % 1 === 0 ? 0 : 1)}rb`
  } else {
    formatted = `${absValue}`
  }
  return `${sign}${formatted}`
}

function formatPnLFull(value: number) {
  if (value === 0) return "Rp 0"
  const sign = value > 0 ? "+" : "-"
  return `${sign}${formatRupiah(Math.abs(value))}`
}

function TopCashiersCard({ items }: { items: PenjualanData["topCashiers"] }) {
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
              className="flex items-center gap-3 rounded-lg border border-border/50 bg-muted/20 px-3 py-2.5 transition-colors hover:bg-muted/40"
            >
              <span
                className={`flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                  index === 0
                    ? "bg-primary text-primary-foreground"
                    : index === 1
                      ? "bg-primary/70 text-primary-foreground"
                      : index === 2
                        ? "bg-primary/50 text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                }`}
              >
                {index + 1}
              </span>
              <Avatar className="size-9 shrink-0 rounded-lg">
                {item.image ? (
                  <AvatarImage src={item.image} alt={item.name} />
                ) : null}
                <AvatarFallback className="rounded-lg bg-primary/10 text-[10px] font-semibold text-primary">
                  {item.initials}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1 space-y-0.5">
                <p className="text-xs font-medium break-words">{item.name}</p>
                <div className="flex min-w-0 flex-wrap items-center justify-between gap-x-2 gap-y-0.5">
                  <p className="text-[11px] text-muted-foreground break-words">
                    {item.count} transaksi
                  </p>
                  <p className="text-xs font-semibold text-primary break-words">
                    {formatRupiah(item.revenue)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function QuickInsightCard({ data }: { data: PenjualanData }) {
  const bestDay = [...data.salesTrend].sort(
    (a, b) => b.penjualan - a.penjualan
  )[0]
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
