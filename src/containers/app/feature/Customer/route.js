import AppLayout from '@src/components/Layouts/AppLayout'
import { USER_ROLE } from '@src/configs'
import RequireAuth from '@src/routes/RequireAuth'
import { Outlet } from 'react-router'
import UserCart from './pages/Cart'
import Checkout from './pages/Checkout'
import Home from './pages/Home'
import Order from './pages/Order'
import Product from './pages/Product'
import ShopRegister from './pages/ShopRegister'
import UserProfileLayout from '@src/components/Layouts/UserProfileLayout'
import Profile from './pages/Profile'
import ProductSearch from './pages/ProductSearch'
import Shop from './pages/Shop'
import OrderDetail from './pages/OrderDetail'

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
      },
      {
        path: '/search',
        element: <ProductSearch />
      }
    ]
  },
  {
    path: '/',
    element: <RequireAuth allowedRoles={[USER_ROLE.USER, USER_ROLE.SHOP]}></RequireAuth>,
    children: [
      {
        path: '/shop/register',
        element: <ShopRegister />
      },
      {
        path: '/cart',
        element: (
          <AppLayout>
            <UserCart />
          </AppLayout>
        )
      },
      {
        path: '/checkout',
        element: (
          <AppLayout>
            <Checkout />
          </AppLayout>
        )
      }
    ]
  },
  {
    path: '/',
    element: <RequireAuth allowedRoles={[USER_ROLE.USER, USER_ROLE.SHOP]}></RequireAuth>,
    children: [
      {
        path: '/me/orders',
        element: (
          <UserProfileLayout>
            <Order />
          </UserProfileLayout>
        )
      },
      {
        path: '/me/orders/:id',
        element: (
          <UserProfileLayout>
            <OrderDetail />
          </UserProfileLayout>
        )
      },
      {
        path: '/me',
        element: (
          <UserProfileLayout>
            <Profile />
          </UserProfileLayout>
        )
      }
    ]
  },
  {
    path: '/shop/:id',
    element: (
      <AppLayout>
        <Shop />
      </AppLayout>
    )
  }
]
