import AppLayout from '@src/components/Layouts/AppLayout'
import { Outlet } from 'react-router'
import Login from './Login'
import Signup from './Signup'

export const authRouteList = [
  {
    path: '/',
    element: (
      <AppLayout>
        <Outlet />
      </AppLayout>
    ),
    children: [
      {
        path: '/login',
        element: <Login />,
        children: []
      },
      {
        path: '/signup',
        element: <Signup />,
        children: []
      }
    ]
  }
]
