import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Navigation from './components/Navigation'
import NotFoundPage from './components/NotFoundPage'

const MenuPage = lazy(() => import('./features/menu/MenuPage'))
const CheckoutPage = lazy(() => import('./features/checkout/CheckoutPage'))
const HistoryPage = lazy(() => import('./features/order/HistoryPage'))

function PageLoader() {
  return (
    <Box
      sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}
    >
      <CircularProgress />
    </Box>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigation />}>
          <Route
            index
            element={
              <Suspense fallback={<PageLoader />}>
                <MenuPage />
              </Suspense>
            }
          />
          <Route
            path="checkout"
            element={
              <Suspense fallback={<PageLoader />}>
                <CheckoutPage />
              </Suspense>
            }
          />
          <Route
            path="history"
            element={
              <Suspense fallback={<PageLoader />}>
                <HistoryPage />
              </Suspense>
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
