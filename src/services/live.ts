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
export const liveApi = createApi({
  reducerPath: 'liveApi',
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
    getServerStatus: builder.query({
      query: () => '/live/status',
    }),
    getCharacter: builder.query({
      query: (id: number) => `/live/characters/${id}`,
    }),
    updateCharacter: builder.mutation({
      query: (data) => ({
        url: `/live/characters/${data.characterId}`,
        method: 'POST',
        body: data.infos,
      }),
    }),
    cuffCharacter: builder.mutation({
      query: (id) => ({
        url: `/live/characters/${id}/cuff`,
        method: 'POST',
      }),
    }),
    reviveCharacter: builder.mutation({
      query: (id) => ({
        url: `/live/characters/${id}/revive`,
        method: 'POST',
      }),
    }),
    notifyCharacter: builder.mutation({
      query: (data) => ({
        url: `/live/characters/${data.characterId}/notification`,
        method: 'POST',
        body: {
          message: data.message,
        },
      }),
    }),
    kickCharacter: builder.mutation({
      query: (data) => ({
        url: `/live/characters/${data.characterId}/kick`,
        method: 'POST',
        body: {
          reason: data.reason,
        },
      }),
    }),
    banCharacter: builder.mutation({
      query: (id) => ({
        url: `/live/characters/${id}/ban`,
        method: 'POST',
      }),
    }),
    getLogs: builder.mutation({
      query: (id) => ({
        url: `/log/whitelist/${id}`,
        method: 'POST',
      }),
    }),
  }),
})

export const {
  useGetServerStatusQuery,
  useGetCharacterQuery,
  useUpdateCharacterMutation,
  useCuffCharacterMutation,
  useReviveCharacterMutation,
  useNotifyCharacterMutation,
  useKickCharacterMutation,
  useBanCharacterMutation,
  useGetLogsMutation,
} = liveApi
