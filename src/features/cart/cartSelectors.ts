import { createSelector } from '@reduxjs/toolkit'
import type { RootState } from '../../app/store'

const selectCartSlice = (state: RootState) => state.cart

export const selectCartItems = createSelector([selectCartSlice], (cart) => cart.items)
export const selectIsCartOpen = createSelector([selectCartSlice], (cart) => cart.isCartOpen)

export const selectCartTotal = createSelector([selectCartItems], (items) =>
  items.reduce((sum, item) => sum + item.price * item.quantity, 0),
)

export const selectCartCount = createSelector([selectCartItems], (items) =>
  items.reduce((sum, item) => sum + item.quantity, 0),
)
