"use client"

import * as React from "react"
import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowLeft02Icon } from "@hugeicons/core-free-icons"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { MobileActionBar } from "./mobile-action-bar"

type PageShellProps = {
  title: string
  subtitle?: string
  backHref?: string
  onBack?: () => void
  actions?: React.ReactNode
  width?: "narrow" | "wide"
  bottomBar?: React.ReactNode
  className?: string
  children: React.ReactNode
}

const WIDTH_CLASS = {
  narrow: "max-w-3xl",
  wide: "max-w-5xl",
} as const

function BackButton({
  backHref,
  onBack,
}: Pick<PageShellProps, "backHref" | "onBack">) {
  if (backHref) {
    return (
      <Button
        asChild
        size="icon"
        variant="outline"
        className="shrink-0 rounded-full"
        aria-label="Kembali"
      >
        <Link href={backHref}>
          <HugeiconsIcon icon={ArrowLeft02Icon} size={16} />
        </Link>
      </Button>
    )
  }

  if (onBack) {
    return (
      <Button
        type="button"
        size="icon"
        variant="outline"
        className="shrink-0 rounded-full"
        aria-label="Kembali"
        onClick={onBack}
      >
        <HugeiconsIcon icon={ArrowLeft02Icon} size={16} />
      </Button>
    )
  }

  return null
}

export function PageShell({
  title,
  subtitle,
  backHref,
  onBack,
  actions,
  width = "narrow",
  bottomBar,
  className,
  children,
}: PageShellProps) {
  const widthClass = WIDTH_CLASS[width]

  return (
    <div
      className={cn(
        "flex min-w-0 flex-col gap-4 p-4 lg:gap-6 lg:p-6",
        className
      )}
    >
      <div
        className={cn(
          "mx-auto hidden w-full gap-4 lg:flex lg:flex-row lg:items-center lg:justify-between",
          widthClass
        )}
      >
        <div className="flex items-center gap-3">
          <BackButton backHref={backHref} onBack={onBack} />
          <div>
            <h1 className="text-xl font-bold tracking-tight lg:text-2xl">
              {title}
            </h1>
            {subtitle && (
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            )}
          </div>
        </div>
        {actions && (
          <div className="flex flex-wrap items-center gap-2">{actions}</div>
        )}
      </div>

      <div
        className={cn(
          "mx-auto flex w-full min-w-0 flex-col gap-6",
          widthClass,
          bottomBar && "pb-32 lg:pb-0"
        )}
      >
        {children}
      </div>

      {bottomBar && <MobileActionBar>{bottomBar}</MobileActionBar>}
    </div>
  )
}
