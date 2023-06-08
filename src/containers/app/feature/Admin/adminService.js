import { createApi } from '@reduxjs/toolkit/query/react'
import customFetchBase from '@src/configs/customFetchBase'

export const adminApi = createApi({
  reducerPath: 'adminApi',
  baseQuery: customFetchBase,
  endpoints: (build) => ({
    addProduct: build.mutation({
      query: (body) => ({
        url: '/product',
        method: 'POST',
        body: body,
        prepareHeaders: (headers) => {
          headers.set('Content-Type', 'multipart/form-data')
          return headers
        }
      }),
      transformResponse: (response) => response.data,
      transformErrorResponse: (response) => response.status
    }),
    getAllCategory: build.query({
      query: () => ({
        url: '/category/'
      })
    }),
    getProductAttributes: build.query({
      query: (args) => ({
        url: '/product/attributes',
        params: args
      })
    })
  })
})

export const { useGetAllCategoryQuery, useLazyGetProductAttributesQuery, useAddProductMutation } = adminApi
