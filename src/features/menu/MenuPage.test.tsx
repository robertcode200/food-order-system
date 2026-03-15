import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { server } from '../../mocks/server'
import { renderWithStore } from '../../test-utils'
import { formatPrice } from '../../utils/formatPrice'
import MenuPage from './MenuPage'

// ----
// MenuPage
// ----
describe('MenuPage', () => {
  // ----
  // happy path
  // ----
  describe('happy path', () => {
    it('renders all food items after data loads', async () => {
      renderWithStore(<MenuPage />)

      await screen.findByText('麻辣牛肉麵')
      await screen.findByText('肉絲蛋炒飯')
    })

    it('renders category chips including 全部', async () => {
      renderWithStore(<MenuPage />)

      await screen.findByRole('button', { name: '全部' })
      await screen.findByRole('button', { name: '麵類' })
      await screen.findByRole('button', { name: '飯類' })
    })

    it('renders food name and TWD-formatted price', async () => {
      renderWithStore(<MenuPage />)

      await screen.findByText('麻辣牛肉麵')
      // formatPrice is imported so the assertion is consistent across Node.js ICU builds
      await screen.findByText(formatPrice(247))
    })
  })

  // ----
  // category filter
  // ----
  describe('category filter', () => {
    it('clicking a category chip shows only foods in that category', async () => {
      const user = userEvent.setup()
      renderWithStore(<MenuPage />)

      const noodleChip = await screen.findByRole('button', { name: '麵類' })
      await user.click(noodleChip)

      expect(screen.getByText('麻辣牛肉麵')).toBeInTheDocument()
      expect(screen.queryByText('肉絲蛋炒飯')).not.toBeInTheDocument()
    })

    it('clicking 全部 shows all foods again', async () => {
      const user = userEvent.setup()
      renderWithStore(<MenuPage />)

      const noodleChip = await screen.findByRole('button', { name: '麵類' })
      await user.click(noodleChip)

      const allChip = screen.getByRole('button', { name: '全部' })
      await user.click(allChip)

      expect(screen.getByText('麻辣牛肉麵')).toBeInTheDocument()
      expect(screen.getByText('肉絲蛋炒飯')).toBeInTheDocument()
    })

    it('clicking the active chip again resets to show all', async () => {
      const user = userEvent.setup()
      renderWithStore(<MenuPage />)

      const noodleChip = await screen.findByRole('button', { name: '麵類' })
      await user.click(noodleChip)
      await user.click(noodleChip)

      expect(screen.getByText('麻辣牛肉麵')).toBeInTheDocument()
      expect(screen.getByText('肉絲蛋炒飯')).toBeInTheDocument()
    })

    it('switching directly to another category chip updates the filter without resetting to all', async () => {
      const user = userEvent.setup()
      renderWithStore(<MenuPage />)

      const noodleChip = await screen.findByRole('button', { name: '麵類' })
      await user.click(noodleChip)

      const riceChip = screen.getByRole('button', { name: '飯類' })
      await user.click(riceChip)

      expect(screen.queryByText('麻辣牛肉麵')).not.toBeInTheDocument()
      expect(screen.getByText('肉絲蛋炒飯')).toBeInTheDocument()
    })
  })

  // ----
  // add to cart
  // ----
  describe('add to cart', () => {
    it('clicking 加入購物車 dispatches addItem and updates cart state', async () => {
      const user = userEvent.setup()
      const { store } = renderWithStore(<MenuPage />)

      await screen.findByText('麻辣牛肉麵')
      const addButtons = screen.getAllByRole('button', { name: '加入購物車' })
      await user.click(addButtons[0])

      const { items } = store.getState().cart
      expect(items).toHaveLength(1)
      expect(items[0].name).toBe('麻辣牛肉麵')
      expect(items[0].foodItemId).toBe('food-uuid-1')
    })

    it('clicking 加入購物車 twice for the same item increases quantity rather than adding a duplicate', async () => {
      const user = userEvent.setup()
      const { store } = renderWithStore(<MenuPage />)

      await screen.findByText('麻辣牛肉麵')
      const addButtons = screen.getAllByRole('button', { name: '加入購物車' })
      await user.click(addButtons[0])
      await user.click(addButtons[0])

      const { items } = store.getState().cart
      expect(items).toHaveLength(1)
      expect(items[0].quantity).toBe(2)
    })
  })

  // ----
  // loading / error states
  // ----
  describe('loading / error states', () => {
    it('shows loading indicator while fetching', () => {
      renderWithStore(<MenuPage />)

      expect(screen.getByRole('progressbar')).toBeInTheDocument()
    })

    it('shows error message when API fails', async () => {
      server.use(http.get('http://localhost:3001/categories', () => HttpResponse.error()))
      renderWithStore(<MenuPage />)

      await screen.findByText('無法載入菜單，請稍後再試。')
    })
  })
})
