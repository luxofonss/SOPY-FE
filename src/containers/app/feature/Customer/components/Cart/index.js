import { Popover, Transition } from '@headlessui/react'
import Divider from '@src/components/Divider'
import { Fragment } from 'react'
import { NavLink } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'

const userActions = [
  {
    group: 'group1',
    children: [
      {
        name: 'Profile',
        path: '/user/profile',
        type: ''
      },
      {
        name: 'Settings',
        path: '/user/settings',
        type: ''
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
        element: <div>test</div>
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
          <div className='px-1 h-9 rounded-sm items-center flex hover:bg-fuchsia-300 transition duration-200 cursor-pointer'></div>
        )
      }
    ]
  }
]

function Cart() {
  return (
    <Popover className='relative z-[1000]'>
      {({ open }) => (
        <>
          <Popover.Button
            className={`
      ${open ? '' : 'text-opacity-90 '}
      group inline-flex items-center rounded-md px-3 text-gray-700 py-2 text-base font-medium  hover:text-opacity-100 focus:outline-none focus-visible:ring-none focus-visible:ring-opacity-75`}
          >
            <div className='w-8 h-8 rounded-full bg-green-500 flex justify-center items-center'>
              {/* {userInfo?.lastName && userInfo?.lastName[0]} */}
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
  )
}

export default Cart
