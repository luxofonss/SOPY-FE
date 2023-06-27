import { createApi } from '@reduxjs/toolkit/query/react'
import { REFRESH_TOKEN_EXPIRATION, RESPONSE_ERROR_STATUS } from '@src/configs'
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
          url: '/auth/login',
          method: 'POST',
          body: body,
          responseHandler: async (response) => {
            const responseBody = await response.json()
            if (responseBody.status !== RESPONSE_ERROR_STATUS) {
              console.log('responseBody', responseBody)
              cookies.set('access_token', responseBody?.metadata?.tokens?.accessToken, {
                maxAge: REFRESH_TOKEN_EXPIRATION
              })
              cookies.set('user_id', responseBody?.metadata?.user?._id, {
                maxAge: REFRESH_TOKEN_EXPIRATION
              })
            }
            return responseBody
          }
        }
      },
      keepUnusedDataFor: 0
    }),
    signup: build.mutation({
      query: (body) => {
        return {
          url: '/auth/signup',
          method: 'POST',
          body: body,
          responseHandler: async (response) => {
            const responseBody = await response.json()
            if (responseBody.status !== RESPONSE_ERROR_STATUS) {
              console.log('responseBody: ', responseBody)
              cookies.set('access_token', responseBody?.metadata?.tokens?.accessToken, {
                maxAge: REFRESH_TOKEN_EXPIRATION
              })
              cookies.set('user_id', responseBody?.metadata?.user?._id, {
                maxAge: REFRESH_TOKEN_EXPIRATION
              })
            }

            return responseBody
          }
        }
      }
    }),
    getProfile: build.query({
      query: () => ({
        url: '/auth/profile',
        headers: {
          Authorization: 'Bearer ' + cookies.get('access_token')
        }
      })
    }),
    oAuthLogin: build.query({
      query: () => ({
        url: '/oauth/success',
        credentials: 'include',
        responseHandler: async (response) => {
          const responseBody = await response.json()
          console.log('responseBody', responseBody)
          if (response.ok) {
            cookies.set('access_token', responseBody?.metadata?.tokens?.accessToken, {
              maxAge: REFRESH_TOKEN_EXPIRATION
            })
            cookies.set('user_id', responseBody?.metadata?.user?._id, {
              maxAge: REFRESH_TOKEN_EXPIRATION
            })
          }
          return responseBody
        }
      })
    }),
    logout: build.mutation({
      query: () => {
        return {
          url: '/auth/logout',
          method: 'POST',
          responseHandler: async (response) => {
            const responseBody = await response.json()
            if (responseBody.code !== 403) {
              // clear cookies
              cookies.remove('access_token')
              cookies.remove('user_id')
            }
            return responseBody
          }
        }
      }
    }),

    refreshToken: build.query({
      query: () => {
        return {
          url: '/auth/refresh-token',
          responseHandler: async (response) => {
            const responseBody = await response.json()
            if (responseBody.errorStatus !== RESPONSE_ERROR_STATUS) {
              cookies.set('user_id', responseBody?.metadata?.user?._id)
              cookies.set('access_token', responseBody?.metadata?.accessToken)
            }
            return responseBody
          }
        }
      }
    })
  })
})

export const { useLoginMutation, useSignupMutation, useLogoutMutation, useLazyGetProfileQuery } = authApi
