import { BrowserRouter, Routes, Route } from 'react-router-dom'
import MenuPage from './features/menu/MenuPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MenuPage />} />
        {/* Phase 4+ adds checkout, history, navigation */}
      </Routes>
    </BrowserRouter>
  )
}
