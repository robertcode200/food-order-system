import { combineReducers, configureStore } from '@reduxjs/toolkit'
import cartReducer from '../features/cart/cartSlice'

const rootReducer = combineReducers({
  cart: cartReducer,
})

export type RootState = ReturnType<typeof rootReducer>

export const setupStore = (preloadedState?: Partial<RootState>) =>
  configureStore({
    reducer: rootReducer,
    preloadedState,
  })

export const store = setupStore()

export type AppStore = ReturnType<typeof setupStore>
export type AppDispatch = typeof store.dispatch
