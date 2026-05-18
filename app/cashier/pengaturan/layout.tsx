import { PengaturanTabs } from "@/features/pengaturan/components/pengaturan-tabs"

export default function CashierPengaturanLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-w-0 flex-col gap-3 p-4 pb-28 lg:gap-6 lg:p-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight lg:text-2xl">Pengaturan</h1>
        <p className="text-sm text-muted-foreground">Kelola profile pengguna dan tema aplikasi.</p>
      </div>
      <PengaturanTabs basePath="/cashier/pengaturan" />
      <div className="min-w-0">{children}</div>
    </div>
  )
}
