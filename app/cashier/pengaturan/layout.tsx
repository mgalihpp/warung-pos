import { PengaturanLayoutShell } from "@/features/pengaturan/components/pengaturan-layout-shell"

export default function CashierPengaturanLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <PengaturanLayoutShell
      basePath="/cashier/pengaturan"
      description="Kelola profile akun dan tema aplikasi."
    >
      {children}
    </PengaturanLayoutShell>
  )
}
