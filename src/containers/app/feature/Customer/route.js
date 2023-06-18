import AppLayout from '@src/components/Layouts/AppLayout'
import { USER_ROLE } from '@src/configs'
import RequireAuth from '@src/routes/RequireAuth'
import { Outlet } from 'react-router'
import UserCart from './pages/Cart'
import Category from './pages/Category'
import Home from './pages/Home'
import Product from './pages/Product'

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
        path: '/product/:id',
        element: <Product />
      }
    ]
  },
  {
    path: '/',
    // element: <RequireAuth allowedRoles={[USER_ROLE.USER, USER_ROLE.ADMIN]}></RequireAuth>,
    children: [
      {
        path: '/product',
        element: (
          <AppLayout>
            <Product />
          </AppLayout>
        )
      },
      {
        path: '/cart',
        element: (
          <AppLayout>
            <UserCart />
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
