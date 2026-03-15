import { afterAll, beforeAll, describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithStore } from '../../test-utils'
import { formatPrice } from '../../utils/formatPrice'
import CartDropdown from './CartDropdown'
import type { CartItem } from '../../types'

const mockBeefNoodle: CartItem = {
  id: 'cart-1',
  foodItemId: 'food-uuid-1',
  name: '麻辣牛肉麵',
  price: 247,
  imageUrl: 'https://example.com/beef-noodle.jpg',
  quantity: 2,
}

const mockPorkRiceBowl: CartItem = {
  id: 'cart-2',
  foodItemId: 'food-uuid-2',
  name: '排骨飯',
  price: 120,
  imageUrl: 'https://example.com/pork-rice.jpg',
  quantity: 1,
}

let anchorEl: HTMLButtonElement

beforeAll(() => {
  anchorEl = document.createElement('button')
  document.body.appendChild(anchorEl)
})

afterAll(() => {
  document.body.removeChild(anchorEl)
})

describe('CartDropdown', () => {
  describe('happy path', () => {
    it('renders each cart item with name and line total', () => {
      renderWithStore(<CartDropdown anchorEl={anchorEl} />, {
        preloadedState: {
          cart: { isCartOpen: true, items: [mockBeefNoodle, mockPorkRiceBowl] },
        },
      })

      expect(screen.getByText('麻辣牛肉麵')).toBeInTheDocument()
      expect(screen.getByText('排骨飯')).toBeInTheDocument()
      expect(screen.getByText(formatPrice(247 * 2))).toBeInTheDocument()
      // 120 × 1 = 120 — unit price and line total are the same value, so it appears twice
      expect(screen.getAllByText(formatPrice(120 * 1)).length).toBeGreaterThanOrEqual(1)
    })

    it('shows correct cart total for multiple items', () => {
      const expectedTotal = 247 * 2 + 120 * 1

      renderWithStore(<CartDropdown anchorEl={anchorEl} />, {
        preloadedState: {
          cart: { isCartOpen: true, items: [mockBeefNoodle, mockPorkRiceBowl] },
        },
      })

      const totalElements = screen.getAllByText(formatPrice(expectedTotal))
      expect(totalElements.length).toBeGreaterThanOrEqual(1)
    })

    it('shows empty state message when cart has no items', () => {
      renderWithStore(<CartDropdown anchorEl={anchorEl} />, {
        preloadedState: {
          cart: { isCartOpen: true, items: [] },
        },
      })

      expect(screen.getByText('購物車是空的')).toBeInTheDocument()
    })
  })

  describe('boundary', () => {
    it('disables checkout button when cart is empty', () => {
      renderWithStore(<CartDropdown anchorEl={anchorEl} />, {
        preloadedState: {
          cart: { isCartOpen: true, items: [] },
        },
      })

      expect(screen.getByRole('button', { name: '前往結帳' })).toBeDisabled()
    })
  })

  describe('edge cases', () => {
    it('removes item from cart when remove button is clicked', async () => {
      const user = userEvent.setup()

      const { store } = renderWithStore(<CartDropdown anchorEl={anchorEl} />, {
        preloadedState: {
          cart: { isCartOpen: true, items: [mockBeefNoodle] },
        },
      })

      await user.click(screen.getByRole('button', { name: /remove 麻辣牛肉麵 from cart/i }))

      expect(store.getState().cart.items).toHaveLength(0)
    })
  })
})
