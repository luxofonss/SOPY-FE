import { useSelector } from 'react-redux'
import AvatarDropdown from '../AvatarDropdown'
import MessengerDropdown from '../MessengerDropdown'
import Notification from '../Notification'

function AdminHeader() {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn)
  return (
    <div className='flex h-16 w-full items-center justify-end bg-orange-3 px-10'>
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
