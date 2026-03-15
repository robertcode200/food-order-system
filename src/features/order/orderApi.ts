import { api } from '../../app/api'
import type { Order, OrderItem } from '../../types'

type CreateOrderRequest = {
  items: OrderItem[]
}

export const orderApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getOrders: builder.query<Order[], void>({
      query: () => '/orders',
      providesTags: ['Orders'],
    }),
    createOrder: builder.mutation<Order, CreateOrderRequest>({
      query: (body) => ({
        url: '/orders',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Orders'],
    }),
    clearOrders: builder.mutation<void, void>({
      query: () => ({
        url: '/orders',
        method: 'DELETE',
      }),
      invalidatesTags: ['Orders'],
    }),
  }),
})

export const { useGetOrdersQuery, useCreateOrderMutation, useClearOrdersMutation } = orderApi
