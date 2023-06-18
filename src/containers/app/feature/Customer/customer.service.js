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
    }),
    getCart: build.query({
      query: () => ({
        url: '/cart'
      })
    }),
    addToCart: build.mutation({
      query: (body) => ({
        url: '/cart',
        method: 'POST',
        body: body
      })
    }),
    setAllCheck: build.mutation({
      query: (body) => ({
        url: '/cart',
        method: 'PUT',
        body: body
      })
    }),
    setShopCheck: build.mutation({
      query: (body) => ({
        url: '/cart/shop',
        method: 'PUT',
        body: body
      })
    }),
    setProductCheck: build.mutation({
      query: (body) => ({
        url: '/cart/product',
        method: 'PUT',
        body: body
      })
    }),
    deleteItem: build.mutation({
      query: (body) => ({
        url: '/cart/delete',
        method: 'PUT',
        body: body
      })
    })
  })
})

export default customerApi
