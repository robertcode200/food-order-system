import { memo } from 'react'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import CloseIcon from '@mui/icons-material/Close'
import { useAppDispatch } from '../../app/hooks'
import { incrementItem, removeItem, clearItem } from './cartSlice'
import { formatPrice } from '../../utils/formatPrice'
import type { CartItem } from '../../types'

type Props = {
  cartItem: CartItem
}

const CartLineItem = memo(function CartLineItem({ cartItem }: Props) {
  const dispatch = useAppDispatch()

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 1 }}>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="body2" noWrap>
          {cartItem.name}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {formatPrice(cartItem.price)}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <IconButton
          size="small"
          onClick={() => dispatch(removeItem(cartItem.id))}
          aria-label={`decrease quantity of ${cartItem.name}`}
        >
          <RemoveIcon fontSize="small" />
        </IconButton>

        <Typography variant="body2" sx={{ minWidth: 20, textAlign: 'center' }}>
          {cartItem.quantity}
        </Typography>

        <IconButton
          size="small"
          onClick={() => dispatch(incrementItem(cartItem.id))}
          aria-label={`increase quantity of ${cartItem.name}`}
        >
          <AddIcon fontSize="small" />
        </IconButton>
      </Box>

      <Typography variant="body2" sx={{ minWidth: 60, textAlign: 'right' }}>
        {formatPrice(cartItem.price * cartItem.quantity)}
      </Typography>

      <IconButton
        size="small"
        onClick={() => dispatch(clearItem(cartItem.id))}
        aria-label={`remove ${cartItem.name} from cart`}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </Box>
  )
})

export default CartLineItem
