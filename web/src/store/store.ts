import { configureStore } from '@reduxjs/toolkit'
import summarizerReducer from './summarizerSlice'

export const makeStore =  configureStore({
    reducer: {
      summarizer : summarizerReducer,
    }
})

// Infer the type of makeStore
export type AppStore = typeof makeStore;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof makeStore.getState>
export type AppDispatch = typeof makeStore.dispatch;