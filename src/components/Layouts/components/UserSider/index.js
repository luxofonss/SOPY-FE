import { DeliveryIcon, OrderManagementIcon } from '@src/assets/svgs'
import { Divider } from 'antd'
import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

const menuList = [
  {
    title: 'Thông tin tài khoản',
    icon: <DeliveryIcon></DeliveryIcon>,
    name: 'ACCOUNT',
    path: '/me'
  },
  {
    title: 'Đơn mua',
    icon: <OrderManagementIcon></OrderManagementIcon>,
    name: 'ORDER',
    path: '/me/orders'
  },
  {
    title: 'Thông báo',
    icon: <OrderManagementIcon></OrderManagementIcon>,
    name: 'NOTIFICATION',
    path: 'me/notifications'
  }
]

function UserSider() {
  const [openList, setOpenList] = useState([])
  const location = useLocation()

  const handleMenuClick = (name) => {
    if (openList.includes(name)) {
      let newList
      const index = openList.indexOf(name)
      if (index > -1) {
        // only splice array when item is found
        newList = openList
        newList.splice(index, 1)
        setOpenList([...newList])
      }
    } else {
      setOpenList([...openList, name])
    }
  }
  return (
    <div className='p-2 flex flex-col'>
      <div className='flex gap-4'>
        <img
          className='w-12 h-12 rounded-md'
          src='https://sm.ign.com/ign_ap/cover/a/avatar-gen/avatar-generations_hugw.jpg'
          alt='avatar'
        />
        <div className='flex flex-col justify-between'>
          <div>name</div>
          <div>sdt</div>
        </div>
      </div>
      <Divider />
      <div className='mt-3'>
        {menuList.map((menu) => {
          return (
            <div className='mb-4' key={menu.title}>
              <Link
                to={menu.path}
                onClick={() => {
                  handleMenuClick(menu.name)
                }}
                className={`${
                  menu.path === location.pathname
                    ? 'bg-neutral-300 rounded-xl shadow-menu-item text-neutral-700 hover:bg-neutral-200'
                    : 'hover:bg-neutral-200'
                } flex items-center cursor-pointer px-3 gap-3 h-10 w-full mb-2 text-md font-semibold`}
              >
                <div>{menu.icon}</div>
                <div className='font-semibold text-[15px] text-neutral-400 leading-6'>{menu.title}</div>
              </Link>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default UserSider
