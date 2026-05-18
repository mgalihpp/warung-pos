import { PengaturanLayoutShell } from "@/features/pengaturan/components/pengaturan-layout-shell"

export default function AdminPengaturanLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <PengaturanLayoutShell
      basePath="/admin/pengaturan"
      description="Kelola profile akun, manajemen akun, dan tema aplikasi."
      canManageUsers
    >
      {children}
    </PengaturanLayoutShell>
  )
}
