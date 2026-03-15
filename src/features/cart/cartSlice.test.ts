import { describe, it, expect } from 'vitest'
import cartReducer, { addItem } from './cartSlice'
import type { CartState } from './cartSlice'
import type { FoodItem } from '../../types'

const initialState: CartState = { isCartOpen: false, items: [] }

const mockFood: FoodItem = {
  id: 'food-uuid-1',
  name: '麻辣牛肉麵',
  price: 247,
  categoryId: 'cat-uuid-1',
  imageUrl: 'https://example.com/beef-noodle.jpg',
}

describe('addItem', () => {
  describe('happy path', () => {
    it('adds a new food item to the cart with quantity 1', () => {
      const state = cartReducer(initialState, addItem(mockFood))
      expect(state.items).toHaveLength(1)
      expect(state.items[0].foodItemId).toBe('food-uuid-1')
      expect(state.items[0].name).toBe('麻辣牛肉麵')
      expect(state.items[0].price).toBe(247)
      expect(state.items[0].quantity).toBe(1)
    })

    it('increases quantity when the same item is added again — no duplicate row', () => {
      const afterFirst = cartReducer(initialState, addItem(mockFood))
      const state = cartReducer(afterFirst, addItem(mockFood))
      expect(state.items).toHaveLength(1)
      expect(state.items[0].quantity).toBe(2)
    })

    it('reaches quantity 3 after adding the same item three times', () => {
      const afterFirst = cartReducer(initialState, addItem(mockFood))
      const afterSecond = cartReducer(afterFirst, addItem(mockFood))
      const state = cartReducer(afterSecond, addItem(mockFood))
      expect(state.items).toHaveLength(1)
      expect(state.items[0].quantity).toBe(3)
    })
  })
})
