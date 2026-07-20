import { configureStore } from '@reduxjs/toolkit'
import { cartReducer, persistCart } from './cartSlice'

export const store = configureStore({
  reducer: {
    cart: cartReducer,
  },
})

let previousCartItems = store.getState().cart.items

store.subscribe(() => {
  const nextItems = store.getState().cart.items
  if (nextItems === previousCartItems) return
  previousCartItems = nextItems
  persistCart(nextItems)
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
