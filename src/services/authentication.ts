/**
 * Package import
 */
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

/**
 * Local import
 */

/**
 * Code
 */
export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
  }),
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (body) => ({
        url: '/login',
        method: 'POST',
        body,
      }),
    }),
    register: builder.mutation({
      query: (body) => ({
        url: '/signup',
        method: 'POST',
        body,
      }),
    }),
    resetPassword: builder.mutation({
      query: (body) => ({
        url: '/login/password/reset',
        method: 'POST',
        body,
      }),
    }),
    checkReset: builder.mutation({
      query: (body) => ({
        url: '/login/password/check',
        method: 'POST',
        body,
      }),
    }),
    changePassword: builder.mutation({
      query: (body) => ({
        url: '/login/password/change',
        method: 'POST',
        body,
      }),
    }),
  }),
})

export const { useLoginMutation, useRegisterMutation, useResetPasswordMutation, useCheckResetMutation, useChangePasswordMutation } = authApi
