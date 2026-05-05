"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"

export type MutationResult = {
  success: boolean
  error?: string
  errors?: Record<string, string[]>
}

export function useCreateProduct() {
  const queryClient = useQueryClient()
  const router = useRouter()
  const mutation = useMutation({
    mutationFn: async (data: Record<string, unknown>): Promise<MutationResult> => {
      const res = await fetch("/api/produk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      return res.json()
    },
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ["produk"] })
        router.refresh()
      }
    },
  })

  return {
    ...mutation,
    errors: mutation.data?.success === false ? (mutation.data.errors ?? null) : null,
  }
}

export function useUpdateProduct() {
  const queryClient = useQueryClient()
  const router = useRouter()
  const mutation = useMutation({
    mutationFn: async (data: Record<string, unknown> & { id: string }): Promise<MutationResult> => {
      const res = await fetch(`/api/produk/${data.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      return res.json()
    },
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ["produk"] })
        router.refresh()
      }
    },
  })

  return {
    ...mutation,
    errors: mutation.data?.success === false ? (mutation.data.errors ?? null) : null,
  }
}

export function useDeleteProduct() {
  const queryClient = useQueryClient()
  const router = useRouter()
  return useMutation({
    mutationFn: async (id: string): Promise<MutationResult> => {
      const res = await fetch(`/api/produk/${id}`, {
        method: "DELETE",
      })
      return res.json()
    },
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ["produk"] })
        router.refresh()
      }
    },
  })
}

export function useToggleProductActive() {
  const queryClient = useQueryClient()
  const router = useRouter()
  return useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }): Promise<MutationResult> => {
      const res = await fetch(`/api/produk/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "toggleActive", isActive: !isActive }),
      })
      return res.json()
    },
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ["produk"] })
        router.refresh()
      }
    },
  })
}

export function useAdjustStock() {
  const queryClient = useQueryClient()
  const router = useRouter()
  return useMutation({
    mutationFn: async ({
      productId,
      mode,
      quantity,
      reason,
    }: {
      productId: string
      mode: string
      quantity: number
      reason?: string
    }): Promise<MutationResult> => {
      const res = await fetch(`/api/produk/${productId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "adjustStock", mode, quantity, reason }),
      })
      return res.json()
    },
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ["produk"] })
        router.refresh()
      }
    },
  })
}
