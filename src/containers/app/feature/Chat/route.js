import { USER_ROLE } from '@src/configs'
import RequireAuth from '@src/routes/RequireAuth'
import { Outlet } from 'react-router'
import Chat from './pages/Chat'
import AppLayout from '@src/components/Layouts/AppLayout'

export const chatRouteList = [
  {
    path: '/',
    element: (
      <AppLayout>
        <RequireAuth allowedRoles={[USER_ROLE.SHOP, USER_ROLE.USER]}>
          <Outlet />
        </RequireAuth>
      </AppLayout>
    ),
    children: [
      {
        path: '/me/message/:id',
        element: <Chat />
      }
    ]
  }
]
