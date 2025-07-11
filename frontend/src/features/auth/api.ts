import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './baseQuery';

export type UserData = {
  id: string;
  email: string;
  fullName: string;
  role: string;
  createdAt: Date;
}
export type UserShortData = {
  userId: string;
  email: string;
};
export type RegistrationData = {
  user: UserData;
  accessToken: string;
};

export type LoginData = {
  user: UserData;
  accessToken: string;
  refreshToken: string;
};
type RefreshTokenData = LoginData;

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    register: builder.mutation<RegistrationData, { email: string; fullName: string; password: string }>({
      query: (body) => ({
        url: '/auth/register',
        method: 'POST',
        body,
      }),
    }),
    login: builder.mutation<LoginData, { email: string; password: string }>({
      query: (body) => ({
        url: '/auth/login',
        method: 'POST',
        body,
      }),
    }),
    refresh: builder.mutation<RefreshTokenData, { refreshToken: string }>({
      query: (body) => ({
        url: '/auth/refresh',
        method: 'POST',
        body,
      }),
    }),
    getMe: builder.query<UserShortData, void>({
      query: () => '/auth/me',
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useRefreshMutation,
  useGetMeQuery,
} = authApi;
