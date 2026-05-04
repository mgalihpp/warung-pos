import { createAuthClient } from "better-auth/react"
import { adminClient } from "better-auth/client/plugins"

import { ac, admin, cashier } from "@/lib/permissions"

export const authClient = createAuthClient({
  plugins: [
    adminClient({
      ac,
      roles: {
        admin,
        cashier,
      },
    }),
  ],
})

export const { signIn, signOut, useSession, getSession } = authClient
