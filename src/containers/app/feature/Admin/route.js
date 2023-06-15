import AdminLayout from '@src/components/Layouts/AdminLayout'
import ProductAdd from './pages/ProductAdd'
// import { USER_ROLE } from '@src/configs'
// import RequireAuth from '@src/routes/RequireAuth'
import { Outlet } from 'react-router'
import ProductAll from './pages/ProductAll'
import ProductEdit from './pages/ProductEdit'

export const adminRouteList = [
  {
    path: '/shop/product',
    element: (
      <AdminLayout>
        <Outlet />
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
  }
]
