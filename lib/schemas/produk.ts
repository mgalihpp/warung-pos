import { z } from "zod"

export const categorySchema = z.object({
  name: z
    .string()
    .min(1, "Nama kategori wajib diisi")
    .max(100, "Nama kategori maksimal 100 karakter"),
  description: z
    .string()
    .max(500, "Deskripsi maksimal 500 karakter")
    .optional()
    .nullable(),
})

export type CategoryInput = z.infer<typeof categorySchema>

export const productBaseSchema = {
  name: z
    .string()
    .min(1, "Nama produk wajib diisi")
    .max(200, "Nama produk maksimal 200 karakter"),
  image: z.string().url("URL gambar tidak valid").nullable().optional(),
  categoryId: z.string().min(1, "Kategori wajib dipilih"),
  unit: z
    .string()
    .min(1, "Satuan wajib diisi")
    .max(20, "Satuan maksimal 20 karakter"),
  stock: z
    .coerce
    .number()
    .int("Stok harus bilangan bulat")
    .min(0, "Stok tidak boleh negatif"),
  minStock: z
    .coerce
    .number()
    .int("Stok minimum harus bilangan bulat")
    .min(0, "Stok minimum tidak boleh negatif"),
  buyPrice: z.coerce.number().min(0, "Harga beli tidak boleh negatif"),
  sellPrice: z.coerce.number().min(0, "Harga jual tidak boleh negatif"),
  description: z
    .string()
    .max(1000, "Deskripsi maksimal 1000 karakter")
    .optional()
    .nullable(),
  isActive: z.preprocess((val) => val !== "off", z.boolean()),
}

export const createProductSchema = z
  .object({
    ...productBaseSchema,
    stock: z.number().int("Stok harus bilangan bulat").min(0, "Stok tidak boleh negatif"),
    minStock: z
      .number()
      .int("Stok minimum harus bilangan bulat")
      .min(0, "Stok minimum tidak boleh negatif"),
    buyPrice: z.number().min(0, "Harga beli tidak boleh negatif"),
    sellPrice: z.number().min(0, "Harga jual tidak boleh negatif"),
  })
  .refine((data) => data.sellPrice >= data.buyPrice, {
    message: "Harga jual tidak boleh lebih kecil dari harga beli",
    path: ["sellPrice"],
  })

export const updateProductSchema = createProductSchema.extend({
  id: z.string().min(1, "ID produk wajib ada"),
})

export type CreateProductInput = z.infer<typeof createProductSchema>
export type UpdateProductInput = z.infer<typeof updateProductSchema>
