import { selectCartTotal, selectCartCount } from './cartSelectors'
import type { RootState } from '../../app/store'
import type { CartItem } from '../../types'

const makeState = (items: CartItem[]): RootState =>
  ({ cart: { isCartOpen: false, items } }) as RootState

const mockBeefNoodle: CartItem = {
  id: 'cart-uuid-1',
  foodItemId: 'food-uuid-1',
  name: '麻辣牛肉麵',
  price: 247,
  imageUrl: 'https://example.com/beef-noodle.jpg',
  quantity: 1,
}

const mockPorkRiceBowl: CartItem = {
  id: 'cart-uuid-2',
  foodItemId: 'food-uuid-2',
  name: '排骨飯',
  price: 120,
  imageUrl: 'https://example.com/pork-rice.jpg',
  quantity: 1,
}

// ----
// selectCartTotal
// ----
describe('selectCartTotal', () => {
  describe('happy path', () => {
    it('returns 0 for an empty cart', () => {
      const state = makeState([])
      expect(selectCartTotal(state)).toBe(0)
    })

    it('calculates total as unit price × quantity for a single item', () => {
      const item = { ...mockBeefNoodle, quantity: 3 }
      const state = makeState([item])
      expect(selectCartTotal(state)).toBe(247 * 3)
    })

    it('calculates total as sum of unit price × quantity across multiple items', () => {
      const beef = { ...mockBeefNoodle, quantity: 2 }
      const pork = { ...mockPorkRiceBowl, quantity: 4 }
      const state = makeState([beef, pork])
      expect(selectCartTotal(state)).toBe(247 * 2 + 120 * 4)
    })
  })
})

// ----
// selectCartCount
// ----
describe('selectCartCount', () => {
  describe('happy path', () => {
    it('returns 0 for an empty cart', () => {
      const state = makeState([])
      expect(selectCartCount(state)).toBe(0)
    })

    it('returns the quantity for a single item', () => {
      const item = { ...mockBeefNoodle, quantity: 3 }
      const state = makeState([item])
      expect(selectCartCount(state)).toBe(3)
    })

    it('returns the sum of quantities across multiple items', () => {
      const beef = { ...mockBeefNoodle, quantity: 2 }
      const pork = { ...mockPorkRiceBowl, quantity: 4 }
      const state = makeState([beef, pork])
      expect(selectCartCount(state)).toBe(6)
    })
  })
})
