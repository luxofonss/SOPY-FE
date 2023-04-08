import useRoles from '@src/hooks/useRoles'
import { Navigate, Outlet, useLocation } from 'react-router'

const RequireAuth = ({ allowedRoles }) => {
  const roles = useRoles()
  const location = useLocation()

  return roles !== [] ? (
    roles?.find((role) => allowedRoles.includes(role)) ? (
      <Outlet />
    ) : (
      <Navigate to='/' state={{ from: location }} replace />
    )
  ) : (
    <Navigate to='/login' state={{ from: location }} replace />
  )
}

export default RequireAuth
