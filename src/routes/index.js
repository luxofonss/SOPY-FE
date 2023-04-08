/* eslint-disable react-hooks/exhaustive-deps */
import { AppRouteList } from '@src/containers/app/AppRoutes'
import { AuthRouteList } from '@src/containers/authentication/AuthRoutes'
import { memo, useEffect } from 'react'
import { useLocation, useNavigate, useRoutes } from 'react-router-dom'
import jwt_decode from 'jwt-decode'
import Cookies from 'universal-cookie'
import { authApi, useLazyGetProfileQuery } from '@src/containers/authentication/feature/Auth/authService'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { login, setUser } from '@src/containers/authentication/feature/Auth/authSlice'

const cookies = new Cookies()

export const AppRoutes = () => {
  const [getProfile] = useLazyGetProfileQuery()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const [loginSuccess] = authApi.endpoints.oAuthLogin.useLazyQuery()

  useEffect(() => {
    console.log('accessToken', accessToken)
    const accessToken = cookies.get('access_token')
    if (!accessToken) {
      const loginRequest = async () => {
        console.log('login request running')
        const response = await loginSuccess()
        if (response.isSuccess) {
          dispatch(setUser(response.data.metadata.user))
          dispatch(login())
        } else if (response) {
          console.log('error response: ', response.error.data.message.strategy)
          if (location.pathname !== '/signup') navigate('/login')
          toast.warn(response.error.data.message.error)
        }
      }
      loginRequest()
    }
  }, [])

  useEffect(() => {
    const accessToken = cookies.get('access_token')
    if (accessToken) {
      const decodeToken = jwt_decode(accessToken)
      const now = new Date().getTime()
      if (decodeToken.exp * 1000 < now) {
        getProfile()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const routes = [...AppRouteList, ...AuthRouteList]
  console.log('all routes rerender: ', [...routes])
  return useRoutes([...routes])
}

export const WebRoutes = memo(AppRoutes)
