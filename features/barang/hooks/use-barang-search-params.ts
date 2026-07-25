"use client"

import { useCallback, useMemo } from "react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"

const defaults = {
  search: "",
  category: "Semua",
  status: "Semua Status",
  sort: "Nama A-Z",
  page: "1",
} as const

type ParamKey = keyof typeof defaults

export function useBarangSearchParams() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const values = useMemo(
    () => ({
      search: searchParams.get("search") ?? defaults.search,
      category: searchParams.get("category") ?? defaults.category,
      status: searchParams.get("status") ?? defaults.status,
      sort: searchParams.get("sort") ?? defaults.sort,
      page: searchParams.get("page") ?? defaults.page,
    }),
    [searchParams],
  )

  const setParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      const defaultVal = defaults[key as ParamKey]
      if (value === defaultVal || value === "") {
        params.delete(key)
      } else {
        params.set(key, value)
      }
      if (key !== "page") {
        params.delete("page")
      }
      const qs = params.toString()
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
    },
    [router, pathname, searchParams],
  )

  const resetFilters = useCallback(() => {
    router.replace(pathname, { scroll: false })
  }, [router, pathname])

  return {
    search: values.search,
    category: values.category,
    status: values.status,
    sort: values.sort,
    page: Number(values.page),
    setSearch: useCallback(
      (value: string) => setParam("search", value),
      [setParam],
    ),
    setCategory: useCallback(
      (value: string) => setParam("category", value),
      [setParam],
    ),
    setStatus: useCallback(
      (value: string) => setParam("status", value),
      [setParam],
    ),
    setSort: useCallback(
      (value: string) => setParam("sort", value),
      [setParam],
    ),
    setPage: useCallback(
      (value: number) => setParam("page", String(value)),
      [setParam],
    ),
    resetFilters,
  }
}
