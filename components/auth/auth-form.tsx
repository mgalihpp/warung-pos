"use client"

import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { signIn, signUp } from "@/lib/auth-client"

type AuthMode = "login" | "register"

type AuthFormProps = {
  mode: AuthMode
}

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

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const nextPath = getSafeNextPath(searchParams.get("next"))
  const isRegister = mode === "register"
  const [error, setError] = React.useState<string | null>(null)
  const [isPending, startTransition] = React.useTransition()

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    const formData = new FormData(event.currentTarget)
    const email = String(formData.get("email") ?? "")
    const password = String(formData.get("password") ?? "")
    const name = String(formData.get("name") ?? "")

    startTransition(async () => {
      const response = isRegister
        ? await signUp.email({
            name,
            email,
            password,
          })
        : await signIn.email({
            email,
            password,
            rememberMe: true,
          })

      if (response.error) {
        setError(getAuthErrorMessage(response.error))
        return
      }

      router.push(nextPath)
      router.refresh()
    })
  }

  return (
    <main className="grid min-h-svh place-items-center bg-background p-6">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader>
            <CardTitle>{isRegister ? "Daftar" : "Login"}</CardTitle>
            <CardDescription>
              {isRegister
                ? "Buat akun baru untuk mulai menggunakan aplikasi."
                : "Masuk dengan email dan kata sandi."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={onSubmit}>
              {isRegister ? (
                <div className="space-y-2">
                  <Label htmlFor="name">Nama</Label>
                  <Input
                    id="name"
                    name="name"
                    autoComplete="name"
                    placeholder="Masukkan nama"
                    required
                  />
                </div>
              ) : null}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
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
                  autoComplete={
                    isRegister ? "new-password" : "current-password"
                  }
                  minLength={8}
                  placeholder="Masukkan kata sandi"
                  required
                />
              </div>

              {error ? (
                <p className="rounded-md border border-destructive/25 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {error}
                </p>
              ) : null}

              <Button
                className="w-full"
                disabled={isPending}
                size="lg"
                type="submit"
              >
                {isPending ? "Memproses..." : isRegister ? "Daftar" : "Masuk"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="justify-center border-t pt-6 text-sm text-muted-foreground">
            {isRegister ? (
              <span>
                Sudah punya akun?{" "}
                <Link
                  className="font-medium text-primary underline-offset-4 hover:underline"
                  href="/login"
                >
                  Login
                </Link>
              </span>
            ) : (
              <span>
                Belum punya akun?{" "}
                <Link
                  className="font-medium text-primary underline-offset-4 hover:underline"
                  href="/register"
                >
                  Daftar
                </Link>
              </span>
            )}
          </CardFooter>
        </Card>
      </div>
    </main>
  )
}
