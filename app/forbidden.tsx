import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Forbidden() {
  return (
    <main className="relative flex min-h-svh items-center justify-center overflow-hidden bg-muted/40 px-5 py-8 sm:p-4">
      <div className="pointer-events-none absolute top-[-12%] left-[-18%] size-72 rounded-full bg-destructive/10 blur-3xl sm:top-[-10%] sm:left-[-10%] sm:size-80 sm:bg-destructive/15" />
      <div className="pointer-events-none absolute right-[-18%] bottom-[-12%] size-72 rounded-full bg-chart-5/10 blur-3xl sm:right-[-10%] sm:bottom-[-10%] sm:size-80 sm:bg-chart-5/15" />

      <Card className="z-10 w-full max-w-md rounded-none border-0 bg-transparent py-6 shadow-none ring-0 sm:rounded-2xl sm:border sm:border-border/50 sm:bg-card/95 sm:py-8 sm:shadow-xl sm:ring-1 sm:ring-foreground/10 sm:backdrop-blur-sm">
        <CardHeader className="space-y-2 px-0 pb-4 text-center sm:space-y-3 sm:px-6 sm:pb-6">
          <div className="mx-auto flex h-20 w-24 items-center justify-center rounded-xl bg-destructive/10 p-1.5 sm:h-18 sm:w-22">
            <Image
              src="/logo warung.png"
              alt="Logo Warung Sembako Pos"
              width={120}
              height={120}
              className="h-full w-full scale-[1.7] object-contain opacity-40 grayscale sm:scale-150"
              priority
            />
          </div>
          <div className="space-y-1">
            <p className="text-xs font-semibold tracking-widest text-destructive/80 uppercase">
              Akses Ditolak
            </p>
            <CardTitle className="font-sans text-2xl font-bold text-foreground sm:text-3xl">
              Izin Tidak Cukup
            </CardTitle>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 px-0 sm:px-6">
          <div className="rounded-xl border border-destructive/15 bg-destructive/5 px-4 py-3.5 text-center">
            <p className="text-sm leading-relaxed text-muted-foreground">
              Akun Anda tidak memiliki{" "}
              <span className="font-medium text-foreground">
                role yang sesuai
              </span>{" "}
              untuk mengakses halaman ini. Hubungi admin jika Anda merasa ini
              adalah kesalahan.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="h-px flex-1 bg-border" />
            <span className="text-xs font-medium tracking-wide text-muted-foreground/60 uppercase">
              Navigasi
            </span>
            <span className="h-px flex-1 bg-border" />
          </div>

          <Button
            asChild
            className="h-11 w-full text-sm font-medium sm:text-base"
          >
            <Link href="/login">Masuk dengan Akun Lain</Link>
          </Button>

          <div className="pt-1 text-center sm:rounded-xl sm:border sm:border-border/50 sm:bg-muted/50 sm:p-4">
            <p className="text-xs leading-relaxed text-muted-foreground/70">
              Jika masalah berlanjut, hubungi pemilik toko untuk mendapatkan
              akses yang sesuai.
            </p>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
