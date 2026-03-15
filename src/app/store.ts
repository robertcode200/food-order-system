import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { api } from './api'
import cartReducer from '../features/cart/cartSlice'

const rootReducer = combineReducers({
  [api.reducerPath]: api.reducer,
  cart: cartReducer,
})

export type RootState = ReturnType<typeof rootReducer>

export const setupStore = (preloadedState?: Partial<RootState>) =>
  configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(api.middleware),
    preloadedState,
  })

export const store = setupStore()

export type AppStore = ReturnType<typeof setupStore>
export type AppDispatch = typeof store.dispatch
