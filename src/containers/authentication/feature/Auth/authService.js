import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import Cookies from 'universal-cookie'
const cookies = new Cookies()

const accessToken = cookies.get('access_token')
console.log('accessToken: ' + accessToken)

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.BASE_API_URL + '/auth',
    prepareHeaders: (headers) => {
      headers.set('Access-Control-Allow-Origin', '*'), headers.set('Content-type', 'application/json')
      headers.set('Authorization', 'Bearer ' + cookies.get('access_token'))
      return headers
    }
  }),
  endpoints: (build) => ({
    login: build.mutation({
      query: (body) => {
        return {
          url: '/login',
          method: 'POST',
          body: body,
          responseHandler: async (response) => {
            const responseBody = await response.json()
            cookies.set('access_token', responseBody.accessToken, { secure: true, sameSite: 'Lax' })
            return responseBody
          }
        }
      }
    }),
    getProfile: build.query({
      query: (token) => ({
        url: '/profile',
        headers: {
          Authorization: 'Bearer ' + token
        }
      })
    })
  })
})

export const { useLoginMutation, useLazyGetProfileQuery } = authApi
