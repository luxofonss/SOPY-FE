import { Fragment } from 'react'
import { Navigate, Outlet } from 'react-router'
import { USER_ROLE } from '@src/configs'
import NotFound from './pages/NotFound'

export const staticRouteList = [
  {
    path: '/',
    element: (
      <Fragment>
        <Outlet />
      </Fragment>
    ),
    role: [USER_ROLE.USER, USER_ROLE.ADMIN],
    isPrivate: false,
    children: [
      {
        path: '/not-found',
        element: <NotFound />
      },
      { path: '*', element: <Navigate to='/not-found' replace /> }
    ]
  }
]
