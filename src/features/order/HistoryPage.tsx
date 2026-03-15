import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import { useGetOrdersQuery, useClearOrdersMutation } from './orderApi'
import OrderCard from './OrderCard'

export default function HistoryPage() {
  const { data: orders = [], isLoading, isError } = useGetOrdersQuery()
  const [clearOrders, { isError: isClearError }] = useClearOrdersMutation()

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    )
  }

  if (isError) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <Typography color="error">無法載入訂單記錄，請稍後再試。</Typography>
      </Box>
    )
  }

  if (orders.length === 0) {
    return (
      <Container component="main" maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h5" gutterBottom>
          歷史訂單
        </Typography>
        <Typography color="text.secondary">尚無訂單記錄</Typography>
      </Container>
    )
  }

  return (
    <Container component="main" maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">歷史訂單</Typography>
        <Button variant="outlined" color="error" onClick={() => clearOrders()}>
          清除歷史
        </Button>
      </Box>
      {isClearError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          清除歷史失敗，請再試一次。
        </Alert>
      )}
      {[...orders].reverse().map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}
    </Container>
  )
}
