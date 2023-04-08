import AppLayout from '@src/components/Layouts/AppLayout'
import { USER_ROLE } from '@src/configs'
import RequireAuth from '@src/routes/RequireAuth'
import { Outlet } from 'react-router'
import Category from './pages/Category'
import Home from './pages/Home'
import Product from './pages/Product'
import Todo from './pages/Todo'

export const customerRouteList = [
  {
    path: '/',
    element: (
      <AppLayout>
        <Home />
      </AppLayout>
    )
  },
  {
    path: '/',
    element: (
      <AppLayout>
        <Outlet />
      </AppLayout>
    ),
    children: [
      {
        path: '/todo',
        element: <Todo />
      }
    ]
  },
  {
    path: '/',
    element: <RequireAuth allowedRoles={[USER_ROLE.USER]}></RequireAuth>,
    children: [
      {
        path: '/product',
        element: (
          <AppLayout>
            <Product />
          </AppLayout>
        )
      }
    ]
  },
  {
    path: '/',
    element: <RequireAuth allowedRoles={[USER_ROLE.ADMIN]}></RequireAuth>,
    children: [
      {
        path: '/category',
        element: (
          <AppLayout>
            <Category />
          </AppLayout>
        )
      }
    ]
  }
]
