import AdminLayout from '@src/components/Layouts/AdminLayout'
import ProductAdd from './pages/ProductAdd'
import { USER_ROLE } from '@src/configs'
import RequireAuth from '@src/routes/RequireAuth'
import { Outlet } from 'react-router'
import ProductAll from './pages/ProductAll'
import ProductEdit from './pages/ProductEdit'
import OrderAll from './pages/OrderAll'
import OrderDetail from './pages/OrderDetail'
import Profile from './pages/Profile'

export const adminRouteList = [
  {
    path: '/shop/product',
    element: (
      <AdminLayout>
        <RequireAuth allowedRoles={[USER_ROLE.SHOP, USER_ROLE.USER]}>
          <Outlet />
        </RequireAuth>
      </AdminLayout>
    ),
    children: [
      {
        path: 'add',
        element: <ProductAdd />
      },
      {
        path: 'all',
        element: <ProductAll />
      },
      {
        path: ':id',
        element: <ProductEdit />
      }
    ]
  },
  {
    path: '/shop/order',
    element: (
      <AdminLayout>
        <RequireAuth allowedRoles={[USER_ROLE.SHOP, USER_ROLE.USER]}>
          <Outlet />
        </RequireAuth>
      </AdminLayout>
    ),
    children: [
      {
        path: ':id',
        element: <OrderDetail />
      },
      {
        path: 'all',
        element: <OrderAll />
      }
    ]
  },
  {
    path: '/shop',
    element: (
      <AdminLayout>
        <RequireAuth allowedRoles={[USER_ROLE.SHOP, USER_ROLE.USER]}>
          <Outlet />
        </RequireAuth>
      </AdminLayout>
    ),
    children: [
      {
        path: 'profile',
        element: <Profile />
      }
    ]
  }
]
