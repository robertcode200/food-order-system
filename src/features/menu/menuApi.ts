import { api } from '../../app/api'
import type { Category, FoodItem } from '../../types'

export const menuApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getMenu: builder.query<{ categories: Category[]; foods: FoodItem[] }, void>({
      async queryFn(_arg, _queryApi, _extraOptions, fetchWithBQ) {
        const categoriesResult = await fetchWithBQ('/categories')
        if (categoriesResult.error) return { error: categoriesResult.error }

        const foodsResult = await fetchWithBQ('/foods')
        if (foodsResult.error) return { error: foodsResult.error }

        return {
          data: {
            categories: categoriesResult.data as Category[],
            foods: foodsResult.data as FoodItem[],
          },
        }
      },
      providesTags: ['Categories', 'Foods'],
    }),
  }),
})

export const { useGetMenuQuery } = menuApi
