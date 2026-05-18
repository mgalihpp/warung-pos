import { PengaturanTabs } from "./pengaturan-tabs"

type PengaturanLayoutShellProps = {
  children: React.ReactNode
  basePath: "/admin/pengaturan" | "/cashier/pengaturan"
  description: string
  canManageUsers?: boolean
}

export function PengaturanLayoutShell({
  children,
  basePath,
  description,
  canManageUsers = false,
}: PengaturanLayoutShellProps) {
  return (
    <div className="flex min-w-0 flex-col gap-3 bg-muted/30 p-4 pb-28 lg:bg-transparent lg:gap-6 lg:p-6">
      <div className="flex min-w-0 flex-col gap-3 lg:mx-auto lg:w-full lg:max-w-4xl lg:gap-6">
        <div className="hidden lg:block">
          <h1 className="text-xl font-bold tracking-tight lg:text-2xl">Pengaturan</h1>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <div className="hidden lg:block">
          <PengaturanTabs basePath={basePath} canManageUsers={canManageUsers} />
        </div>
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  )
}
