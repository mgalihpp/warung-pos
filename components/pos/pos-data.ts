// ─── Types ────────────────────────────────────────────────────────────────────

export type Category = {
  name: string
  active: boolean
}

export type Product = {
  id: number
  name: string
  price: number
  stock: number
}

export type CartItem = {
  id: number
  name: string
  price: number
  qty: number
  subtotal: number
}

export type RecentTransaction = {
  id: string
  total: number
  user: string
  time: string
}

// ─── Data ─────────────────────────────────────────────────────────────────────

export const categories: Category[] = [
  { name: "Semua", active: true },
  { name: "Sembako", active: false },
  { name: "Minuman", active: false },
  { name: "Snack", active: false },
  { name: "Bumbu", active: false },
  { name: "Kebutuhan Rumah", active: false },
]

export const products: Product[] = [
  { id: 1, name: "Beras 5kg", price: 75000, stock: 24 },
  { id: 2, name: "Gula Pasir 1kg", price: 16000, stock: 36 },
  { id: 3, name: "Minyak Goreng 1L", price: 18000, stock: 28 },
  { id: 4, name: "Telur Ayam 1kg", price: 28000, stock: 40 },
  { id: 5, name: "Mie Instan", price: 3500, stock: 120 },
  { id: 6, name: "Tepung Terigu 1kg", price: 14000, stock: 30 },
  { id: 7, name: "Kecap Manis", price: 12000, stock: 22 },
  { id: 8, name: "Air Mineral 600ml", price: 4000, stock: 100 },
  { id: 9, name: "Kopi Sachet", price: 2500, stock: 80 },
  { id: 10, name: "Sabun Mandi", price: 5500, stock: 45 },
  { id: 11, name: "Deterjen 800g", price: 18000, stock: 25 },
  { id: 12, name: "Susu Kental Manis", price: 11000, stock: 32 },
]

export const cartItems: CartItem[] = [
  { id: 1, name: "Beras 5kg", price: 75000, qty: 1, subtotal: 75000 },
  { id: 3, name: "Minyak Goreng 1L", price: 18000, qty: 2, subtotal: 36000 },
  { id: 2, name: "Gula Pasir 1kg", price: 16000, qty: 1, subtotal: 16000 },
  { id: 5, name: "Mie Instan", price: 3500, qty: 4, subtotal: 14000 },
  { id: 4, name: "Telur Ayam 1kg", price: 28000, qty: 1, subtotal: 28000 },
]

export const recentTransactions: RecentTransaction[] = [
  { id: "TRX-240524-018", total: 47500, user: "Siti", time: "10:28" },
  { id: "TRX-240524-017", total: 23000, user: "Siti", time: "10:15" },
  { id: "TRX-240524-016", total: 89000, user: "Siti", time: "09:58" },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

export const formatCurrency = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
    .format(value)
    .replace("IDR", "Rp")
