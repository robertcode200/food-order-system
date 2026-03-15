import { describe, it, expect } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithStore } from '../../test-utils'
import { formatPrice } from '../../utils/formatPrice'
import CheckoutPage from './CheckoutPage'
import type { CartItem } from '../../types'

const mockBeefNoodle: CartItem = {
  id: 'ci-1',
  foodItemId: 'food-uuid-1',
  name: '麻辣牛肉麵',
  price: 247,
  imageUrl: '',
  quantity: 2,
}

const mockPorkRiceBowl: CartItem = {
  id: 'ci-2',
  foodItemId: 'food-uuid-2',
  name: '肉絲蛋炒飯',
  price: 135,
  imageUrl: '',
  quantity: 1,
}

const preloadedWithItems = {
  cart: { isCartOpen: false, items: [mockBeefNoodle, mockPorkRiceBowl] },
}

describe('CheckoutPage', () => {
  describe('happy path', () => {
    it('renders item names from preloaded cart', () => {
      renderWithStore(<CheckoutPage />, { preloadedState: preloadedWithItems })

      expect(screen.getByText('麻辣牛肉麵')).toBeInTheDocument()
      expect(screen.getByText('肉絲蛋炒飯')).toBeInTheDocument()
    })

    it('renders correct cart total', () => {
      const expectedTotal = 247 * 2 + 135 * 1

      renderWithStore(<CheckoutPage />, { preloadedState: preloadedWithItems })

      expect(screen.getByText(`合計：${formatPrice(expectedTotal)}`)).toBeInTheDocument()
    })

    it('increments quantity when + button is clicked', async () => {
      const user = userEvent.setup()

      renderWithStore(<CheckoutPage />, {
        preloadedState: {
          cart: {
            isCartOpen: false,
            items: [{ ...mockBeefNoodle, quantity: 1 }],
          },
        },
      })

      await user.click(screen.getByRole('button', { name: /increase quantity of 麻辣牛肉麵/i }))

      expect(screen.getByText('2')).toBeInTheDocument()
    })

    it('decrements quantity when - button is clicked', async () => {
      const user = userEvent.setup()

      renderWithStore(<CheckoutPage />, {
        preloadedState: {
          cart: {
            isCartOpen: false,
            items: [{ ...mockBeefNoodle, quantity: 2 }],
          },
        },
      })

      await user.click(screen.getByRole('button', { name: /decrease quantity of 麻辣牛肉麵/i }))

      expect(screen.getByText('1')).toBeInTheDocument()
    })

    it('clears the cart after order is submitted successfully', async () => {
      const user = userEvent.setup()

      const { store } = renderWithStore(<CheckoutPage />, {
        preloadedState: preloadedWithItems,
      })

      await user.click(screen.getByRole('button', { name: '送出訂單' }))

      await waitFor(() => expect(store.getState().cart.items).toHaveLength(0))
    })
  })

  describe('boundary', () => {
    it('shows empty state when cart has no items', () => {
      renderWithStore(<CheckoutPage />, {
        preloadedState: { cart: { isCartOpen: false, items: [] } },
      })

      expect(screen.getByText('購物車是空的')).toBeInTheDocument()
    })

    it('does not render submit button when cart is empty', () => {
      renderWithStore(<CheckoutPage />, {
        preloadedState: { cart: { isCartOpen: false, items: [] } },
      })

      expect(screen.queryByRole('button', { name: '送出訂單' })).not.toBeInTheDocument()
    })

    it('removes item when - is clicked on quantity 1', async () => {
      const user = userEvent.setup()

      renderWithStore(<CheckoutPage />, {
        preloadedState: {
          cart: {
            isCartOpen: false,
            items: [{ ...mockBeefNoodle, quantity: 1 }],
          },
        },
      })

      await user.click(screen.getByRole('button', { name: /decrease quantity of 麻辣牛肉麵/i }))

      expect(screen.queryByText('麻辣牛肉麵')).not.toBeInTheDocument()
    })
  })

  describe('edge cases', () => {
    it('removes only the targeted item when × is clicked', async () => {
      const user = userEvent.setup()

      renderWithStore(<CheckoutPage />, { preloadedState: preloadedWithItems })

      await user.click(screen.getByRole('button', { name: /remove 麻辣牛肉麵 from cart/i }))

      expect(screen.queryByText('麻辣牛肉麵')).not.toBeInTheDocument()
      expect(screen.getByText('肉絲蛋炒飯')).toBeInTheDocument()
    })
  })
})
