"use client"

import * as React from "react"

export function Field({
  label,
  required,
  children,
  error,
  asLabel = true,
}: {
  label: string
  required?: boolean
  children: React.ReactNode
  error?: string | string[]
  asLabel?: boolean
}) {
  const Wrapper = asLabel ? "label" : "div"
  const message = Array.isArray(error) ? error[0] : error

  return (
    <Wrapper className="grid gap-1.5 text-xs font-medium">
      <span>
        {label}
        {required && <span className="ml-0.5 text-destructive">*</span>}
      </span>
      {children}
      {message && (
        <span className="text-[10px] font-normal text-destructive">
          {message}
        </span>
      )}
    </Wrapper>
  )
}
