/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
// import ThemeSwitch from '@src/components/ThemeSwitch'
import { USER_ROLE } from '@src/configs'
import Cart from '@src/containers/app/feature/Customer/components/Cart'
import { Fragment } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import logo from '../../../../assets/images/logo.png'
import AvatarDropdown from '../AvatarDropdown'
import MessengerDropdown from '../MessengerDropdown'
import Notification from '../Notification'
import SearchBar from '../SearchBar'

function Header() {
  const userInfo = useSelector((state) => state.auth.user)
  const auth = useSelector((state) => state.auth)

  return (
    <div className='fixed z-[1000] w-screen bg-orange-4 shadow-md'>
      <div className='border-b-[1px] border-b-orange-3'>
        <div className='container mx-auto flex h-6 justify-between text-xs font-medium text-neutral-0'>
          <div className='flex items-center gap-2'>
            <Link className='hover:cursor-pointer hover:opacity-90' to='/shop/product/all'>
              Kênh người bán
            </Link>
            {userInfo?.roles?.includes(USER_ROLE.SHOP) ? null : (
              <Link className='hover:cursor-pointer hover:opacity-90' to='/shop/register'>
                Trở thành người bán SOPE
              </Link>
            )}
            <div className='hover:cursor-pointer hover:opacity-90'>Tải ứng dụng</div>
            <div className='flex items-center gap-1'>
              <p>Kết nối</p>
              <div className='hover:cursor-pointer hover:opacity-90'>FB</div>
              <div className='hover:cursor-pointer hover:opacity-90'>IG</div>
            </div>
          </div>
          <div className='gap-gap1 flex items-center gap-2'>
            <div className='hover:cursor-pointer hover:opacity-90'>Săn đơn 1k ngay bây giờ</div>
            <div className='hover:cursor-pointer hover:opacity-90'>Free ship đơn không giới hạn</div>
            <div className='hover:cursor-pointer hover:opacity-90'>Thông báo</div>
            <div className='hover:cursor-pointer hover:opacity-90'>Hỗ trợ</div>
            {auth.isLoggedIn ? null : (
              <Fragment>
                <Link className='hover:cursor-pointer hover:opacity-90' to='/signup'>
                  Đăng ký
                </Link>
                <Link className='hover:cursor-pointer hover:opacity-90' to='/login'>
                  Đăng nhập
                </Link>
              </Fragment>
            )}
          </div>
        </div>
      </div>
      <div className='h-18 container mx-auto flex items-center gap-20'>
        <Link className='flex items-center gap-3' to='/'>
          <img className='h-[78px] ' src={logo} alt='logo' />
          {/* <p className='text-lg text-neutral-0 font-semibold'>SOPY</p> */}
        </Link>
        <div className='flex-1'>
          <SearchBar />
          <div className='mt-1 flex gap-3'>
            <div className='text-xs text-neutral-300 transition hover:cursor-pointer hover:text-neutral-400'>
              Iphone 11
            </div>
            <div className='text-xs text-neutral-300 transition hover:cursor-pointer hover:text-neutral-400'>
              Điện thoại 1k
            </div>
            <div className='text-xs text-neutral-300 transition hover:cursor-pointer hover:text-neutral-400'>
              Nón bảo hiểm
            </div>
            <div className='text-xs text-neutral-300 transition hover:cursor-pointer hover:text-neutral-400'>
              Áo sơ mi nam
            </div>
            <div className='text-xs text-neutral-300 transition hover:cursor-pointer hover:text-neutral-400'>
              Laptop cũ
            </div>
          </div>
        </div>
        {auth.isLoggedIn ? (
          <div className='flex gap-1'>
            <Notification />
            <MessengerDropdown />
            <Cart />
            <AvatarDropdown />
          </div>
        ) : (
          <div className='flex gap-1'>
            <Link
              to='/login'
              className='flex h-9 items-center justify-center gap-3 rounded-lg  bg-neutral-0 px-3 font-medium text-orange-4 transition duration-300 hover:bg-neutral-100'
            >
              Sign in
            </Link>
            <Link
              to='/signup'
              className='flex h-9 items-center justify-center gap-3 rounded-lg  bg-orange-1 px-3 font-medium text-neutral-0 transition duration-300 hover:bg-neutral-300 hover:text-orange-4'
            >
              Sign up
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default Header
