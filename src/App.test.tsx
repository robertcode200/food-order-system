import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { http, HttpResponse } from 'msw'
import { setupStore } from './app/store'
import { server } from './mocks/server'
import { API_BASE_URL } from './utils/constants'
import App from './App'

describe('App', () => {
  it('renders without crashing', async () => {
    server.use(
      http.get(`${API_BASE_URL}/categories`, () => HttpResponse.json([])),
      http.get(`${API_BASE_URL}/foods`, () => HttpResponse.json([])),
    )
    render(
      <Provider store={setupStore()}>
        <App />
      </Provider>,
    )
    expect(await screen.findByRole('main')).toBeInTheDocument()
  })
})
