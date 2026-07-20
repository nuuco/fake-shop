import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { CartItem } from '../types/cart'
import type { Product } from '../types/product'

export const CART_STORAGE_KEY = 'fake-shop-cart'

function isCartItem(value: unknown): value is CartItem {
  if (typeof value !== 'object' || value === null) return false
  const item = value as Record<string, unknown>
  return (
    typeof item.productId === 'number' &&
    typeof item.title === 'string' &&
    typeof item.price === 'number' &&
    Number.isFinite(item.price) &&
    typeof item.quantity === 'number' &&
    Number.isFinite(item.quantity) &&
    item.quantity >= 1 &&
    typeof item.image === 'string'
  )
}

function loadCartFromStorage(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(isCartItem)
  } catch {
    return []
  }
}

export function persistCart(items: CartItem[]) {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
  } catch {
    // QuotaExceeded 등은 앱 흐름을 깨지 않도록 무시
  }
}

type CartState = {
  items: CartItem[]
}

type CartRootState = {
  cart: CartState
}

const initialState: CartState = {
  items: loadCartFromStorage(),
}

export type AddToCartPayload = Pick<Product, 'id' | 'title' | 'price' | 'image'>

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem(state, action: PayloadAction<AddToCartPayload>) {
      const existing = state.items.find((item) => item.productId === action.payload.id)
      if (existing) {
        existing.quantity += 1
        return
      }
      state.items.push({
        productId: action.payload.id,
        title: action.payload.title,
        price: action.payload.price,
        image: action.payload.image,
        quantity: 1,
      })
    },
    increase(state, action: PayloadAction<number>) {
      const item = state.items.find((i) => i.productId === action.payload)
      if (item) item.quantity += 1
    },
    decrease(state, action: PayloadAction<number>) {
      const item = state.items.find((i) => i.productId === action.payload)
      if (!item) return
      if (item.quantity <= 1) {
        state.items = state.items.filter((i) => i.productId !== action.payload)
        return
      }
      item.quantity -= 1
    },
    removeItem(state, action: PayloadAction<number>) {
      state.items = state.items.filter((i) => i.productId !== action.payload)
    },
  },
})

export const { addItem, increase, decrease, removeItem } = cartSlice.actions
export const cartReducer = cartSlice.reducer

export const selectCartItems = (state: CartRootState) => state.cart.items

export const selectCartTotal = (state: CartRootState) =>
  state.cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0)

export const selectCartCount = (state: CartRootState) =>
  state.cart.items.reduce((sum, item) => sum + item.quantity, 0)
