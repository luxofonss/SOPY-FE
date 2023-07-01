import { createApi } from '@reduxjs/toolkit/query/react'
import customFetchBase from '@src/configs/customFetchBase'

const chatApi = createApi({
  reducerPath: 'chatApi',
  baseQuery: customFetchBase,
  endpoints: (build) => ({
    getUserConversations: build.query({
      query: () => '/conversation'
    }),
    getMessagesInConversation: build.query({
      query: (args) => ({ url: '/message', params: args })
    }),
    sendMessage: build.mutation({
      query: (body) => ({
        url: '/message',
        method: 'POST',
        body: body
      })
    }),
    getNewConversation: build.mutation({
      query: (body) => ({
        url: '/conversation/new',
        method: 'POST',
        body: body
      })
    })
  })
})

export default chatApi
