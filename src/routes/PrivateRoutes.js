import { AppRouteList } from '@src/containers/app/AppRoutes'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

const PrivateRoute = () => {
  const user = useSelector((state) => {
    console.log(state)
    return state.auth.user
  })
  const userRole = user?.role

  const checkRouteRole = (routeRoles) => {
    if (routeRoles.includes(userRole)) {
      return true
    }
    return false
  }

  const privateRoutes = Array.from(AppRouteList, (route) => route)
  const privateRoutesMatchUser = []
  privateRoutes.forEach((route) => {
    if (route.isPrivate) {
      const isMatchRole = checkRouteRole(route.role)
      privateRoutesMatchUser.push({
        path: route.path,
        element: isMatchRole ? (
          route.element
        ) : userRole ? (
          <Navigate to='/' replace />
        ) : (
          <Navigate to='/login' replace />
        ),
        children: route.children
      })
    }
  })

  const routes = [...privateRoutesMatchUser]

  return routes
}

export default PrivateRoute
