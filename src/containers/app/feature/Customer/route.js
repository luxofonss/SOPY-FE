import AppLayout from '@src/components/Layouts/AppLayout'
import { USER_ROLE } from '@src/configs'
import { Fragment } from 'react'
import { Outlet } from 'react-router-dom'
import Category from './pages/Category'
import Home from './pages/Home'
import Product from './pages/Product'
import Todo from './pages/Todo'

export const customerRouteList = [
  {
    path: '/',
    element: (
      <Fragment>
        <AppLayout />
        <Outlet />
      </Fragment>
    ),
    role: [USER_ROLE.USER],
    isPrivate: true,
    children: [
      {
        path: '/category',
        element: <Category />
      }
    ]
  },
  {
    path: '/',
    element: (
      <Fragment>
        <Home />
        <Outlet />
      </Fragment>
    ),
    role: [USER_ROLE.ADMIN],
    isPrivate: true,
    children: [
      {
        path: '/product',
        element: <Product />
      }
    ]
  },
  {
    path: '/',
    element: (
      <Fragment>
        <Home />
        <Outlet />
      </Fragment>
    ),
    role: [USER_ROLE.ADMIN, USER_ROLE.USER],
    isPrivate: false,
    children: [
      {
        path: '/todo',
        element: <Todo />
      }
    ]
  }
]
