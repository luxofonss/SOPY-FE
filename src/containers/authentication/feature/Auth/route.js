import Login from './Login'
import Signup from './Signup'

export const authRouteList = [
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
