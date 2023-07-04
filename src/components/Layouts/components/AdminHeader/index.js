import { useSelector } from 'react-redux'
import AvatarDropdown from '../AvatarDropdown'
import MessengerDropdown from '../MessengerDropdown'
import Notification from '../Notification'

function AdminHeader() {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn)
  return (
    <div className='w-full bg-orange-3 h-16 flex justify-end items-center px-10'>
      <div className='flex gap-3'>
        {isLoggedIn ? (
          <div className='flex gap-1'>
            <Notification />
            <MessengerDropdown />
            <AvatarDropdown />
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default AdminHeader
