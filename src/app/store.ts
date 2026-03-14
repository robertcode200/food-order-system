import { configureStore } from '@reduxjs/toolkit'

// Phase 2 will add api.reducer and cartReducer here
const reducer = {}

export const store = configureStore({ reducer })

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

// Fresh store per test — prevents state leaking between tests
export const setupStore = (preloadedState?: Partial<RootState>) =>
  configureStore({ reducer, preloadedState })

export type AppStore = ReturnType<typeof setupStore>
