/* eslint-disable react-hooks/exhaustive-deps */
import { Popover, Transition } from '@headlessui/react'
import { IconDashboard, IconUser } from '@src/assets/svgs'
import LogOut from '@src/components/LogOut'
import { USER_ROLE } from '@src/configs'
import { authApi } from '@src/containers/authentication/feature/Auth/authService'
import { logout } from '@src/containers/authentication/feature/Auth/authSlice'
import { Divider } from 'antd'
import { Fragment, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'

function AvatarDropdown() {
  const [actionsList, setActionList] = useState()
  const userInfo = useSelector((state) => state.auth.user)
  const dispatch = useDispatch()

  const [logoutRequest] = authApi.endpoints.logout.useMutation()

  const handleLogOut = async () => {
    await logoutRequest()
    dispatch(logout())
  }

  const userActions = [
    {
      group: 'group1',
      children: [
        {
          name: 'Thông tin cá nhân',
          path: '/me',
          type: '',
          icon: <IconUser />
        },
        {
          name: 'Đơn hàng',
          path: '/me/orders',
          type: '',
          icon: <IconDashboard />
        }
      ]
    },
    {
      group: 'group3',
      children: [
        {
          name: 'Log out',
          type: 'element',
          element: (
            <div
              onClick={handleLogOut}
              className='flex h-9 cursor-pointer items-center rounded-sm px-1 transition duration-200 hover:bg-fuchsia-300'
            >
              <LogOut />
            </div>
          )
        }
      ]
    }
  ]

  const shopActions = [
    {
      group: 'group1',
      children: [
        {
          name: 'Thông tin cá nhân',
          path: '/me',
          type: '',
          icon: <IconUser />
        },
        {
          name: 'Đơn hàng',
          path: '/me/orders',
          type: '',
          icon: <IconDashboard />
        }
      ]
    },
    {
      group: 'group2',
      children: [
        {
          name: 'Quản lý sản phẩm',
          path: '/shop/product/all',
          type: '',
          icon: <IconUser />
        },
        {
          name: 'Quản lý đơn hàng',
          path: '/shop/order/all',
          type: '',
          icon: <IconDashboard />
        },
        {
          name: 'Thông tin shop',
          path: '/shop/profile',
          type: '',
          icon: <IconDashboard />
        }
      ]
    },
    {
      group: 'group3',
      children: [
        {
          name: 'Log out',
          type: 'element',
          element: (
            <div
              onClick={handleLogOut}
              className='flex h-9 cursor-pointer items-center rounded-sm px-1 transition duration-200 hover:bg-fuchsia-300'
            >
              <LogOut />
            </div>
          )
        }
      ]
    }
  ]

  useEffect(() => {
    if (userInfo?.roles?.includes(USER_ROLE.SHOP)) {
      setActionList(shopActions)
    } else {
      setActionList(userActions)
    }
  }, [])

  return (
    <div className='flex'>
      <Popover className='relative z-[1000]'>
        {({ open }) => (
          <>
            <Popover.Button
              className={`
        ${open ? '' : 'text-opacity-90 '}
        focus-visible:ring-none group inline-flex items-center rounded-md px-3 py-2 text-base font-medium  text-gray-700 hover:text-opacity-100 focus:outline-none focus-visible:ring-opacity-75`}
            >
              <div className='flex h-8 w-8 items-center justify-center rounded-full bg-green-500'>
                {userInfo?.avatar ? (
                  <img src={userInfo.avatar} alt='avatar' className='h-full w-full rounded-full' />
                ) : userInfo.name ? (
                  userInfo?.name[0]
                ) : (
                  ''
                )}
              </div>
            </Popover.Button>
            <Transition
              as={Fragment}
              enter='transition ease-out duration-200'
              enterFrom='opacity-0 translate-y-1'
              enterTo='opacity-100 translate-y-0'
              leave='transition ease-in duration-150'
              leaveFrom='opacity-100 translate-y-0'
              leaveTo='opacity-0 translate-y-1'
            >
              <Popover.Panel className='absolute right-0 z-10 mt-3 w-56 max-w-sm transform rounded-md border-[1px] border-neutral-300 bg-neutral-100 p-4 shadow-xl sm:p-4 lg:max-w-3xl'>
                {actionsList?.map((groupList, index) => {
                  let groupAction = groupList.children?.map((action) => {
                    switch (action.type) {
                      case '': {
                        return (
                          <Link
                            to={action.path}
                            key={uuidv4()}
                            className='mb-1 flex h-9 w-full items-center justify-start rounded-sm px-1 transition duration-200 hover:bg-fuchsia-300'
                          >
                            {action.icon}
                            <div className='ml-3'>{action.name}</div>
                          </Link>
                        )
                      }
                      case 'element': {
                        return <div key={uuidv4()}>{action.element}</div>
                      }
                    }
                  })
                  return (
                    <Fragment key={uuidv4()}>
                      {groupAction}
                      {index !== actionsList?.length - 1 && <Divider className='my-1' />}
                    </Fragment>
                  )
                })}
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>
      <div className='py-2'>
        <div className='text-sm font-medium text-neutral-0'>{userInfo?.name}</div>
        <div className='text-xs font-medium text-neutral-200'>{userInfo?.email}</div>
      </div>
    </div>
  )
}

export default AvatarDropdown
