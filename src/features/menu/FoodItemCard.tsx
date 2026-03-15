import Card from '@mui/material/Card'
import CardMedia from '@mui/material/CardMedia'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { useAppDispatch } from '../../app/hooks'
import { addItem } from '../cart/cartSlice'
import { formatPrice } from '../../utils/formatPrice'
import type { FoodItem } from '../../types'

type Props = {
  foodItem: FoodItem
}

export default function FoodItemCard({ foodItem }: Props) {
  const dispatch = useAppDispatch()

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardMedia
        component="img"
        image={foodItem.imageUrl}
        alt={foodItem.name}
        sx={{ aspectRatio: '4/3', objectFit: 'cover' }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography
          variant="body1"
          component="h2"
          gutterBottom
          sx={{ fontWeight: 700, color: 'text.primary', lineHeight: 1.4 }}
        >
          {foodItem.name}
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.primary', fontWeight: 600 }}>
          {formatPrice(foodItem.price)}
        </Typography>
      </CardContent>
      <CardActions>
        <Button variant="contained" fullWidth onClick={() => dispatch(addItem(foodItem))}>
          加入購物車
        </Button>
      </CardActions>
    </Card>
  )
}
