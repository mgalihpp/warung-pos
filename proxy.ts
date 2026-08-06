import { NextRequest, NextResponse } from "next/server"

import { auth } from "@/lib/auth"
import { canAccessPath, getDashboardPath } from "@/lib/auth-routes"

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl
  let session = null

  try {
    session = await auth.api.getSession({
      headers: request.headers,
    })
  } catch (error) {
    if (pathname === "/login" || pathname === "/register") {
      return NextResponse.next()
    }

    throw error
  }

  if (pathname === "/login" || pathname === "/register") {
    if (session?.user) {
      return NextResponse.redirect(
        new URL(getDashboardPath(session.user.role), request.url)
      )
    }

    return NextResponse.next()
  }

  if (!session?.user) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("next", `${pathname}${search}`)
    return NextResponse.redirect(loginUrl)
  }

  if (!canAccessPath(pathname, session.user.role)) {
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/login", "/register", "/admin/:path*", "/cashier/:path*"],
}
