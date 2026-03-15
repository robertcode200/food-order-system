import { useState } from 'react'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import { Outlet, Link as RouterLink } from 'react-router-dom'
import CartIcon from '../features/cart/CartIcon'
import CartDropdown from '../features/cart/CartDropdown'

export default function Navigation() {
  const [cartIconEl, setCartIconEl] = useState<HTMLButtonElement | null>(null)

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{ flexGrow: 1, color: 'inherit', textDecoration: 'none' }}
          >
            美食訂餐
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Button color="inherit" component={RouterLink} to="/">
              菜單
            </Button>
            <Button color="inherit" component={RouterLink} to="/history">
              歷史訂單
            </Button>
            <CartIcon ref={setCartIconEl} />
          </Box>
        </Toolbar>
      </AppBar>
      <CartDropdown anchorEl={cartIconEl} />
      <Outlet />
    </>
  )
}
