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
      // reducers: {
      //   // The `cache` reducer is built-in to Redux Toolkit Query and handles caching behavior
      //   cache: false
      // },
      // invalidates: ['getCart'] // Invalidate the cache for this query whenever it's run again
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
    }),
    shopRegister: build.mutation({
      query: (body) => ({
        url: '/user/register',
        method: 'POST',
        body: body
      })
    }),
    buyProducts: build.mutation({
      query: (body) => ({
        url: '/order/add',
        method: 'POST',
        body: body
      })
    }),
    getUserOrders: build.query({
      query: (args) => ({
        url: '/order/me',
        params: args
      })
    }),
    cancelOrder: build.mutation({
      query: (body) => ({
        url: '/order/cancel',
        method: 'PUT',
        body: body
      })
    }),
    updateAvatar: build.mutation({
      query: (body) => ({
        url: 'user/update/avatar',
        method: 'POST',
        body: body,
        prepareHeaders: (headers) => {
          headers.set('Content-Type', 'multipart/form-data')
          return headers
        }
      })
    }),
    getProductByCategoryId: build.query({
      query: ({ id }) => ({
        url: `product/category/${id}`
      })
    }),
    filterProduct: build.query({
      query: (params) => ({
        url: 'product/search',
        params: params
      })
    })
  })
})

export default customerApi
