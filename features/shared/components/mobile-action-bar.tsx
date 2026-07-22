"use client"

import * as React from "react"

export function MobileActionBar({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/95 px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] shadow-[0_-12px_30px_rgba(15,23,42,0.12)] backdrop-blur lg:hidden">
      <div className="mx-auto max-w-md">{children}</div>
    </div>
  )
}
