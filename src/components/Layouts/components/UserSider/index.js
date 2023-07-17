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
    <div className='flex flex-col p-2'>
      <div className='flex gap-4'>
        <div className='relative w-14'>
          <img className='h-14 w-14 rounded-md' src={userInfo?.avatar} alt='avatar' />
          <div
            onClick={() => openAvatarRef.current.openModal()}
            className='absolute top-0 right-0 flex h-full w-full items-center justify-center rounded-lg bg-transparent hover:cursor-pointer hover:bg-neutral-400 hover:bg-opacity-20'
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
                    ? 'rounded-xl bg-neutral-300 text-neutral-700 shadow-menu-item hover:bg-neutral-200'
                    : 'hover:bg-neutral-200'
                } text-md mb-2 flex h-10 w-full cursor-pointer items-center gap-3 px-3 font-semibold`}
              >
                <div>{menu.icon}</div>
                <div className='text-[15px] font-semibold leading-6 text-neutral-400'>{menu.title}</div>
              </Link>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default UserSider
