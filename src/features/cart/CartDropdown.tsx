import Popover from '@mui/material/Popover'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { setIsCartOpen } from './cartSlice'
import { selectCartItems, selectIsCartOpen, selectCartTotal } from './cartSelectors'
import { formatPrice } from '../../utils/formatPrice'
import CartLineItem from './CartLineItem'

type Props = {
  anchorEl: HTMLButtonElement | null
}

export default function CartDropdown({ anchorEl }: Props) {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const isCartOpen = useAppSelector(selectIsCartOpen)
  const items = useAppSelector(selectCartItems)
  const total = useAppSelector(selectCartTotal)

  const handleClose = () => {
    dispatch(setIsCartOpen(false))
  }

  const handleCheckout = () => {
    dispatch(setIsCartOpen(false))
    navigate('/checkout')
  }

  return (
    <Popover
      open={isCartOpen && anchorEl !== null}
      anchorEl={anchorEl}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <Box sx={{ p: 2, minWidth: 300, maxWidth: 400 }}>
        {items.length === 0 ? (
          <Typography color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
            購物車是空的
          </Typography>
        ) : (
          <>
            {items.map((item) => (
              <CartLineItem key={item.id} cartItem={item} />
            ))}
            <Divider sx={{ my: 1 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="subtitle1" fontWeight={600}>
                合計
              </Typography>
              <Typography variant="subtitle1" fontWeight={600}>
                {formatPrice(total)}
              </Typography>
            </Box>
          </>
        )}
        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 2 }}
          disabled={items.length === 0}
          onClick={handleCheckout}
        >
          前往結帳
        </Button>
      </Box>
    </Popover>
  )
}
