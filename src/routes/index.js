/* eslint-disable react-hooks/exhaustive-deps */
import { AppRouteList } from '@src/containers/app/AppRoutes'
import { AuthRouteList } from '@src/containers/authentication/AuthRoutes'
import { authApi } from '@src/containers/authentication/feature/Auth/authService'
import { login, setUser } from '@src/containers/authentication/feature/Auth/authSlice'
import { SocketContext, disConnectSocket } from '@src/context/socket.context'
import { isEmptyValue } from '@src/helpers/check'
import jwt_decode from 'jwt-decode'
import { memo, useContext, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate, useRoutes } from 'react-router-dom'
import { toast } from 'react-toastify'
import Cookies from 'universal-cookie'

const cookies = new Cookies()

export const AppRoutes = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const userInfo = useSelector((state) => state.auth.user)

  const socket = useContext(SocketContext)

  const [loginSuccess] = authApi.endpoints.oAuthLogin.useLazyQuery()
  const [getProfile] = authApi.endpoints.getProfile.useLazyQuery()

  useEffect(() => {
    const accessToken = cookies.get('access_token')
    console.log('accessToken', accessToken)
    if (isEmptyValue(accessToken)) {
      const loginRequest = async () => {
        console.log('login request running')
        const response = await loginSuccess(null, false)
        console.log('response login:: ', response)
        if (!response?.error) {
          dispatch(setUser(response.data.metadata.user))
          socket.emit('newConnection', response.data.metadata.user._id)
          dispatch(login())
        } else if (response) {
          console.log('response:: ', response)
          console.log('error response: ', response.error.data.message.strategy)
          if (location.pathname !== '/signup') navigate('/login')
          toast.warn(response.error.data.message.error)
        }
      }
      loginRequest()
    } else {
      console.log('else')
      const decodeToken = jwt_decode(accessToken)
      const now = new Date().getTime()
      console.log('decode token:: ', decodeToken.exp, now)
      if (decodeToken.exp * 1000 < now) {
        getProfile(null, false).then((response) => {
          console.log('response get profile:: ', response)
        })
        socket.emit('newConnection', userInfo?._id)
      } else {
        if (!socket && userInfo?._id) {
          socket.emit('newConnection', userInfo?._id)
        } else {
          disConnectSocket(userInfo?._id)
          socket.emit('newConnection', userInfo?._id)
        }
      }
    }
  }, [])

  const routes = [...AppRouteList, ...AuthRouteList]
  console.log('all routes rerender: ', [...routes])
  return useRoutes([...routes])
}

export const WebRoutes = memo(AppRoutes)
