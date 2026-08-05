"use client"

import { create } from "zustand"

export type PaymentMethod = "CASH" | "QRIS_MANUAL" | "MANUAL_TRANSFER"

export type CartItem = {
  productId: string
  name: string
  price: number // sellPrice
  costPrice: number // buyPrice
  unit: string
  quantity: number
  maxStock: number
  image: string | null
}

type CartStore = {
  items: CartItem[]
  paymentMethod: PaymentMethod
  amountPaid: number
  notes: string

  // Actions
  addItem: (product: {
    id: string
    name: string
    sellPrice: number
    buyPrice: number
    unit: string
    stock: number
    image: string | null
  }) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, qty: number) => void
  incrementItem: (productId: string) => void
  decrementItem: (productId: string) => void
  setPaymentMethod: (method: PaymentMethod) => void
  setAmountPaid: (amount: number) => void
  setNotes: (notes: string) => void
  clearCart: () => void
}

type AddableProduct = Parameters<CartStore["addItem"]>[0]

let queuedProducts: AddableProduct[] = []
let queuedFrame: number | null = null

function addProductToItems(items: CartItem[], product: AddableProduct) {
  const existing = items.find((item) => item.productId === product.id)

  if (existing) {
    if (existing.quantity >= existing.maxStock) return items

    return items.map((item) =>
      item.productId === product.id
        ? { ...item, quantity: item.quantity + 1 }
        : item
    )
  }

  return [
    ...items,
    {
      productId: product.id,
      name: product.name,
      price: product.sellPrice,
      costPrice: product.buyPrice,
      unit: product.unit,
      quantity: 1,
      maxStock: product.stock,
      image: product.image,
    },
  ]
}

export const useCartStore = create<CartStore>((set) => ({
  items: [],
  paymentMethod: "CASH",
  amountPaid: 0,
  notes: "",

  addItem: (product) => {
    queuedProducts.push(product)

    if (queuedFrame !== null) return

    queuedFrame = window.requestAnimationFrame(() => {
      const products = queuedProducts
      queuedProducts = []
      queuedFrame = null

      set((state) => ({
        items: products.reduce(addProductToItems, state.items),
      }))
    })
  },

  removeItem: (productId) =>
    set((state) => ({
      items: state.items.filter((item) => item.productId !== productId),
    })),

  updateQuantity: (productId, qty) =>
    set((state) => {
      if (qty <= 0) {
        return {
          items: state.items.filter((item) => item.productId !== productId),
        }
      }
      return {
        items: state.items.map((item) =>
          item.productId === productId
            ? { ...item, quantity: Math.min(qty, item.maxStock) }
            : item
        ),
      }
    }),

  incrementItem: (productId) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.productId === productId && item.quantity < item.maxStock
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ),
    })),

  decrementItem: (productId) =>
    set((state) => {
      const item = state.items.find((i) => i.productId === productId)
      if (!item) return state
      if (item.quantity <= 1) {
        return { items: state.items.filter((i) => i.productId !== productId) }
      }
      return {
        items: state.items.map((i) =>
          i.productId === productId ? { ...i, quantity: i.quantity - 1 } : i
        ),
      }
    }),

  setPaymentMethod: (method) => set({ paymentMethod: method }),
  setAmountPaid: (amount) => set({ amountPaid: amount }),
  setNotes: (notes) => set({ notes }),
  clearCart: () =>
    set({ items: [], paymentMethod: "CASH", amountPaid: 0, notes: "" }),
}))

// Derived selectors
export function useCartSubtotal() {
  return useCartStore((state) =>
    state.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  )
}

export function useCartTotal() {
  return useCartSubtotal()
}

export function useCartChange() {
  const total = useCartTotal()
  const amountPaid = useCartStore((state) => state.amountPaid)
  return amountPaid - total
}

export function useCartItemCount() {
  return useCartStore((state) =>
    state.items.reduce((sum, item) => sum + item.quantity, 0)
  )
}

export function useCartItemQuantity(productId: string) {
  return useCartStore(
    (state) =>
      state.items.find((item) => item.productId === productId)?.quantity ?? 0
  )
}
