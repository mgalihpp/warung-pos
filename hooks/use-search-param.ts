"use client"

import { useCallback, useMemo, useRef } from "react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"

export function useSearchParam(key: string, defaultValue = "") {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const searchParamsRef = useRef(searchParams)
  searchParamsRef.current = searchParams

  const value = searchParams.get(key) ?? defaultValue

  const setValue = useCallback(
    (newValue: string) => {
      const params = new URLSearchParams(searchParamsRef.current.toString())
      if (newValue === defaultValue || newValue === "") {
        params.delete(key)
      } else {
        params.set(key, newValue)
      }
      const qs = params.toString()
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
    },
    [router, pathname, key, defaultValue]
  )

  return [value, setValue] as const
}

type DefaultsMap = Record<string, string>

export function useSearchParamsState<T extends DefaultsMap>(defaults: T) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const searchParamsRef = useRef(searchParams)
  searchParamsRef.current = searchParams

  const values = useMemo(() => {
    const result: Record<string, string> = {}
    for (const key of Object.keys(defaults)) {
      result[key] = searchParams.get(key) ?? defaults[key]
    }
    return result as { [K in keyof T]: string }
  }, [searchParams])

  const setParams = useCallback(
    (updates: Partial<{ [K in keyof T]: string | undefined }>) => {
      const params = new URLSearchParams(searchParamsRef.current.toString())
      for (const [key, value] of Object.entries(updates)) {
        const defaultValue = defaults[key]
        if (value === undefined || value === defaultValue || value === "") {
          params.delete(key)
        } else {
          params.set(key, value)
        }
      }
      const qs = params.toString()
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
    },
    [router, pathname, defaults]
  )

  const resetParams = useCallback(() => {
    router.replace(pathname, { scroll: false })
  }, [router, pathname])

  return { values, setParams, resetParams } as const
}
