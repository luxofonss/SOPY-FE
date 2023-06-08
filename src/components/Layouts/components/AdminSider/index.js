import {
  AppLogo,
  BarChartIcon,
  ChevronUp,
  DeliveryIcon,
  FinanceIcon,
  LiVector,
  OrderManagementIcon,
  ProductIcon,
  ShopIcon
} from '@src/assets/svgs'
import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

const menuList = [
  {
    title: 'Vận chuyển',
    icon: <DeliveryIcon></DeliveryIcon>,
    name: 'DELIVERY',
    children: [
      {
        title: 'Quản lý vận chuyển',
        path: '/active'
      },
      { title: 'Giao hàng loạt', path: '/' },
      {
        title: 'Cài đặt vận chuyển',
        path: '/'
      }
    ]
  },
  {
    title: 'Quản lý đơn hàng',
    icon: <OrderManagementIcon></OrderManagementIcon>,
    name: 'ORDER-MANAGEMENT',
    children: [
      {
        title: 'Tất cả',
        path: '/'
      },
      { title: 'Đơn hủy', path: '/' },
      {
        title: 'Trả hàng/hoàn tiền',
        path: '/'
      }
    ]
  },
  {
    title: 'Quản lý sản phẩm',
    icon: <ProductIcon></ProductIcon>,
    name: 'PRODUCT-MANAGEMENT',
    children: [
      {
        title: 'Tất cả sản phẩm',
        path: '/product/all'
      },
      { title: 'Thêm sản phẩm', path: '/product/add' },
      {
        title: 'Cài đặt sản phẩm',
        path: '/'
      }
    ]
  },
  {
    title: 'Tài chính',
    icon: <FinanceIcon></FinanceIcon>,
    name: 'FINANCE',
    children: [
      {
        title: 'Doanh thu',
        path: '/'
      },
      { title: 'Cài đặt thanh toán', path: '/' }
    ]
  },
  {
    title: 'Phân tích bán hàng',
    icon: <BarChartIcon></BarChartIcon>,
    path: '/'
  },
  {
    title: 'Quản lý shop',
    icon: <ShopIcon></ShopIcon>,
    name: 'SHOP-MANAGEMENT',
    children: [
      {
        title: 'Đánh giá shop',
        path: '/'
      },
      { title: 'Hồ sơ shop', path: '/' },
      {
        title: 'Quản lý tài khoản',
        path: '/'
      }
    ]
  }
]

function AdminSider() {
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
    <div className='p-6 h-full fixed bg-[#FCFCFC]'>
      <div>
        <AppLogo />
      </div>
      <div className='mt-12 py-3 pl-3'>
        {menuList.map((menu) => {
          if (menu.path) {
            return (
              <div
                key={menu.title}
                className='cursor-pointer flex items-center gap-3 h-12 w-full mb-2 text-md font-semibold'
              >
                <div>{menu.icon}</div>
                <Link className='font-semibold text-[15px] text-neutral-400 leading-6' to={menu.path}>
                  {menu.title}
                </Link>
              </div>
            )
          } else
            return (
              <div className='mb-4' key={menu.title}>
                <div
                  onClick={() => {
                    handleMenuClick(menu.name)
                  }}
                  className='flex items-center cursor-pointer gap-3 h-12 w-full mb-2 text-md font-semibold '
                >
                  <div>{menu.icon}</div>
                  <div className='font-semibold text-[15px] text-neutral-400 leading-6'>{menu.title}</div>
                  {menu.children ? (
                    <div className='flex-1 flex justify-end'>
                      <div
                        className={`${
                          openList.includes(menu.name) ? 'rotate-0' : 'rotate-180'
                        } transition-all duration-200`}
                      >
                        <ChevronUp />
                      </div>
                    </div>
                  ) : null}
                </div>
                {openList.includes(menu.name) ? (
                  <div className='relative w-full ml-3 pl-3 flex flex-col mt-2'>
                    <div className='absolute w-[2px] h-[calc(100%_-_30px)] top-0 left-0 bg-neutral-300'></div>
                    {menu.children.map((subMenu) => {
                      return (
                        <Link
                          className={`${
                            subMenu.path === location.pathname
                              ? 'bg-neutral-300 rounded-xl shadow-menu-item text-neutral-700 hover:bg-neutral-200'
                              : 'hover:bg-neutral-200'
                          } relative h-12 w-full p-3 text-neutral-400 rounded-md mb-1 font-medium flex items-center transition-all duration-200`}
                          to={subMenu.path}
                          key={subMenu.title}
                        >
                          <div className='absolute -left-3 top-3'>
                            <LiVector />
                          </div>
                          {subMenu.title}
                        </Link>
                      )
                    })}
                  </div>
                ) : null}
              </div>
            )
        })}
      </div>
    </div>
  )
}

export default AdminSider
