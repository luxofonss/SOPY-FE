import { createApi } from '@reduxjs/toolkit/query/react'
import customFetchBase from '@src/configs/customFetchBase'

const appApi = createApi({
  reducerPath: 'appApi',
  baseQuery: customFetchBase,
  endpoints: (build) => ({
    getShopById: build.query({
      query: (id) => `/shop/${id}`
    })
  })
})

export default appApi
