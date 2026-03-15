import { useNavigate } from 'react-router-dom'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Alert from '@mui/material/Alert'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { selectCartItems, selectCartTotal } from '../cart/cartSelectors'
import { clearCart } from '../cart/cartSlice'
import { useCreateOrderMutation } from './orderApi'
import { formatPrice } from '../../utils/formatPrice'
import CartLineItem from '../cart/CartLineItem'
import type { OrderItem } from '../../types'

export default function CheckoutPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const items = useAppSelector(selectCartItems)
  const total = useAppSelector(selectCartTotal)
  const [createOrder, { isLoading, isError }] = useCreateOrderMutation()

  const handleSubmit = async () => {
    const orderItems: OrderItem[] = items.map(
      ({ foodItemId, name, price, imageUrl, quantity }) => ({
        foodItemId,
        name,
        price,
        imageUrl,
        quantity,
      }),
    )

    try {
      await createOrder({ items: orderItems }).unwrap()
      dispatch(clearCart())
      navigate('/history')
    } catch {
      // error state shown via isError from useCreateOrderMutation
    }
  }

  if (items.length === 0) {
    return (
      <Container component="main" maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h5" gutterBottom>
          結帳
        </Typography>
        <Typography color="text.secondary" sx={{ py: 2 }}>
          購物車是空的
        </Typography>
        <Button variant="contained" onClick={() => navigate('/')}>
          回到菜單
        </Button>
      </Container>
    )
  }

  return (
    <Container component="main" maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h5" gutterBottom>
        結帳
      </Typography>

      {items.map((item) => (
        <CartLineItem key={item.id} cartItem={item} />
      ))}

      <Divider sx={{ my: 2 }} />

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 2 }}>
        <Typography variant="h6">合計：{formatPrice(total)}</Typography>
        <Button variant="contained" size="large" disabled={isLoading} onClick={handleSubmit}>
          送出訂單
        </Button>
      </Box>

      {isError && (
        <Alert severity="error" sx={{ mt: 2 }}>
          訂單送出失敗，請再試一次。
        </Alert>
      )}
    </Container>
  )
}
