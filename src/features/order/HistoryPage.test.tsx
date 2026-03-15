import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { server } from '../../mocks/server'
import { renderWithStore } from '../../test-utils'
import { API_BASE_URL } from '../../utils/constants'
import { formatDate } from '../../utils/formatDate'
import { formatPrice } from '../../utils/formatPrice'
import HistoryPage from './HistoryPage'

const MOCK_SUBMITTED_AT = '2026-03-14T10:00:00.000Z'

// ----
// HistoryPage
// ----
describe('HistoryPage', () => {
  // ----
  // happy path
  // ----
  describe('happy path', () => {
    it('renders order item name and quantity after data loads', async () => {
      renderWithStore(<HistoryPage />)

      expect(await screen.findByText('麻辣牛肉麵 × 2')).toBeInTheDocument()
    })

    it('renders formatted submission date', async () => {
      renderWithStore(<HistoryPage />)

      expect(await screen.findByText(formatDate(MOCK_SUBMITTED_AT))).toBeInTheDocument()
    })

    it('renders order total with formatPrice', async () => {
      renderWithStore(<HistoryPage />)

      expect(await screen.findByText(`合計：${formatPrice(494)}`)).toBeInTheDocument()
    })
  })

  // ----
  // boundary
  // ----
  describe('boundary', () => {
    it('shows empty message when there are no orders', async () => {
      server.use(http.get(`${API_BASE_URL}/orders`, () => HttpResponse.json([])))
      renderWithStore(<HistoryPage />)

      expect(await screen.findByText('尚無訂單記錄')).toBeInTheDocument()
    })

    it('does not show clear history button when there are no orders', async () => {
      server.use(http.get(`${API_BASE_URL}/orders`, () => HttpResponse.json([])))
      renderWithStore(<HistoryPage />)

      await screen.findByText('尚無訂單記錄')
      expect(screen.queryByRole('button', { name: '清除歷史' })).not.toBeInTheDocument()
    })

    it('clicking clear history removes the order list', async () => {
      const user = userEvent.setup()
      renderWithStore(<HistoryPage />)

      await screen.findByText('麻辣牛肉麵 × 2')

      server.use(http.get(`${API_BASE_URL}/orders`, () => HttpResponse.json([])))
      await user.click(screen.getByRole('button', { name: '清除歷史' }))

      expect(await screen.findByText('尚無訂單記錄')).toBeInTheDocument()
    })
  })

  // ----
  // loading / error states
  // ----
  describe('loading / error states', () => {
    it('shows loading indicator while fetching', () => {
      renderWithStore(<HistoryPage />)

      expect(screen.getByRole('progressbar')).toBeInTheDocument()
    })
  })
})
