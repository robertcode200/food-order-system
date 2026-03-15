import { http, HttpResponse } from 'msw'
import type { Category, FoodItem, Order, OrderItem } from '../types'
import { API_BASE_URL } from '../utils/constants'

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

const mockOrders: Order[] = [
  {
    id: 'order-uuid-1',
    items: [
      { foodItemId: 'food-uuid-1', name: '麻辣牛肉麵', price: 247, imageUrl: '', quantity: 2 },
    ],
    total: 494,
    submittedAt: '2026-03-14T10:00:00.000Z',
  },
]

export const handlers = [
  http.get(`${API_BASE_URL}/categories`, () => HttpResponse.json(mockCategories)),
  http.get(`${API_BASE_URL}/foods`, () => HttpResponse.json(mockFoods)),
  http.get(`${API_BASE_URL}/orders`, () => HttpResponse.json(mockOrders)),

  http.post(`${API_BASE_URL}/orders`, async ({ request }) => {
    const body = (await request.json()) as { items: OrderItem[] }
    const mockOrder: Order = {
      id: 'order-uuid-1',
      items: body.items,
      total: body.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
      submittedAt: '2026-03-14T10:00:00.000Z',
    }
    return HttpResponse.json(mockOrder, { status: 201 })
  }),

  http.delete(`${API_BASE_URL}/orders`, () => new HttpResponse(null, { status: 204 })),
]
