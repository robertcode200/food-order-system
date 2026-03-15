import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navigation from './components/Navigation'
import MenuPage from './features/menu/MenuPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigation />}>
          <Route index element={<MenuPage />} />
          {/* Phase 5: <Route path="checkout" element={<CheckoutPage />} /> */}
          {/* Phase 6: <Route path="history" element={<HistoryPage />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
