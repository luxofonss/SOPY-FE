import { USER_ROLE } from '@src/configs'
import Login from './Login'

export const authRouteList = [
  {
    path: '/login',
    isPrivate: false,
    role: [USER_ROLE.ADMIN, USER_ROLE.USER],
    element: <Login />,
    children: []
  }
]
