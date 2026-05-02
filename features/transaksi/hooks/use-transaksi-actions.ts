"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"

type MutationResult = {
  success: boolean
  error?: string
}

// ── Delete Transaction ──


export function useDeleteTransaction() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string): Promise<MutationResult> => {
      const res = await fetch(`/api/transaksi/${id}`, {
        method: "DELETE",
      })
      return res.json()
    },
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ["transaksi"] })
      }
    },
  })
}

// ── Update Transaction (full edit) ──

export type UpdateTransactionPayload = {
  id: string
  items: { productId: string; quantity: number }[]
  paymentMethod: "CASH" | "QRIS_MANUAL" | "MANUAL_TRANSFER"
  amountPaid: number
  notes?: string
}

export function useUpdateTransaction() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: UpdateTransactionPayload): Promise<MutationResult> => {
      const res = await fetch(`/api/transaksi/${data.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: data.items,
          paymentMethod: data.paymentMethod,
          amountPaid: data.amountPaid,
          notes: data.notes,
        }),
      })
      return res.json()
    },
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ["transaksi"] })
      }
    },
  })
}
