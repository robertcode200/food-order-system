import { api } from '../../app/api'
import type { Order, OrderItem } from '../../types'

type CreateOrderRequest = {
  items: OrderItem[]
}

export const orderApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation<Order, CreateOrderRequest>({
      query: (body) => ({
        url: '/orders',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Orders'],
    }),
  }),
})

export const { useCreateOrderMutation } = orderApi
