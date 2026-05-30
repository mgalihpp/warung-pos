import { LaporanTabs } from "@/features/laporan/components/laporan-tabs"

export default function LaporanLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-w-0 flex-col gap-3 p-4 pt-0 lg:gap-4 lg:p-6">
      <div className="hidden lg:block">
        <h1 className="text-xl font-bold tracking-tight lg:text-2xl">
          Laporan & Analitik
        </h1>
        <p className="text-sm text-muted-foreground">
          Pantau performa penjualan dan stok warung Anda
        </p>
      </div>
      <LaporanTabs />
      <div className="min-w-0">{children}</div>
    </div>
  )
}
