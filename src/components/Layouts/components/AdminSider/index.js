import {
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
import logo_orange from '../../../../assets/images/logo_orange.png'

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
        path: '/shop/order/all'
      }
      // { title: 'Đơn hủy', path: '/shop/order/all?status=CANCELED&page=1&sort=ctime&limit=10' },
      // {
      //   title: 'Trả hàng/hoàn tiền',
      //   path: '/'
      // }
    ]
  },
  {
    title: 'Quản lý sản phẩm',
    icon: <ProductIcon></ProductIcon>,
    name: 'PRODUCT-MANAGEMENT',
    children: [
      {
        title: 'Tất cả sản phẩm',
        path: '/shop/product/all'
      },
      { title: 'Thêm sản phẩm', path: '/shop/product/add' },
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
      { title: 'Hồ sơ shop', path: '/shop/profile' },
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
    <div className='fixed h-full bg-[#FCFCFC] p-6'>
      <div className='flex justify-center'>
        <Link to='/'>
          <img className='h-[78px] ' src={logo_orange} alt='logo' />
        </Link>
      </div>
      <div className='py-3 pl-3'>
        {menuList.map((menu) => {
          if (menu.path) {
            return (
              <div
                key={menu.title}
                className='text-md mb-2 flex h-12 w-full cursor-pointer items-center gap-3 font-semibold'
              >
                <div>{menu.icon}</div>
                <Link className='text-[15px] font-semibold leading-6 text-neutral-400' to={menu.path}>
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
                  className='text-md mb-2 flex h-12 w-full cursor-pointer items-center gap-3 font-semibold '
                >
                  <div>{menu.icon}</div>
                  <div className='text-[15px] font-semibold leading-6 text-neutral-400'>{menu.title}</div>
                  {menu.children ? (
                    <div className='flex flex-1 justify-end'>
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
                  <div className='relative ml-3 mt-2 flex w-full flex-col pl-3'>
                    <div className='absolute top-0 left-0 h-[calc(100%_-_30px)] w-[2px] bg-neutral-300'></div>
                    {menu.children.map((subMenu) => {
                      return (
                        <Link
                          className={`${
                            subMenu.path === location.pathname
                              ? 'rounded-xl bg-neutral-300 text-neutral-700 shadow-menu-item hover:bg-neutral-200'
                              : 'hover:bg-neutral-200'
                          } relative mb-1 flex h-12 w-full items-center rounded-md p-3 font-medium text-neutral-400 transition-all duration-200`}
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
