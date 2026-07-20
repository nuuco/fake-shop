import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { CartItem } from '../types/cart'
import type { Product } from '../types/product'

const CART_STORAGE_KEY = 'fake-shop-cart'

function loadCartFromStorage(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      (item): item is CartItem =>
        typeof item === 'object' &&
        item !== null &&
        typeof (item as CartItem).productId === 'number' &&
        typeof (item as CartItem).title === 'string' &&
        typeof (item as CartItem).price === 'number' &&
        typeof (item as CartItem).quantity === 'number' &&
        (item as CartItem).quantity >= 1,
    )
  } catch {
    return []
  }
}

export function persistCart(items: CartItem[]) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
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

type AddPayload = Pick<Product, 'id' | 'title' | 'price' | 'image'>

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem(state, action: PayloadAction<AddPayload>) {
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
    clearCart(state) {
      state.items = []
    },
  },
})

export const { addItem, increase, decrease, removeItem, clearCart } = cartSlice.actions
export const cartReducer = cartSlice.reducer

export const selectCartItems = (state: CartRootState) => state.cart.items

export const selectCartTotal = (state: CartRootState) =>
  state.cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0)

export const selectCartCount = (state: CartRootState) =>
  state.cart.items.reduce((sum, item) => sum + item.quantity, 0)
