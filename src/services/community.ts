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
export const communityApi = createApi({
  reducerPath: 'communityApi',
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
    getCommunity: builder.query({
      query: () => '/community',
    }),
    getLastMembers: builder.query({
      query: () => '/community/last',
    }),
    getMember: builder.query({
      query: (id: string) => `/community/find/${id}`,
    }),
    deleteMember: builder.query({
      query: (id: number) => `/community/delete/${id}`,
    }),
  }),
})

interface MemberComment {
  author: string;
  comment: string;
  createdAt: number;
  notation: number;
}

export interface Member {
  lastComment: MemberComment;
  allComments: MemberComment[];
  dateRegister: string;
  id: number;
  socialclub: string
  status?: string
  discordName?: string
}

export const { useGetCommunityQuery, useGetLastMembersQuery, useLazyGetMemberQuery, useLazyDeleteMemberQuery } = communityApi
