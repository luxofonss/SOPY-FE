import AppForm from '@src/components/Form/AppForm'
import AppInput from '@src/components/Form/AppInput'
import ImageCrop from '@src/components/ImageCrop'
import { authApi } from '@src/containers/authentication/feature/Auth/authService'
import { setUser } from '@src/containers/authentication/feature/Auth/authSlice'
import appApi from '@src/redux/service'
import { Divider } from 'antd'
import { useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import customerApi from '../../../Customer/customer.service'
import AppButton from '@src/components/AppButton'
import { useTitle } from '@src/hooks/useTitle'

function Profile() {
  const dispatch = useDispatch()
  const openAvatarRef = useRef()
  const closeModalRef = useRef()

  const userInfo = useSelector((state) => state.auth.user)
  const [updateAvatar] = customerApi.endpoints.updateAvatar.useMutation()

  const [updateUser, { isLoading: isUpdating }] = appApi.endpoints.updateUserInfo.useMutation()
  const [getProfile] = authApi.endpoints.getProfile.useLazyQuery()

  useTitle('Trang cá nhân người bán')

  const handleUpdateAvatar = async (file) => {
    const updateData = new FormData()
    updateData.append('avatar', file)
    const response = await updateAvatar(updateData)

    if (response.error) {
      toast.error(response.error.data.message)
    } else {
      toast.success('Đã cập nhật ảnh đại diện')
      const profile = await getProfile()
      if (!profile.error) dispatch(setUser(profile.data.metadata.user))
    }
  }

  const handleUpdateShop = async (data) => {
    const response = await updateUser(data)
    if (response.error) {
      toast.error(response.error.data.message)
    } else {
      toast.success('Đã cập nhật thông tin shop')
      const profile = await getProfile()
      if (!profile.error) dispatch(setUser(profile.data.metadata.user))
    }
  }

  return (
    <div className='rounded-lg bg-neutral-0 p-4'>
      <div>
        <h4 className='text-lg font-semibold text-neutral-700'>Hồ sơ shop</h4>
        <p className='text-sm font-medium text-neutral-500'>Quản lý thông tin hồ sơ để bảo mật tài khoản</p>
      </div>
      <Divider />
      <div className='relative w-14'>
        <img className='h-16 w-16 rounded-md' src={userInfo?.avatar} alt='avatar' />
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
      <AppForm onSubmit={handleUpdateShop}>
        <AppInput
          type='text'
          id='name-profile'
          name='shopInfo.shopName'
          label='Tên shop'
          defaultValue={userInfo.shopInfo?.shopName}
        />
        <AppInput
          type='text'
          id='description-profile'
          name='shopInfo.description'
          label='Mô tả'
          defaultValue={userInfo.shopInfo?.description}
        />
        <AppInput
          type='text'
          id='address-profile'
          name='shopInfo.address'
          label='Địa chỉ'
          defaultValue={userInfo.shopInfo?.address}
        />
        <AppInput
          type='text'
          id='phoneNumber-profile'
          name='shopInfo.phoneNumber'
          label='Mô tả'
          defaultValue={userInfo.shopInfo?.phoneNumber}
        />
        <AppInput id='phone-profile' name='shopInfo.phoneNumber' label='Số điện thoại' defaultValue={userInfo?.phone} />
        <AppButton isLoading={isUpdating} type='submit'>
          Update
        </AppButton>
      </AppForm>
    </div>
  )
}

export default Profile
