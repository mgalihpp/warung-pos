"use client"

import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import * as React from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import { signIn, getSession } from "@/lib/auth-client"
import { getDashboardPath } from "@/lib/auth-routes"

const fallbackPath = "/cashier"

function getAuthErrorMessage(error: unknown) {
  if (!error) {
    return "Autentikasi gagal. Periksa data lalu coba lagi."
  }

  if (typeof error === "string") {
    return error
  }

  if (
    typeof error === "object" &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    return error.message
  }

  return "Autentikasi gagal. Periksa data lalu coba lagi."
}

function getSafeNextPath(next: string | null) {
  if (!next || !next.startsWith("/") || next.startsWith("//")) {
    return fallbackPath
  }

  return next
}

export function AuthForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const nextPath = getSafeNextPath(searchParams.get("next"))
  const nextQuery = searchParams.get("next")
  const [error, setError] = React.useState<string | null>(null)
  const [isPending, startTransition] = React.useTransition()

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    const formData = new FormData(event.currentTarget)
    const email = String(formData.get("email") ?? "")
    const password = String(formData.get("password") ?? "")

    startTransition(async () => {
      const response = await signIn.email({
        email,
        password,
        rememberMe: true,
      })

      if (response.error) {
        const message = getAuthErrorMessage(response.error)
        setError(message)
        toast.error(message)
        return
      }

      toast.success("Berhasil masuk")
      const session = await getSession()
      const role = session.data?.user?.role
      const redirectPath = nextQuery ? nextPath : getDashboardPath(role)
      router.push(redirectPath)
      router.refresh()
    })
  }

  return (
    <main className="relative flex min-h-svh items-center justify-center overflow-hidden bg-muted/40 px-5 py-8 sm:p-4">
      <div className="pointer-events-none absolute top-[-12%] left-[-18%] size-72 rounded-full bg-primary/15 blur-3xl sm:top-[-10%] sm:left-[-10%] sm:size-80 sm:bg-primary/20" />
      <div className="pointer-events-none absolute right-[-18%] bottom-[-12%] size-72 rounded-full bg-chart-2/15 blur-3xl sm:right-[-10%] sm:bottom-[-10%] sm:size-80 sm:bg-chart-2/20" />

      <Card className="z-10 w-full max-w-md overflow-visible rounded-none border-0 bg-transparent py-6 shadow-none ring-0 sm:overflow-hidden sm:rounded-2xl sm:border sm:border-border/50 sm:bg-card/95 sm:py-6 sm:shadow-xl sm:ring-1 sm:ring-foreground/10 sm:backdrop-blur-sm">
        <CardHeader className="space-y-2 px-0 pb-6 text-center sm:space-y-3 sm:px-6 sm:pb-6">
          <div className="mx-auto flex h-20 w-24 items-center justify-center rounded-xl bg-primary/10 p-1.5 sm:h-18 sm:w-22">
            <Image
              src="/logo warung.png"
              alt="Logo Warung Mama Nia"
              width={120}
              height={120}
              className="h-full w-full scale-[1.7] object-contain sm:scale-150"
              priority
            />
          </div>
          <div className="space-y-1">
            <CardTitle className="font-sans text-2xl font-bold text-foreground sm:text-3xl">
              Warung Mama Nia
            </CardTitle>
            <p className="mx-auto max-w-xs text-sm leading-6 text-muted-foreground sm:max-w-none sm:text-base">
              Masuk untuk mulai mengelola transaksi dan operasional toko.
            </p>
          </div>
        </CardHeader>

        <CardContent className="space-y-5 px-0 sm:space-y-6 sm:px-6">
          <form className="space-y-5" onSubmit={onSubmit}>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                className="h-11"
                placeholder="nama@email.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Kata sandi</Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                className="h-11"
                minLength={8}
                placeholder="Masukkan kata sandi"
                required
              />
            </div>

            {error ? (
              <p className="rounded-xl border border-destructive/25 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </p>
            ) : null}

            <Button className="h-11 w-full text-sm font-medium sm:text-base" disabled={isPending} type="submit">
              {isPending ? <Spinner className="mr-2 size-5" /> : null}
              {isPending ? "Memproses..." : "Masuk"}
            </Button>
          </form>

        </CardContent>
      </Card>
    </main>
  )
}
