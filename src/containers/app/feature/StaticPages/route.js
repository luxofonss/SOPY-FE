import { Fragment } from 'react'
import { Navigate, Outlet } from 'react-router'
import NotFound from './pages/NotFound'

export const staticRouteList = [
  {
    path: '/',
    element: (
      <Fragment>
        <Outlet />
      </Fragment>
    ),
    children: [
      {
        path: '/not-found',
        element: <NotFound />
      },
      { path: '*', element: <Navigate to='/not-found' replace /> }
    ]
  }
]
