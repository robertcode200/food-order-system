import { useState } from 'react'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Grid from '@mui/material/Grid'
import Container from '@mui/material/Container'
import Stack from '@mui/material/Stack'
import { useGetMenuQuery } from './menuApi'
import FoodItemCard from './FoodItemCard'

export default function MenuPage() {
  const { data, isLoading, isError } = useGetMenuQuery()
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    )
  }

  if (isError || !data) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <Typography color="error">無法載入菜單，請稍後再試。</Typography>
      </Box>
    )
  }

  const { categories, foods } = data
  const filteredFoods =
    selectedCategoryId === null ? foods : foods.filter((f) => f.categoryId === selectedCategoryId)

  const handleChipClick = (categoryId: string | null) => {
    setSelectedCategoryId((prev) => (prev === categoryId ? null : categoryId))
  }

  return (
    <Container component="main" maxWidth="lg" sx={{ py: 4 }}>
      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 3 }}>
        <Chip
          label="全部"
          onClick={() => setSelectedCategoryId(null)}
          color={selectedCategoryId === null ? 'primary' : 'default'}
          variant={selectedCategoryId === null ? 'filled' : 'outlined'}
        />
        {categories.map((category) => (
          <Chip
            key={category.id}
            label={category.name}
            onClick={() => handleChipClick(category.id)}
            color={selectedCategoryId === category.id ? 'primary' : 'default'}
            variant={selectedCategoryId === category.id ? 'filled' : 'outlined'}
          />
        ))}
      </Stack>

      <Grid container spacing={3}>
        {filteredFoods.map((food) => (
          <Grid key={food.id} size={{ xs: 12, sm: 6, md: 4 }}>
            <FoodItemCard foodItem={food} />
          </Grid>
        ))}
      </Grid>
    </Container>
  )
}
