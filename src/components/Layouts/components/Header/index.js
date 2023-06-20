/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { Popover, Transition } from '@headlessui/react'
import { IconDashboard, IconUser } from '@src/assets/svgs'
import Divider from '@src/components/Divider'
import LogOut from '@src/components/LogOut'
import ThemeSwitch from '@src/components/ThemeSwitch'
import Cart from '@src/containers/app/feature/Customer/components/Cart'
import { useLogoutMutation } from '@src/containers/authentication/feature/Auth/authService'
import { logout, setUser } from '@src/containers/authentication/feature/Auth/authSlice'
import { Fragment } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, NavLink } from 'react-router-dom'
import { toast } from 'react-toastify'
import { v4 as uuidv4 } from 'uuid'
import logo from '../../../../assets/images/logo.png'
import SearchBar from '../SearchBar'

function Header() {
  const userInfo = useSelector((state) => state.auth.user)
  const auth = useSelector((state) => state.auth)
  const [logoutRequest] = useLogoutMutation()
  const dispatch = useDispatch()

  const handleLogOut = async () => {
    const response = await logoutRequest()
    if (!response.error) {
      dispatch(setUser({}))
      dispatch(logout())
    } else {
      toast.error('Can not logout, please try again!')
    }
  }

  const userActions = [
    {
      group: 'group1',
      children: [
        {
          name: 'Profile',
          path: '/user/profile',
          type: '',
          icon: <IconUser />
        },
        {
          name: 'Settings',
          path: '/user/settings',
          type: '',
          icon: <IconDashboard />
        }
      ]
    },
    {
      group: 'group2',
      children: [
        {
          name: 'Theme',
          path: '',
          type: 'element',
          element: <ThemeSwitch className='px-1 h-9 rounded-sm hover:bg-fuchsia-300 transition duration-200' />
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
              className='px-1 h-9 rounded-sm items-center flex hover:bg-fuchsia-300 transition duration-200 cursor-pointer'
            >
              <LogOut />
            </div>
          )
        }
      ]
    }
  ]

  return (
    <div className='w-screen fixed bg-neutral-0 border-b-1 border-b-primary-500 z-[1000]'>
      <div className='container mx-auto h-6 text-neutral-600 text-sm  flex justify-between'>
        <div className='flex gap-2 items-center'>
          <div>Kênh người bán</div>
          <Link className='hover:opacity-90 hover:cursor-pointer' to='/shop/register'>
            Trở thành người bán Sope
          </Link>
          <div>Tải ứng dụng</div>
          <div className='flex gap-1 items-center'>
            <p>Kết nối</p>
            <div>FB</div>
            <div>IG</div>
          </div>
        </div>
        <div className='flex gap-gap1 items-center gap-2'>
          <div>Thông báo</div>
          <div>Hỗ trợ</div>
          <Link className='hover:opacity-90 hover:cursor-pointer' to='/signup'>
            Đăng ký
          </Link>
          <Link className='hover:opacity-90 hover:cursor-pointer' to='/login'>
            Đăng nhập
          </Link>
        </div>
      </div>
      <div className='container h-16 mx-auto flex items-center gap-56 justify-between '>
        <Link to='/'>
          <img className='w-8 h-8' src={logo} alt='logo' />
        </Link>
        <div className='flex-1'>
          <SearchBar />
        </div>
        {auth.isLoggedIn ? (
          <div className='flex gap-1'>
            <Cart />
            <Popover className='relative z-[1000]'>
              {({ open }) => (
                <>
                  <Popover.Button
                    className={`
                  ${open ? '' : 'text-opacity-90 '}
                  group inline-flex items-center rounded-md px-3 text-gray-700 py-2 text-base font-medium  hover:text-opacity-100 focus:outline-none focus-visible:ring-none focus-visible:ring-opacity-75`}
                  >
                    <div className='w-8 h-8 rounded-full bg-green-500 flex justify-center items-center'>
                      {userInfo?.lastName && userInfo?.lastName[0]}
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
                    <Popover.Panel className='absolute bg-neutral-400 right-0 z-10 mt-3 w-56 border-2 rounded-md p-4 max-w-sm transform sm:p-4 lg:max-w-3xl'>
                      {userActions.map((groupList, index) => {
                        let groupAction = groupList.children?.map((action) => {
                          switch (action.type) {
                            case '': {
                              return (
                                <NavLink
                                  to={action.path}
                                  key={uuidv4()}
                                  className='flex mb-1 justify-start items-center px-1 rounded-sm h-9 w-full hover:bg-fuchsia-300 transition duration-200'
                                >
                                  {action.icon}
                                  <div className='ml-3'>{action.name}</div>
                                </NavLink>
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
                            {index !== userActions.length - 1 && <Divider />}
                          </Fragment>
                        )
                      })}
                    </Popover.Panel>
                  </Transition>
                </>
              )}
            </Popover>
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default Header
