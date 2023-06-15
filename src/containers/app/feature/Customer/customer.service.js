import { createApi } from '@reduxjs/toolkit/query/react'
import customFetchBase from '@src/configs/customFetchBase'

const customerApi = createApi({
  reducerPath: 'customerApi',
  baseQuery: customFetchBase,
  endpoints: (build) => ({
    getAllCategories: build.query({
      query: () => '/category/'
    }),
    getAllProducts: build.query({
      query: () => ({
        url: '/product'
      })
    }),
    getProductById: build.query({
      query: (id) => ({
        url: '/product/' + id
      })
    })
  })
})

export default customerApi
