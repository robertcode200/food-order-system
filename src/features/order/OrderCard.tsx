import { memo } from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import type { Order } from '../../types'
import { formatDate } from '../../utils/formatDate'
import { formatPrice } from '../../utils/formatPrice'

type Props = {
  order: Order
}

const OrderCard = memo(function OrderCard({ order }: Props) {
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          {formatDate(order.submittedAt)}
        </Typography>
        {order.items.map((item) => (
          <Typography key={item.foodItemId} variant="body2">
            {item.name} × {item.quantity}
          </Typography>
        ))}
        <Divider sx={{ my: 1 }} />
        <Typography variant="subtitle1" fontWeight={600}>
          合計：{formatPrice(order.total)}
        </Typography>
      </CardContent>
    </Card>
  )
})

export default OrderCard
