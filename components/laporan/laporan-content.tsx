"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  AnalyticsUpIcon,
  ArrowUp01Icon,
  ArrowRight01Icon,
  ChartLineData01Icon,
  Clock01Icon,
  DollarCircleIcon,
  Download04Icon,
  FileChartPieIcon,
  FilterHorizontalIcon,
  InvoiceIcon,
  Pdf02Icon,
  PlusSignIcon,
  StarIcon,
  Time01Icon,
  Wallet03Icon,
  Xls02Icon,
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

const stats = [
  {
    title: "Omzet Bulan Ini",
    value: "Rp 78.650.000",
    detail: "15,3% dibanding bulan lalu",
    trend: true,
    icon: DollarCircleIcon,
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
  },
  {
    title: "Laba Kotor",
    value: "Rp 18.240.000",
    detail: "9,8% dibanding bulan lalu",
    trend: true,
    icon: ChartLineData01Icon,
    iconBg: "bg-emerald-500/10",
    iconColor: "text-emerald-600",
  },
  {
    title: "Total Transaksi",
    value: "2.764",
    detail: "Rata-rata 92 transaksi / hari",
    trend: false,
    icon: InvoiceIcon,
    iconBg: "bg-blue-500/10",
    iconColor: "text-blue-600",
  },
  {
    title: "Rata-rata Belanja",
    value: "Rp 28.500",
    detail: "Per transaksi",
    trend: false,
    icon: Wallet03Icon,
    iconBg: "bg-violet-500/10",
    iconColor: "text-violet-600",
  },
]

const salesData = [
  { date: "25 Apr", omzet: 850000, laba: 210000 },
  { date: "27 Apr", omzet: 1420000, laba: 340000 },
  { date: "29 Apr", omzet: 1190000, laba: 285000 },
  { date: "30 Apr", omzet: 1360000, laba: 320000 },
  { date: "2 Mei", omzet: 1860000, laba: 430000 },
  { date: "4 Mei", omzet: 1540000, laba: 360000 },
  { date: "5 Mei", omzet: 1720000, laba: 420000 },
  { date: "7 Mei", omzet: 2290000, laba: 560000 },
  { date: "8 Mei", omzet: 1510000, laba: 350000 },
  { date: "10 Mei", omzet: 2130000, laba: 510000 },
  { date: "11 Mei", omzet: 2660000, laba: 640000 },
  { date: "13 Mei", omzet: 2110000, laba: 490000 },
  { date: "15 Mei", omzet: 2430000, laba: 580000 },
  { date: "17 Mei", omzet: 1910000, laba: 450000 },
  { date: "19 Mei", omzet: 2780000, laba: 680000 },
  { date: "21 Mei", omzet: 2080000, laba: 490000 },
  { date: "23 Mei", omzet: 2320000, laba: 560000 },
  { date: "24 Mei", omzet: 2450000, laba: 590000 },
]

const salesChartConfig = {
  omzet: { label: "Omzet", color: "var(--color-chart-4)" },
  laba: { label: "Laba", color: "var(--color-chart-2)" },
} satisfies ChartConfig

const categoryData = [
  { name: "Sembako", value: 45, fill: "var(--color-chart-4)" },
  { name: "Minuman", value: 20, fill: "#2563eb" },
  { name: "Snack", value: 15, fill: "#f59e0b" },
  { name: "Bumbu", value: 10, fill: "#f43f5e" },
  { name: "Lainnya", value: 10, fill: "#9ca3af" },
]

const categoryChartConfig = {
  sembako: { label: "Sembako", color: "var(--color-chart-4)" },
  minuman: { label: "Minuman", color: "#2563eb" },
  snack: { label: "Snack", color: "#f59e0b" },
  bumbu: { label: "Bumbu", color: "#f43f5e" },
  lainnya: { label: "Lainnya", color: "#9ca3af" },
} satisfies ChartConfig

const payments = [
  {
    name: "Tunai",
    amount: "Rp 32.500.000",
    percentage: 41,
    color: "bg-emerald-600",
  },
  {
    name: "QRIS",
    amount: "Rp 28.900.000",
    percentage: 37,
    color: "bg-blue-600",
  },
  {
    name: "Transfer",
    amount: "Rp 17.250.000",
    percentage: 22,
    color: "bg-violet-600",
  },
]

const products = [
  {
    name: "Beras Premium 5kg",
    sold: "Terjual 124 pcs",
    revenue: "Rp 9.300.000",
    code: "BR",
    tone: "bg-primary/10 text-primary",
  },
  {
    name: "Minyak Goreng 1L",
    sold: "Terjual 98 pcs",
    revenue: "Rp 5.486.000",
    code: "MG",
    tone: "bg-amber-500/10 text-amber-600",
  },
  {
    name: "Mie Instan Goreng",
    sold: "Terjual 210 pcs",
    revenue: "Rp 735.000",
    code: "MI",
    tone: "bg-orange-500/10 text-orange-600",
  },
  {
    name: "Gula Pasir 1kg",
    sold: "Terjual 76 pcs",
    revenue: "Rp 1.216.000",
    code: "GP",
    tone: "bg-lime-500/10 text-lime-600",
  },
  {
    name: "Air Mineral 600ml",
    sold: "Terjual 180 pcs",
    revenue: "Rp 720.000",
    code: "AM",
    tone: "bg-sky-500/10 text-sky-600",
  },
]

const cashiers = [
  {
    name: "Siti",
    tx: "1.248 transaksi",
    revenue: "Rp 36.400.000",
    tone: "bg-sky-500/10 text-sky-600",
  },
  {
    name: "Doni",
    tx: "1.105 transaksi",
    revenue: "Rp 31.250.000",
    tone: "bg-orange-500/10 text-orange-600",
  },
  {
    name: "Rina",
    tx: "411 transaksi",
    revenue: "Rp 11.000.000",
    tone: "bg-pink-500/10 text-pink-600",
  },
]

const dailyRows = [
  ["24 Mei 2025", "86", "Rp 2.450.000", "Rp 590.000", "Rp 28.488"],
  ["23 Mei 2025", "83", "Rp 2.320.000", "Rp 560.000", "Rp 27.952"],
  ["22 Mei 2025", "91", "Rp 2.610.000", "Rp 635.000", "Rp 28.681"],
  ["21 Mei 2025", "79", "Rp 2.180.000", "Rp 520.000", "Rp 27.594"],
  ["20 Mei 2025", "88", "Rp 2.540.000", "Rp 608.000", "Rp 28.864"],
  ["19 Mei 2025", "74", "Rp 2.050.000", "Rp 488.000", "Rp 27.703"],
]

const activities = [
  {
    label: "Laporan harian diunduh",
    time: "24 Mei 2025, 09:42",
    icon: Download04Icon,
    tone: "bg-primary/10 text-primary",
  },
  {
    label: "Rekap penjualan diperbarui",
    time: "24 Mei 2025, 08:15",
    icon: AnalyticsUpIcon,
    tone: "bg-blue-500/10 text-blue-600",
  },
  {
    label: "Export Excel berhasil",
    time: "24 Mei 2025, 07:36",
    icon: Xls02Icon,
    tone: "bg-emerald-500/10 text-emerald-600",
  },
  {
    label: "Laporan bulanan dibuat",
    time: "23 Mei 2025, 23:10",
    icon: FileChartPieIcon,
    tone: "bg-violet-500/10 text-violet-600",
  },
]

export function LaporanContent() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)

  return (
    <div className="flex min-w-0 flex-col gap-3 p-4 lg:gap-6 lg:p-6">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight lg:text-2xl">
            Laporan & Analitik
          </h1>
          <p className="text-sm text-muted-foreground">
            Pantau performa penjualan warung Anda secara detail
          </p>
        </div>

        <div className="hidden items-center gap-2 lg:flex">
          <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90">
            <HugeiconsIcon icon={Pdf02Icon} size={16} />
            Export PDF
          </button>
          <button className="inline-flex items-center gap-2 rounded-lg border bg-card px-4 py-2.5 text-sm font-medium transition-colors hover:bg-muted">
            <HugeiconsIcon icon={Xls02Icon} size={16} />
            Export Excel
          </button>
          <button className="inline-flex items-center gap-2 rounded-lg border bg-card px-4 py-2.5 text-sm font-medium transition-colors hover:bg-muted">
            <HugeiconsIcon icon={FilterHorizontalIcon} size={16} />
            Filter Laporan
          </button>
        </div>
      </div>

      <div className="lg:hidden">
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        <div className="fixed right-6 bottom-24 z-40 flex flex-col items-end gap-3">
          <div
            className={`flex origin-bottom flex-col items-end gap-3 transition-all duration-200 ${
              isMobileMenuOpen
                ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
                : "pointer-events-none translate-y-4 scale-95 opacity-0"
            }`}
          >
            <button className="group flex items-center justify-end gap-3">
              <span className="rounded-md border bg-card px-2.5 py-1.5 text-xs font-semibold shadow-sm transition-colors group-hover:bg-muted">
                Filter Laporan
              </span>
              <div className="flex size-11 items-center justify-center rounded-full border bg-card text-foreground shadow-sm transition-colors group-hover:bg-muted">
                <HugeiconsIcon icon={FilterHorizontalIcon} size={20} />
              </div>
            </button>

            <button className="group flex items-center justify-end gap-3">
              <span className="rounded-md border bg-card px-2.5 py-1.5 text-xs font-semibold shadow-sm transition-colors group-hover:bg-muted">
                Export Excel
              </span>
              <div className="flex size-11 items-center justify-center rounded-full border bg-card text-foreground shadow-sm transition-colors group-hover:bg-muted">
                <HugeiconsIcon icon={Xls02Icon} size={20} />
              </div>
            </button>

            <button className="group flex items-center justify-end gap-3">
              <span className="rounded-md bg-primary px-2.5 py-1.5 text-xs font-semibold text-primary-foreground shadow-sm transition-colors group-hover:bg-primary/90">
                Export PDF
              </span>
              <div className="flex size-11 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm transition-colors group-hover:bg-primary/90">
                <HugeiconsIcon icon={Pdf02Icon} size={20} />
              </div>
            </button>
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`flex size-14 items-center justify-center rounded-full shadow-lg transition-all duration-200 active:scale-95 ${
              isMobileMenuOpen
                ? "border bg-card text-foreground"
                : "bg-primary text-primary-foreground"
            }`}
          >
            <HugeiconsIcon
              icon={PlusSignIcon}
              size={28}
              className={`transition-transform duration-200 ${isMobileMenuOpen ? "rotate-45" : ""}`}
            />
          </button>
        </div>
      </div>

      <div className="scrollbar-none -mx-4 flex gap-3 overflow-x-auto px-4 pb-1 lg:hidden">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="group relative flex min-w-[180px] shrink-0 cursor-pointer items-center gap-3 rounded-xl border bg-card p-3 shadow-sm transition-shadow hover:shadow-md"
          >
            <div
              className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${stat.iconBg}`}
            >
              <HugeiconsIcon
                icon={stat.icon}
                size={18}
                className={stat.iconColor}
              />
            </div>
            <div className="min-w-0">
              <p className="truncate text-[10px] font-medium text-muted-foreground">
                {stat.title}
              </p>
              <p className="text-xl font-bold tracking-tight">{stat.value}</p>
            </div>
            <HugeiconsIcon
              icon={ArrowRight01Icon}
              size={14}
              className="ml-auto shrink-0 text-muted-foreground"
            />
          </div>
        ))}
      </div>

      <div className="hidden lg:grid lg:grid-cols-2 lg:gap-4 2xl:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="group relative flex cursor-pointer items-center gap-4 overflow-hidden rounded-xl border bg-card p-4 shadow-sm transition-shadow hover:shadow-md"
          >
            <div
              className={`flex size-12 shrink-0 items-center justify-center rounded-xl ${stat.iconBg}`}
            >
              <HugeiconsIcon
                icon={stat.icon}
                size={22}
                className={stat.iconColor}
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-medium text-muted-foreground sm:text-xs">
                {stat.title}
              </p>
              <p className="text-lg font-bold tracking-tight whitespace-nowrap sm:text-xl">
                {stat.value}
              </p>
              <p className="flex items-center gap-1 text-[10px] text-muted-foreground sm:text-[11px]">
                {stat.trend && (
                  <HugeiconsIcon
                    icon={ArrowUp01Icon}
                    size={12}
                    className="text-emerald-600"
                  />
                )}
                {stat.trend ? (
                  <>
                    <span className="font-semibold text-emerald-600">
                      {stat.detail.split(" ")[0]}
                    </span>
                    {stat.detail.replace(stat.detail.split(" ")[0], "")}
                  </>
                ) : (
                  stat.detail
                )}
              </p>
            </div>
            <HugeiconsIcon
              icon={ArrowRight01Icon}
              size={16}
              className="shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/[0.02] to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
          </div>
        ))}
      </div>

      <div className="grid min-w-0 grid-cols-1 gap-4 2xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className="flex min-w-0 flex-col gap-4">
          <div className="grid min-w-0 grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.5fr)_minmax(340px,0.9fr)]">
            <SalesTrendCard />
            <div className="flex min-w-0 flex-col gap-4">
              <SalesCompositionCard />
              <PaymentMethodCard />
            </div>
          </div>

          <DailySummaryTable />
          <RecentActivity />
        </div>

        <div className="grid h-fit content-start items-start gap-4 lg:grid-cols-2 2xl:grid-cols-1">
          <RankingCard
            title="Produk Terlaris"
            link="Lihat Semua"
            items={products}
            type="product"
          />
          <RankingCard
            title="Performa Kasir"
            link="Lihat Semua"
            items={cashiers}
            type="cashier"
          />
          <QuickInsightCard />
        </div>
      </div>
    </div>
  )
}

function SalesTrendCard() {
  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold">Tren Penjualan</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Pergerakan omzet 30 hari terakhir
          </p>
        </div>
        <div className="hidden rounded-lg border bg-background px-3 py-2 text-xs shadow-sm sm:block">
          <p className="text-muted-foreground">24 Mei 2025</p>
          <p className="font-bold">Rp 2.450.000</p>
        </div>
      </div>
      <ChartContainer config={salesChartConfig} className="h-[280px] w-full">
        <AreaChart
          data={salesData}
          margin={{ left: 2, right: 8, top: 8, bottom: 0 }}
        >
          <defs>
            <linearGradient id="omzetGradient" x1="0" y1="0" x2="0" y2="1">
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
          </defs>
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            fontSize={11}
            tickMargin={10}
            interval={2}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            fontSize={11}
            tickFormatter={(value) => `${Number(value) / 1000000}M`}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Area
            type="monotone"
            dataKey="omzet"
            stroke="var(--color-chart-4)"
            strokeWidth={3}
            fill="url(#omzetGradient)"
            activeDot={{ r: 5 }}
          />
        </AreaChart>
      </ChartContainer>
    </div>
  )
}

function SalesCompositionCard() {
  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm">
      <h2 className="mb-3 text-sm font-semibold">Komposisi Penjualan</h2>
      <div className="grid items-center gap-3 sm:grid-cols-[180px_1fr] xl:grid-cols-1 2xl:grid-cols-[170px_1fr]">
        <ChartContainer
          config={categoryChartConfig}
          className="mx-auto aspect-square h-[180px]"
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent />} />
            <Pie
              data={categoryData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={52}
              outerRadius={78}
              strokeWidth={4}
              stroke="var(--color-card)"
            >
              {categoryData.map((entry) => (
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
          {categoryData.map((item) => (
            <div key={item.name} className="flex items-center gap-2 text-xs">
              <span
                className="size-2.5 rounded-full"
                style={{ backgroundColor: item.fill }}
              />
              <span className="text-muted-foreground">{item.name}</span>
              <span className="ml-auto font-bold">{item.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function PaymentMethodCard() {
  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm">
      <h2 className="mb-4 text-sm font-semibold">Metode Pembayaran</h2>

      <div className="mb-4 flex h-3 overflow-hidden rounded-full bg-muted">
        {payments.map((payment) => (
          <div
            key={payment.name}
            className={payment.color}
            style={{ width: `${payment.percentage}%` }}
            title={`${payment.name} ${payment.percentage}%`}
          />
        ))}
      </div>

      <div className="space-y-3">
        {payments.map((payment) => (
          <div
            key={payment.name}
            className="grid grid-cols-[72px_minmax(0,1fr)_36px] items-center gap-3 text-xs"
          >
            <div className="flex items-center gap-2 font-semibold">
              <span className={`size-2.5 rounded-full ${payment.color}`} />
              <span>{payment.name}</span>
            </div>
            <span className="truncate text-right font-semibold">
              {payment.amount}
            </span>
            <span className="text-right text-muted-foreground">
              {payment.percentage}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function DailySummaryTable() {
  return (
    <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
      <div className="flex flex-col gap-2 border-b p-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-sm font-semibold">Ringkasan Penjualan Harian</h2>
        <span className="inline-flex w-fit items-center gap-2 rounded-md border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground">
          <HugeiconsIcon icon={Clock01Icon} size={14} />1 Mei - 24 Mei 2025
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-xs">
          <thead className="bg-muted/50 text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-semibold">Tanggal</th>
              <th className="px-4 py-3 text-center font-semibold">Transaksi</th>
              <th className="px-4 py-3 text-right font-semibold">Omzet</th>
              <th className="px-4 py-3 text-right font-semibold">Laba Kotor</th>
              <th className="px-4 py-3 text-right font-semibold">
                Rata-rata Belanja
              </th>
              <th className="px-4 py-3 text-center font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {dailyRows.map((row) => (
              <tr
                key={row[0]}
                className="border-t transition-colors hover:bg-muted/30"
              >
                <td className="px-4 py-2.5 font-medium">{row[0]}</td>
                <td className="px-4 py-2.5 text-center">{row[1]}</td>
                <td className="px-4 py-2.5 text-right font-medium">{row[2]}</td>
                <td className="px-4 py-2.5 text-right">{row[3]}</td>
                <td className="px-4 py-2.5 text-right">{row[4]}</td>
                <td className="px-4 py-2.5 text-center">
                  <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-[11px] font-bold text-primary">
                    Selesai
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function RecentActivity() {
  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm">
      <h2 className="mb-4 text-sm font-semibold">Aktivitas Laporan Terbaru</h2>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {activities.map((activity) => (
          <div
            key={activity.label}
            className="flex items-center gap-3 rounded-lg border bg-background p-3"
          >
            <div
              className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${activity.tone}`}
            >
              <HugeiconsIcon icon={activity.icon} size={20} />
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs font-bold">{activity.label}</p>
              <p className="mt-1 text-[11px] text-muted-foreground">
                {activity.time}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function RankingCard({
  title,
  link,
  items,
  type,
}: {
  title: string
  link: string
  items: typeof products | typeof cashiers
  type: "product" | "cashier"
}) {
  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold">{title}</h2>
        <button className="text-xs font-semibold text-primary hover:underline">
          {link}
        </button>
      </div>
      <div className="space-y-3">
        {items.map((item, index) => (
          <div
            key={item.name}
            className="grid grid-cols-[26px_36px_1fr_auto] items-center gap-3"
          >
            <span className="flex size-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
              {index + 1}
            </span>
            <span
              className={`flex size-9 items-center justify-center rounded-lg text-[11px] font-bold ${item.tone}`}
            >
              {type === "product"
                ? "code" in item
                  ? item.code
                  : "PR"
                : item.name.slice(0, 1)}
            </span>
            <div className="min-w-0">
              <p className="truncate text-xs font-bold">{item.name}</p>
              <p className="text-[11px] text-muted-foreground">
                {"sold" in item ? item.sold : item.tx}
              </p>
            </div>
            <p className="text-xs font-bold whitespace-nowrap text-primary">
              {item.revenue}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

function QuickInsightCard() {
  const insights = [
    {
      text: "Hari terbaik: Sabtu",
      icon: StarIcon,
      tone: "bg-primary/10 text-primary",
    },
    {
      text: "Jam ramai: 18:00 - 20:00",
      icon: Time01Icon,
      tone: "bg-orange-500/10 text-orange-600",
    },
    {
      text: "Kategori tumbuh tercepat: Minuman +12%",
      icon: AnalyticsUpIcon,
      tone: "bg-blue-500/10 text-blue-600",
    },
  ]

  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm lg:col-span-2 2xl:col-span-1">
      <h2 className="mb-4 text-sm font-semibold">Insight Cepat</h2>
      <div className="space-y-3">
        {insights.map((insight) => (
          <div
            key={insight.text}
            className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold ${insight.tone}`}
          >
            <HugeiconsIcon icon={insight.icon} size={20} />
            <span>{insight.text}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
