"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"

export type MutationResult = {
  success: boolean
  error?: string
  errors?: Record<string, string[]>
}

export function useCreateKategori() {
  const queryClient = useQueryClient()
  const router = useRouter()
  const mutation = useMutation({
    mutationFn: async (data: Record<string, unknown>): Promise<MutationResult> => {
      const res = await fetch("/api/kategori", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      return res.json()
    },
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ["kategori"] })
        queryClient.invalidateQueries({ queryKey: ["barang"] })
        router.refresh()
      }
    },
  })

  return {
    ...mutation,
    errors: mutation.data?.success === false ? (mutation.data.errors ?? null) : null,
  }
}

export function useUpdateKategori() {
  const queryClient = useQueryClient()
  const router = useRouter()
  const mutation = useMutation({
    mutationFn: async (data: Record<string, unknown> & { id: string }): Promise<MutationResult> => {
      const res = await fetch(`/api/kategori/${data.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      return res.json()
    },
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ["kategori"] })
        queryClient.invalidateQueries({ queryKey: ["barang"] })
        router.refresh()
      }
    },
  })

  return {
    ...mutation,
    errors: mutation.data?.success === false ? (mutation.data.errors ?? null) : null,
  }
}

export function useDeleteKategori() {
  const queryClient = useQueryClient()
  const router = useRouter()
  return useMutation({
    mutationFn: async (id: string): Promise<MutationResult> => {
      const res = await fetch(`/api/kategori/${id}`, { method: "DELETE" })
      return res.json()
    },
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ["kategori"] })
        queryClient.invalidateQueries({ queryKey: ["barang"] })
        router.refresh()
      }
    },
  })
}
