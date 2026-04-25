import { z } from "zod/v4"

export const createTransactionSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string().min(1, "ID produk wajib diisi"),
        quantity: z.number().int().min(1, "Minimal 1 item"),
      })
    )
    .min(1, "Minimal 1 item dalam transaksi"),
  paymentMethod: z.enum(["CASH", "QRIS_MANUAL", "MANUAL_TRANSFER"]),
  amountPaid: z.number().min(0, "Jumlah bayar tidak boleh negatif"),
  notes: z.string().optional(),
})

export type CreateTransactionInput = z.infer<typeof createTransactionSchema>
