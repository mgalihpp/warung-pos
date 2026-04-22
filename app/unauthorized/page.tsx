import Link from "next/link"

import { Button } from "@/components/ui/button"

export default function UnauthorizedPage() {
  return (
    <main className="grid min-h-svh place-items-center bg-background p-6">
      <section className="max-w-md rounded-lg border bg-card p-6 text-center text-card-foreground shadow-sm">
        <p className="text-sm text-muted-foreground">Akses ditolak</p>
        <h1 className="mt-2 text-2xl font-semibold">
          Anda tidak punya izin ke halaman ini.
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Masuk dengan akun yang memiliki role sesuai untuk membuka halaman
          tersebut.
        </p>
        <Button asChild className="mt-5">
          <Link href="/cashier">Kembali</Link>
        </Button>
      </section>
    </main>
  )
}
