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
export const whitelistApi = createApi({
  reducerPath: 'whitelistApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    prepareHeaders: (headers, { getState }: {getState: any}) => {
      const token = getState().auth.token
      if (token) {
        headers.set('authorization', `Bearer ${token}`)
      }
      return headers
    },
  }),
  endpoints: (builder) => ({
    getDiscordData: builder.query({
      query: () => '/whitelist/current',
    }),
    startSession: builder.query({
      query: (nb: string) => `/discord/session/${nb}`,
    }),
    stopSessions: builder.query({
      query: () => '/discord/stop',
    }),
    syncAllMembers: builder.query({
      query: () => '/whitelist/sync',
    }),
    setWhitelist: builder.mutation({
      query: ({ body, id }: { body: { notation: number, comment: string }, id: number }) => ({
        url: `/whitelist/${id}`,
        method: 'POST',
        body,
      }),
    }),
    getStatus: builder.query({
      query: () => '/discord/status',
    }),
  }),
})

export const { useGetDiscordDataQuery, useLazyStartSessionQuery, useLazyStopSessionsQuery, useLazySyncAllMembersQuery, useSetWhitelistMutation, useGetStatusQuery } = whitelistApi
