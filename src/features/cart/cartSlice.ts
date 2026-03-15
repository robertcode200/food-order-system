import { createSlice } from '@reduxjs/toolkit'

const cartSlice = createSlice({
  name: 'cart',
  initialState: { isCartOpen: false, items: [] },
  reducers: {},
})

export default cartSlice.reducer
