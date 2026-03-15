import React from 'react'
import IconButton from '@mui/material/IconButton'
import Badge from '@mui/material/Badge'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { toggleCart } from './cartSlice'
import { selectCartCount } from './cartSelectors'

const CartIcon = React.forwardRef<HTMLButtonElement>(function CartIcon(_, ref) {
  const dispatch = useAppDispatch()
  const count = useAppSelector(selectCartCount)

  return (
    <IconButton ref={ref} onClick={() => dispatch(toggleCart())} color="inherit" aria-label="cart">
      <Badge badgeContent={count} color="error">
        <ShoppingCartIcon />
      </Badge>
    </IconButton>
  )
})

export default CartIcon
