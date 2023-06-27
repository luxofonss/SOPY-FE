import { DeliveryIcon, OrderManagementIcon } from '@src/assets/svgs'
import ImageCrop from '@src/components/ImageCrop'
import customerApi from '@src/containers/app/feature/Customer/customer.service'
import { authApi } from '@src/containers/authentication/feature/Auth/authService'
import { setUser } from '@src/containers/authentication/feature/Auth/authSlice'
import { Divider } from 'antd'
import { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'

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
  const userInfo = useSelector((state) => state.auth.user)
  const location = useLocation()
  const closeModalRef = useRef()
  const openAvatarRef = useRef()
  const dispatch = useDispatch()

  const [updateAvatar] = customerApi.endpoints.updateAvatar.useMutation()
  const [getProfile] = authApi.endpoints.getProfile.useLazyQuery()

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

  const handleUpdateAvatar = async (file) => {
    console.log('file:: ', file)
    const updateData = new FormData()
    updateData.append('avatar', file)

    console.log('updateData:: ', updateData)

    const response = await updateAvatar(updateData)

    if (response.error) {
      toast.error(response.error.data.message)
    } else {
      toast.success('Đã cập nhật ảnh đại diện')
      const profile = await getProfile()
      if (!profile.error) dispatch(setUser(profile.data.metadata.user))
    }
  }
  return (
    <div className='p-2 flex flex-col'>
      <div className='flex gap-4'>
        <div className='w-14 relative'>
          <img className='w-14 h-14 rounded-md' src={userInfo?.avatar} alt='avatar' />
          <div
            onClick={() => openAvatarRef.current.openModal()}
            className='w-full h-full absolute flex items-center rounded-lg justify-center top-0 right-0 bg-transparent hover:bg-neutral-400 hover:bg-opacity-20 hover:cursor-pointer'
          ></div>
          <ImageCrop
            openRef={openAvatarRef}
            image={userInfo?.avatar}
            handleConfirm={handleUpdateAvatar}
            closeModalRef={closeModalRef}
          />
        </div>
        <div className='flex flex-col gap-4'>
          <div className='font-medium text-neutral-700 line-clamp-1'>{userInfo?.name}</div>
          <div className='text-xs text-neutral-500 line-clamp-1'>
            {userInfo?.phone ? userInfo?.phone : userInfo?.email}
          </div>
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
