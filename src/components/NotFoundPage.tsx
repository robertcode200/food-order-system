import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'

export default function NotFoundPage() {
  return (
    <Container component="main" maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
      <Typography variant="h3" gutterBottom>
        404
      </Typography>
      <Typography color="text.secondary">找不到頁面</Typography>
    </Container>
  )
}
