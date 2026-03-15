import { createSlice, nanoid, type PayloadAction } from '@reduxjs/toolkit'
import type { FoodItem, CartItem } from '../../types'

export type CartState = {
  isCartOpen: boolean
  items: CartItem[]
}

const initialState: CartState = {
  isCartOpen: false,
  items: [],
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    toggleCart: (state) => {
      state.isCartOpen = !state.isCartOpen
    },
    setIsCartOpen: (state, action: PayloadAction<boolean>) => {
      state.isCartOpen = action.payload
    },
    addItem: {
      prepare: (food: FoodItem) => ({
        payload: {
          id: nanoid(),
          foodItemId: food.id,
          name: food.name,
          price: food.price,
          imageUrl: food.imageUrl,
          quantity: 1,
        } as CartItem,
      }),
      reducer: (state, action: PayloadAction<CartItem>) => {
        const existing = state.items.find((item) => item.foodItemId === action.payload.foodItemId)
        if (existing) {
          existing.quantity += 1
        } else {
          state.items.push(action.payload)
        }
      },
    },
    removeItem: (state, action: PayloadAction<string>) => {
      const existing = state.items.find((item) => item.id === action.payload)
      if (!existing) return
      if (existing.quantity > 1) {
        existing.quantity -= 1
      } else {
        state.items = state.items.filter((item) => item.id !== action.payload)
      }
    },
    clearItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload)
    },
    clearCart: (state) => {
      state.items = []
    },
  },
})

export const { toggleCart, setIsCartOpen, addItem, removeItem, clearItem, clearCart } =
  cartSlice.actions

export default cartSlice.reducer
