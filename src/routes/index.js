import { AppRouteList } from '@src/containers/app/AppRoutes'
import { AuthRouteList } from '@src/containers/authentication/AuthRoutes'
import { memo, useEffect } from 'react'
import { useRoutes } from 'react-router-dom'
import jwt_decode from 'jwt-decode'
import Cookies from 'universal-cookie'
import { useLazyGetProfileQuery } from '@src/containers/authentication/feature/Auth/authService'

const cookies = new Cookies()
export const AppRoutes = () => {
  const [trigger] = useLazyGetProfileQuery()
  useEffect(() => {
    const accessToken = cookies.get('access_token')
    if (accessToken) {
      const decodeToken = jwt_decode(accessToken)
      const now = new Date().getTime()
      console.log(now, decodeToken.exp)
      if (decodeToken.exp * 1000 < now) {
        trigger()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const routes = [...AppRouteList, ...AuthRouteList]
  console.log('all routes rerender: ', [...routes])
  return useRoutes([...routes])
}

export const WebRoutes = memo(AppRoutes)
