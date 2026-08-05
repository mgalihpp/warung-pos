"use client"

import { useRouter } from "next/navigation"
import * as React from "react"

import { Button } from "@/components/ui/button"
import { signOut } from "@/lib/auth-client"

export function SignOutButton() {
  const router = useRouter()
  const [isPending, startTransition] = React.useTransition()

  function handleSignOut() {
    startTransition(async () => {
      await signOut()
      router.push("/login")
      router.refresh()
    })
  }

  return (
    <Button
      loading={isPending}
      loadingText="Keluar..."
      onClick={handleSignOut}
      variant="outline"
    >
      Keluar
    </Button>
  )
}
