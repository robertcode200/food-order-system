import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { http, HttpResponse } from 'msw'
import { setupStore } from './app/store'
import { server } from './mocks/server'
import App from './App'

describe('App', () => {
  it('renders without crashing', async () => {
    server.use(
      http.get('http://localhost:3001/categories', () => HttpResponse.json([])),
      http.get('http://localhost:3001/foods', () => HttpResponse.json([])),
    )
    render(
      <Provider store={setupStore()}>
        <App />
      </Provider>,
    )
    expect(await screen.findByRole('main')).toBeInTheDocument()
  })
})
