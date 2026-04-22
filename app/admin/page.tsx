import { headers } from "next/headers"

import { SignOutButton } from "@/components/auth/sign-out-button"
import { auth } from "@/lib/auth"

export default async function AdminPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  return (
    <main className="min-h-svh bg-background p-6">
      <div className="mx-auto flex max-w-4xl flex-col gap-6">
        <header className="flex items-center justify-between gap-4 border-b pb-4">
          <div>
            <p className="text-sm text-muted-foreground">Warung Sembako Pos</p>
            <h1 className="text-2xl font-semibold">Dashboard Admin</h1>
          </div>
          <SignOutButton />
        </header>
        <section className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
          <p className="font-medium">Halo, {session?.user.name}</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Area ini siap dipakai untuk fitur produk, stok, laporan, dan
            manajemen kasir.
          </p>
        </section>
      </div>
    </main>
  )
}
