/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { Popover, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { IconDashboard, IconUser } from '@src/assets/svgs'
import Divider from '@src/components/Divider'
import LogOut from '@src/components/LogOut'
import ThemeSwitch from '@src/components/ThemeSwitch'
import { useLogoutMutation } from '@src/containers/authentication/feature/Auth/authService'
import { Fragment } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, NavLink } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import logo from '../../../../assets/images/logo.png'
import { logout, setUser } from '@src/containers/authentication/feature/Auth/authSlice'
import { toast } from 'react-toastify'
import SearchBar from '../SearchBar'

const solutions = [
  {
    name: 'Insights',
    description: 'Measure actions your users take',
    href: '##',
    icon: null
  },
  {
    name: 'Automations',
    description: 'Create your own targeted content',
    href: '##',
    icon: null
  },
  {
    name: 'Reports',
    description: 'Keep track of your growth',
    href: '##',
    icon: null
  }
]

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
    <div className='w-screen fixed bg-primary-400 border-b-1 border-b-primary-500'>
      <div className='container h-16 mx-auto flex items-center justify-between '>
        <Link to='/'>
          <img className='w-8 h-8' src={logo} alt='logo' />
        </Link>
        <SearchBar />
        <div className='flex'>
          <Popover className='relative'>
            {({ open }) => (
              <>
                <Popover.Button
                  className={`
                  ${open ? 'text-cyan-500' : 'text-opacity-90 text-gray-700'}
                  group inline-flex items-center rounded-md px-3 py-2 text-base font-medium  hover:text-opacity-100 focus:outline-none focus-visible:ring-none focus-visible:ring-opacity-75`}
                >
                  <IconDashboard />
                  <span className='ml-2'>Solutions</span>
                  <ChevronDownIcon
                    className={`${open ? 'rotate-180 text-cyan-500' : 'text-opacity-70 text-gray-700 '}
                    ml-2 h-5 w-5 transition duration-150 ease-in-out group-hover:text-opacity-80`}
                    aria-hidden='true'
                  />
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
                  <Popover.Panel className='absolute left-1/2 z-10 mt-3 w-screen max-w-sm -translate-x-1/2 transform px-4 sm:px-0 lg:max-w-3xl'>
                    <div className='overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5'>
                      <div className='relative grid gap-8 bg-white p-7 lg:grid-cols-2'>
                        {solutions.map((item) => (
                          <a
                            key={uuidv4(item.name)}
                            href={item.href}
                            className='-m-3 flex items-center rounded-lg p-2 transition duration-150 ease-in-out hover:bg-gray-200 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50'
                          >
                            {/* <div className='flex h-10 w-10 shrink-0 items-center justify-center text-white sm:h-12 sm:w-12'>
                              <item.icon aria-hidden='true' />
                            </div> */}
                            <div className='ml-4'>
                              <p className='text-sm font-medium text-gray-900'>{item.name}</p>
                              <p className='text-sm text-gray-500'>{item.description}</p>
                            </div>
                          </a>
                        ))}
                      </div>
                      <div className='bg-gray-100 p-4'>
                        <a
                          href='##'
                          className='flow-root rounded-md px-2 py-2 transition duration-150 ease-in-out hover:bg-gray-300 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50'
                        >
                          <span className='flex items-center'>
                            <span className='text-sm font-medium text-gray-900'>Documentation</span>
                          </span>
                          <span className='block text-sm text-gray-500'>Start integrating products and tools</span>
                        </a>
                      </div>
                    </div>
                  </Popover.Panel>
                </Transition>
              </>
            )}
          </Popover>
          <Popover className='relative'>
            {({ open }) => (
              <>
                <Popover.Button
                  className={`
                  ${open ? 'text-cyan-500' : 'text-opacity-90 text-gray-700'}
                  group inline-flex items-center rounded-md px-3 py-2 text-base font-medium  hover:text-opacity-100 focus:outline-none focus-visible:ring-none focus-visible:ring-opacity-75`}
                >
                  <IconDashboard />
                  <span className='ml-2'>Navigation</span>
                  <ChevronDownIcon
                    className={`${open ? 'rotate-180 text-cyan-500' : 'text-opacity-70 text-gray-700 '}
                    ml-2 h-5 w-5 transition duration-150 ease-in-out group-hover:text-opacity-80`}
                    aria-hidden='true'
                  />
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
                  <Popover.Panel className='absolute left-1/2 z-10 mt-3 w-screen max-w-sm -translate-x-1/2 transform px-4 sm:px-0 lg:max-w-3xl'>
                    <div className='overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5'>
                      <div className='relative grid gap-8 bg-white p-7 lg:grid-cols-2'>
                        {solutions.map((item) => (
                          <a
                            key={item.name}
                            href={item.href}
                            className='-m-3 flex items-center rounded-lg p-2 transition duration-150 ease-in-out hover:bg-gray-200 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50'
                          >
                            {/* <div className='flex h-10 w-10 shrink-0 items-center justify-center text-white sm:h-12 sm:w-12'>
                              <item.icon aria-hidden='true' />
                            </div> */}
                            <div className='ml-4'>
                              <p className='text-sm font-medium text-gray-900'>{item.name}</p>
                              <p className='text-sm text-gray-500'>{item.description}</p>
                            </div>
                          </a>
                        ))}
                      </div>
                      <div className='bg-gray-100 p-4'>
                        <a
                          href='##'
                          className='flow-root rounded-md px-2 py-2 transition duration-150 ease-in-out hover:bg-gray-300 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50'
                        >
                          <span className='flex items-center'>
                            <span className='text-sm font-medium text-gray-900'>Documentation</span>
                          </span>
                          <span className='block text-sm text-gray-500'>Start integrating products and tools</span>
                        </a>
                      </div>
                    </div>
                  </Popover.Panel>
                </Transition>
              </>
            )}
          </Popover>
        </div>
        {auth.isLoggedIn ? (
          <div>
            <Popover className='relative'>
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
                    <Popover.Panel className='absolute right-0 z-10 mt-3 w-56 border-2 rounded-md p-4 max-w-sm transform sm:p-4 lg:max-w-3xl'>
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
