import { screen } from '@testing-library/react'
import { renderWithStore } from './test-utils'
import App from './App'

describe('App', () => {
  it('renders without crashing', () => {
    renderWithStore(<App />)
    expect(screen.getByText('Food Order System')).toBeInTheDocument()
  })
})
