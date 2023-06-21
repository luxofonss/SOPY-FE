import { createApi } from '@reduxjs/toolkit/query/react'
import customFetchBase from '@src/configs/customFetchBase'

export const adminApi = createApi({
  reducerPath: 'adminApi',
  baseQuery: customFetchBase,
  endpoints: (build) => ({
    //product
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

    getAllProduct: build.query({
      query: (args) => {
        return {
          url: `/product/shop/all?page=${args.page}`,
          params: { filter: JSON.stringify(args.filter) }
        }
      }
    }),
    getProductAttributes: build.query({
      query: (args) => ({
        url: '/product/attributes',
        params: args
      })
    }),
    getProductById: build.query({
      query: (id) => ({
        url: `/product/${id}`
      })
    }),

    //category
    getAllCategory: build.query({
      query: () => ({
        url: '/category/'
      })
    }),
    getCategoryBySubId: build.query({
      query: (id) => ({
        url: `/category/sub/${id}`
      })
    }),
    getAndFilterOrder: build.query({
      query: (params) => ({
        url: '/order',
        params: params
      })
    }),
    getOneOrderByShop: build.query({
      query: (id) => ({
        url: `/order/${id}`
      })
    }),
    confirmOrders: build.mutation({
      query: (body) => ({
        url: '/order/confirm',
        method: 'PUT',
        body: body
      })
    }),
    rejectOrder: build.mutation({
      query: (body) => ({
        url: '/order/reject',
        method: 'PUT',
        body: body
      })
    }),
    shippingOrders: build.mutation({
      query: (body) => ({
        url: '/order/shipping',
        method: 'PUT',
        body: body
      })
    })
  })
})

export const {
  useGetAllCategoryQuery,
  useLazyGetProductAttributesQuery,
  useAddProductMutation,
  useGetAllProductQuery,
  useGetProductByIdQuery,
  useLazyGetCategoryBySubIdQuery
} = adminApi
