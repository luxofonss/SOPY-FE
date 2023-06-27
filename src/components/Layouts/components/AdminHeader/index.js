import { MessageIcon, NotifyIcon } from '@src/assets/svgs'
import AvatarDropdown from '../AvatarDropdown'
import { useSelector } from 'react-redux'

function AdminHeader() {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn)
  return (
    <div className='w-full bg-neutral-100 h-16 flex justify-end items-center px-10'>
      <div className='flex gap-3'>
        <div className='w-9 h-9 flex items-center justify-center rounded-md hover:bg-secondary-blue cursor-pointer'>
          <MessageIcon />
        </div>
        <div className='w-9 h-9 flex items-center justify-center rounded-md hover:bg-secondary-blue cursor-pointer'>
          <NotifyIcon />
        </div>
        {isLoggedIn ? (
          <div>
            <AvatarDropdown />
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default AdminHeader
