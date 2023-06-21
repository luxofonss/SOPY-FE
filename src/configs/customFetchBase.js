import { fetchBaseQuery } from '@reduxjs/toolkit/query'
import { history } from '@src/utils/history'
import { Mutex } from 'async-mutex'
import Cookies from 'universal-cookie'
import { HEADER, REFRESH_TOKEN_EXPIRATION } from '.'
import store from '@src/redux/store'
import { logout, setUser } from '@src/containers/authentication/feature/Auth/authSlice'

const cookies = new Cookies()
const baseUrl = process.env.BASE_API_URL

// Create a new mutex
const mutex = new Mutex()

const baseQuery = fetchBaseQuery({
  baseUrl,
  credentials: 'include',
  prepareHeaders: (headers) => {
    headers.set('Access-Control-Allow-Origin', '*')
    headers.set(HEADER.AUTHORIZATION, 'Bearer ' + cookies.get('access_token'))
    headers.set(HEADER.CLIENT_ID, cookies.get('user_id'))
    return headers
  }
})

const customFetchBase = async (args, api, extraOptions) => {
  // wait until the mutex is available without locking it
  await mutex.waitForUnlock()
  let result = await baseQuery(args, api, extraOptions)
  if (result.error?.status === 401) {
    if (!mutex.isLocked()) {
      const release = await mutex.acquire()

      try {
        const refreshResult = await baseQuery({ url: '/auth/refresh-token', method: 'GET' }, api, extraOptions)
        if (refreshResult?.data?.status === 200) {
          // Retry the initial query
          // set cookies
          cookies.set('access_token', refreshResult.data?.metadata?.accessToken, {
            maxAge: REFRESH_TOKEN_EXPIRATION
          }),
            cookies.set('user_id', refreshResult.data?.metadata?.user._id, {
              maxAge: REFRESH_TOKEN_EXPIRATION
            })
          result = await baseQuery(args, api, extraOptions)
        } else {
          // api.dispatch(logout())
          // window.location.href = '/login'
          // clear cookies
          cookies.remove('access_token')
          cookies.remove('user_id')
          store.dispatch(setUser({}))
          store.dispatch(logout())
          history.push('/login')
        }
      } finally {
        // release must be called once the mutex should be released again.
        release()
      }
    } else {
      // wait until the mutex is available without locking it
      await mutex.waitForUnlock()
      result = await baseQuery(args, api, extraOptions)
    }
  }

  return result
}

export default customFetchBase
