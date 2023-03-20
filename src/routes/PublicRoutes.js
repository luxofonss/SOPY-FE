import { AppRouteList } from '@src/containers/app/AppRoutes'
import { AuthRouteList } from '@src/containers/authentication/AuthRoutes'

const PublicRoute = () => {
  const publicAppRoutes = AppRouteList.filter((route) => {
    return route.isPrivate === false
  })
  const publicAuthRoutes = AuthRouteList.filter((route) => {
    return route.isPrivate === false
  })
  const routes = [...publicAppRoutes, ...publicAuthRoutes]

  return routes
}

export default PublicRoute
