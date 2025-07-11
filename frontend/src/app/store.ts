import { configureStore } from '@reduxjs/toolkit';
import { authApi } from '../features/auth/api.ts';
import authReducer from '../features/auth/authSlice.ts';

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
