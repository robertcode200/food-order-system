import { describe, it, expect } from 'vitest'
import cartReducer, {
  addItem,
  removeItem,
  clearItem,
  clearCart,
  toggleCart,
  setIsCartOpen,
} from './cartSlice'
import type { CartState } from './cartSlice'
import type { FoodItem } from '../../types'

const initialState: CartState = { isCartOpen: false, items: [] }

const mockBeefNoodle: FoodItem = {
  id: 'food-uuid-1',
  name: '麻辣牛肉麵',
  price: 247,
  categoryId: 'cat-uuid-1',
  imageUrl: 'https://example.com/beef-noodle.jpg',
}

const mockPorkRiceBowl: FoodItem = {
  id: 'food-uuid-2',
  name: '排骨飯',
  price: 120,
  categoryId: 'cat-uuid-2',
  imageUrl: 'https://example.com/pork-rice.jpg',
}

// ----------------------------------------------------------
// clearItem
// ----------------------------------------------------------
describe('clearItem', () => {
  describe('happy path', () => {
    it('removes the item entirely when quantity is 1', () => {
      const withOne = cartReducer(initialState, addItem(mockBeefNoodle))
      const itemId = withOne.items[0].id

      const state = cartReducer(withOne, clearItem(itemId))

      expect(state.items).toHaveLength(0)
    })
  })

  describe('edge cases', () => {
    it('removes the item entirely even when quantity is greater than 1', () => {
      const afterFirst = cartReducer(initialState, addItem(mockBeefNoodle))
      const withTwo = cartReducer(afterFirst, addItem(mockBeefNoodle))
      const itemId = withTwo.items[0].id

      const state = cartReducer(withTwo, clearItem(itemId))

      expect(state.items).toHaveLength(0)
    })

    it('only removes the targeted item — other items are not affected', () => {
      const withFirst = cartReducer(initialState, addItem(mockBeefNoodle))
      const withBoth = cartReducer(withFirst, addItem(mockPorkRiceBowl))
      const firstItemId = withBoth.items[0].id

      const state = cartReducer(withBoth, clearItem(firstItemId))

      expect(state.items).toHaveLength(1)
      expect(state.items[0].foodItemId).toBe('food-uuid-2')
    })

    it('does nothing when the item id does not exist in the cart', () => {
      const withOne = cartReducer(initialState, addItem(mockBeefNoodle))

      const state = cartReducer(withOne, clearItem('non-existent-id'))

      expect(state.items).toHaveLength(1)
    })
  })
})

// ----------------------------------------------------------
// clearCart
// ----------------------------------------------------------
describe('clearCart', () => {
  describe('happy path', () => {
    it('empties all items after order is submitted', () => {
      const afterFirst = cartReducer(initialState, addItem(mockBeefNoodle))
      const withTwo = cartReducer(afterFirst, addItem(mockPorkRiceBowl))

      const state = cartReducer(withTwo, clearCart())

      expect(state.items).toHaveLength(0)
    })
  })

  describe('edge cases', () => {
    it('does not affect isCartOpen when clearing items', () => {
      const withOpen = cartReducer(initialState, setIsCartOpen(true))
      const withItem = cartReducer(withOpen, addItem(mockBeefNoodle))

      const state = cartReducer(withItem, clearCart())

      expect(state.items).toHaveLength(0)
      expect(state.isCartOpen).toBe(true)
    })
  })
})

// ----------------------------------------------------------
// toggleCart / setIsCartOpen
// ----------------------------------------------------------
describe('toggleCart', () => {
  describe('happy path', () => {
    it('opens the cart when it is closed', () => {
      const state = cartReducer(initialState, toggleCart())
      expect(state.isCartOpen).toBe(true)
    })

    it('closes the cart when it is open', () => {
      const withOpen = cartReducer(initialState, toggleCart())
      const state = cartReducer(withOpen, toggleCart())
      expect(state.isCartOpen).toBe(false)
    })
  })
})

describe('setIsCartOpen', () => {
  describe('happy path', () => {
    it('sets isCartOpen to true', () => {
      const state = cartReducer(initialState, setIsCartOpen(true))
      expect(state.isCartOpen).toBe(true)
    })

    it('sets isCartOpen to false', () => {
      const withOpen = cartReducer(initialState, setIsCartOpen(true))
      const state = cartReducer(withOpen, setIsCartOpen(false))
      expect(state.isCartOpen).toBe(false)
    })
  })
})

// ----------------------------------------------------------
// removeItem
// ----------------------------------------------------------
describe('removeItem', () => {
  describe('happy path', () => {
    it('decreases quantity by 1 when the item has more than one', () => {
      const afterFirst = cartReducer(initialState, addItem(mockBeefNoodle))
      const withTwo = cartReducer(afterFirst, addItem(mockBeefNoodle))
      const itemId = withTwo.items[0].id

      const state = cartReducer(withTwo, removeItem(itemId))

      expect(state.items).toHaveLength(1)
      expect(state.items[0].quantity).toBe(1)
    })
  })

  describe('boundary', () => {
    it('removes the line item entirely when quantity reaches zero', () => {
      const withOne = cartReducer(initialState, addItem(mockBeefNoodle))
      const itemId = withOne.items[0].id

      const state = cartReducer(withOne, removeItem(itemId))

      expect(state.items).toHaveLength(0)
    })
  })

  describe('edge cases', () => {
    it('only removes the targeted item — other items in the cart are not affected', () => {
      const withFirst = cartReducer(initialState, addItem(mockBeefNoodle))
      const withBoth = cartReducer(withFirst, addItem(mockPorkRiceBowl))
      const firstItemId = withBoth.items[0].id

      const state = cartReducer(withBoth, removeItem(firstItemId))

      expect(state.items).toHaveLength(1)
      expect(state.items[0].foodItemId).toBe('food-uuid-2')
    })

    it('does nothing when the item id does not exist in the cart', () => {
      const withOne = cartReducer(initialState, addItem(mockBeefNoodle))

      const state = cartReducer(withOne, removeItem('non-existent-id'))

      expect(state.items).toHaveLength(1)
      expect(state.items[0].quantity).toBe(1)
    })
  })
})

// ----------------------------------------------------------
// addItem
// ----------------------------------------------------------
describe('addItem', () => {
  describe('happy path', () => {
    it('adds a new food item to the cart with quantity 1', () => {
      const state = cartReducer(initialState, addItem(mockBeefNoodle))
      expect(state.items).toHaveLength(1)
      expect(state.items[0].foodItemId).toBe('food-uuid-1')
      expect(state.items[0].name).toBe('麻辣牛肉麵')
      expect(state.items[0].price).toBe(247)
      expect(state.items[0].quantity).toBe(1)
    })

    it('increases quantity when the same item is added again — no duplicate row', () => {
      const afterFirst = cartReducer(initialState, addItem(mockBeefNoodle))
      const state = cartReducer(afterFirst, addItem(mockBeefNoodle))
      expect(state.items).toHaveLength(1)
      expect(state.items[0].quantity).toBe(2)
    })

    it('reaches quantity 3 after adding the same item three times', () => {
      const afterFirst = cartReducer(initialState, addItem(mockBeefNoodle))
      const afterSecond = cartReducer(afterFirst, addItem(mockBeefNoodle))
      const state = cartReducer(afterSecond, addItem(mockBeefNoodle))
      expect(state.items).toHaveLength(1)
      expect(state.items[0].quantity).toBe(3)
    })

    it('two different food items each appear as separate line items', () => {
      const afterFirst = cartReducer(initialState, addItem(mockBeefNoodle))
      const state = cartReducer(afterFirst, addItem(mockPorkRiceBowl))

      expect(state.items).toHaveLength(2)
      expect(state.items[0].foodItemId).toBe('food-uuid-1')
      expect(state.items[1].foodItemId).toBe('food-uuid-2')
    })
  })
})
