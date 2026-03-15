import { http, HttpResponse } from 'msw'
import type { Category, FoodItem } from '../types'

const mockCategories: Category[] = [
  { id: '651d473a-ea0e-4337-b1a2-f66caa59977f', name: '麵類' },
  { id: 'e3d77f0b-c87e-4749-9ed5-529fada89a1b', name: '飯類' },
]

const mockFoods: FoodItem[] = [
  {
    id: 'food-uuid-1',
    name: '麻辣牛肉麵',
    price: 247,
    categoryId: '651d473a-ea0e-4337-b1a2-f66caa59977f',
    imageUrl: 'https://placehold.co/300x200',
  },
  {
    id: 'food-uuid-2',
    name: '肉絲蛋炒飯',
    price: 135,
    categoryId: 'e3d77f0b-c87e-4749-9ed5-529fada89a1b',
    imageUrl: 'https://placehold.co/300x200',
  },
]

export const handlers = [
  http.get('http://localhost:3001/categories', () => HttpResponse.json(mockCategories)),
  http.get('http://localhost:3001/foods', () => HttpResponse.json(mockFoods)),
  // Phase 6+ adds order handlers
]
