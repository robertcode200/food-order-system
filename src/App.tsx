import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navigation from './components/Navigation'
import MenuPage from './features/menu/MenuPage'
import CheckoutPage from './features/checkout/CheckoutPage'
import HistoryPage from './features/order/HistoryPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigation />}>
          <Route index element={<MenuPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="history" element={<HistoryPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
