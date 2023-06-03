import AdminLayout from '@src/components/Layouts/AdminLayout'
import ProductAdd from './pages/ProductAdd'
// import { USER_ROLE } from '@src/configs'
// import RequireAuth from '@src/routes/RequireAuth'
import { Outlet } from 'react-router'

export const adminRouteList = [
  {
    path: '/product',
    element: (
      <AdminLayout>
        <Outlet />
      </AdminLayout>
    ),
    children: [
      {
        path: 'add',
        element: <ProductAdd />
      }
    ]
  }
]
