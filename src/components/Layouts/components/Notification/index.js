/* eslint-disable react-hooks/exhaustive-deps */
import { Popover, Transition } from '@headlessui/react'
import { Fragment, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { BellIcon } from '@heroicons/react/20/solid'
import appApi from '../../../../redux/service'
import moment from 'moment'
import { DEFAULT_AVT } from '@src/configs'
import { useDispatch, useSelector } from 'react-redux'
import { setNotification } from '@src/containers/app/feature/Customer/customer.slice'

function Notification() {
  const notifications = useSelector((state) => state.customer.notifications)
  const dispatch = useDispatch()
  const location = useLocation()
  const [getNotification] = appApi.endpoints.getNotification.useLazyQuery()

  const fetchNotification = async () => {
    const allNotifications = await getNotification({}, false).unwrap()
    dispatch(setNotification(allNotifications?.metadata))
  }

  useEffect(() => {
    fetchNotification()
  }, [location])
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
              <div className='flex h-8 w-8 items-center justify-center rounded-full'>
                <BellIcon className='h-6 w-6 text-neutral-0' />
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
              <Popover.Panel className='absolute right-0 z-10 mt-3 w-96 max-w-sm transform rounded-md border-[1px] border-neutral-300 bg-neutral-100 p-4 sm:p-4 lg:max-w-3xl'>
                {notifications ? (
                  <>
                    <div className='max-h-96 overflow-y-scroll'>
                      {notifications?.map((child) => {
                        switch (child.type) {
                          case 'ORDER_SHOP': {
                            return (
                              <Link
                                key={child._id + child.message}
                                className='mb-2 flex gap-4 rounded-sm bg-neutral-200 p-2'
                                to={`/shop/order/${child.orderId}`}
                              >
                                <div className='h-12 w-12'>
                                  <img
                                    className='h-12 w-12 rounded-full'
                                    src={child?.senderId?.avatar || DEFAULT_AVT}
                                    alt='avt'
                                  />
                                </div>
                                <div className='flex-1'>
                                  <div className='flex justify-between'>
                                    <div className='flex gap-2'>
                                      <div className='font-medium'>{child.senderId.name}</div>
                                    </div>
                                    <div className='text-xs text-neutral-400'>
                                      {moment(child.createdAt).format('hh:mm A')}
                                    </div>
                                    {/* <div>{child._isViewed ? 'viewed' : 'not viewed'}</div> */}
                                  </div>
                                  <div className='text-sm text-neutral-500'>{child.message}</div>
                                </div>
                              </Link>
                            )
                          }
                          case 'ORDER_CUSTOMER': {
                            return (
                              <Link
                                key={child._id + child.message}
                                className='mb-2 flex gap-4 rounded-sm bg-neutral-200 p-2'
                                to={`/me/orders/${child.orderId}`}
                              >
                                <div className='h-12 w-12'>
                                  <img
                                    className='h-12 w-12 rounded-full'
                                    src={child?.senderId?.avatar || DEFAULT_AVT}
                                    alt='avt'
                                  />
                                </div>
                                <div className='flex-1'>
                                  <div className='flex justify-between'>
                                    <div className='flex gap-2'>
                                      <div className='font-medium'>{child.senderId.name}</div>
                                    </div>
                                    <div className='text-xs text-neutral-400'>
                                      {moment(child.createdAt).format('hh:mm A')}
                                    </div>
                                    {/* <div>{child.isViewed ? 'viewed' : 'not viewed'}</div> */}
                                  </div>
                                  <div className='text-sm text-neutral-500'>{child.message}</div>
                                </div>
                              </Link>
                            )
                          }
                        }
                      })}
                    </div>
                    <Link
                      to='/'
                      className='mt-3 text-xs font-medium text-neutral-500 transition hover:text-neutral-600'
                      target='_blank'
                    >
                      Xem tất cả
                    </Link>
                  </>
                ) : (
                  <div className='flex items-center justify-center'>Chưa có thông báo nào</div>
                )}
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>
    </div>
  )
}

export default Notification
