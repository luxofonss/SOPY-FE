import { createApi } from '@reduxjs/toolkit/query/react'
import { REFRESH_TOKEN_EXPIRATION } from '@src/configs'
import customFetchBase from '@src/configs/customFetchBase'
import Cookies from 'universal-cookie'
const cookies = new Cookies()

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: customFetchBase,
  endpoints: (build) => ({
    login: build.mutation({
      query: (body) => {
        return {
          url: '/shop/login',
          method: 'POST',
          body: body,
          responseHandler: async (response) => {
            const responseBody = await response.json()
            cookies.set('access_token', responseBody.metadata?.tokens?.accessToken, {
              maxAge: REFRESH_TOKEN_EXPIRATION
            })
            cookies.set('user_id', responseBody.metadata?.shop?._id, {
              maxAge: REFRESH_TOKEN_EXPIRATION
            })
            return responseBody
          }
        }
      }
    }),
    signup: build.mutation({
      query: (body) => {
        return {
          url: '/shop/signup',
          method: 'POST',
          body: body,
          responseHandler: async (response) => {
            const responseBody = await response.json()
            cookies.set('access_token', responseBody.metadata?.tokens?.accessToken, {
              maxAge: REFRESH_TOKEN_EXPIRATION
            })
            cookies.set('user_id', responseBody.metadata?.shop?._id, {
              maxAge: REFRESH_TOKEN_EXPIRATION
            })
            return responseBody
          }
        }
      }
    }),
    getProfile: build.query({
      query: () => ({
        url: '/shop/profile',
        headers: {
          Authorization: 'Bearer ' + cookies.get('access_token')
        }
      })
    }),
    logout: build.mutation({
      query: () => {
        return {
          url: '/shop/logout',
          method: 'POST'
        }
      }
    }),

    refreshToken: build.mutation({
      query: () => {
        return {
          url: '/shop/refresh-token',
          method: 'POST',
          responseHandler: async (response) => {
            const responseBody = await response.json()
            cookies.set('access_token', responseBody.metadata?.tokens?.accessToken)
            cookies.set('user_id', responseBody.metadata?.shop?._id)
            return responseBody
          }
        }
      }
    })
  })
})

export const {
  useRefreshTokenMutation,
  useLoginMutation,
  useSignupMutation,
  useLogoutMutation,
  useLazyGetProfileQuery
} = authApi
