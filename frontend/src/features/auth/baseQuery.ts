import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn } from '@reduxjs/toolkit/query';
import type { RootState } from '../../app/store';
import { logout, setCredentials } from './authSlice';

const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:3000',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken;
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

export const baseQueryWithReauth: BaseQueryFn<any, unknown, unknown> = async (
  args,
  api,
  extraOptions
) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    const refreshToken = (api.getState() as RootState).auth.refreshToken;
    if (!refreshToken) {
      api.dispatch(logout());
      return result;
    }

    const refreshResult = await baseQuery(
      {
        url: '/auth/refresh',
        method: 'POST',
        body: { refreshToken },
      },
      api,
      extraOptions
    );

    if (refreshResult.data) {
      api.dispatch(setCredentials(refreshResult.data));
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logout());
    }
  }

  return result;
};
