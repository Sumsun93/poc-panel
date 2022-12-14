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
export const profilApi = createApi({
  reducerPath: 'profilApi',
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
    getProfil: builder.query({
      query: () => '/profil',
    }),
    getRights: builder.query({
      query: () => '/profil/rights',
    }),
    getCharacters: builder.query({
      query: () => '/profil/characters',
    }),
    askWhitelist: builder.query({
      query: () => '/profil/whitelist/ask',
    }),
    removeWhitelist: builder.query({
      query: () => '/profil/whitelist/remove',
    }),
  }),
})

export const { useGetProfilQuery, useLazyGetProfilQuery, useGetRightsQuery, useGetCharactersQuery, useLazyAskWhitelistQuery, useLazyRemoveWhitelistQuery } = profilApi
