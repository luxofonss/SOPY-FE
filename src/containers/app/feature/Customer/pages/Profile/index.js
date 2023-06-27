import { PlusCircleIcon, TrashIcon } from '@heroicons/react/20/solid'
import AppForm from '@src/components/Form/AppForm'
import AppInput from '@src/components/Form/AppInput'
import { authApi } from '@src/containers/authentication/feature/Auth/authService'
import { setUser } from '@src/containers/authentication/feature/Auth/authSlice'
import appApi from '@src/redux/service'
import { Divider } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { BeatLoader } from 'react-spinners'
import { toast } from 'react-toastify'

function Profile() {
  const dispatch = useDispatch()

  const userInfo = useSelector((state) => state.auth.user)

  const [updateUser, { isLoading: isUpdating }] = appApi.endpoints.updateUserInfo.useMutation()
  const [getProfile] = authApi.endpoints.getProfile.useLazyQuery()

  const onAddAddress = async (data) => {
    const response = await updateUser({ address: [data.address] })
    if (response.error) {
      toast.error(response.error.data.message)
    } else {
      const profile = await getProfile()
      if (!profile.error) dispatch(setUser(profile.data.metadata.user))
      toast.success('Cập nhật địa chỉ thành công')
    }
  }

  return (
    <div className='p-4 rounded-lg bg-neutral-0'>
      <div>
        <h4 className='text-lg text-neutral-700 font-semibold'>Hồ sơ của tôi</h4>
        <p className='text-sm font-medium text-neutral-500'>Quản lý thông tin hồ sơ để bảo mật tài khoản</p>
      </div>
      <Divider />
      <AppForm>
        <AppInput type='text' id='name-profile' name='name' label='Tên' defaultValue={userInfo.name} />
        <AppInput type='email' id='email-profile' name='email' label='Email' defaultValue={userInfo.email} />
        <AppInput id='phone-profile' name='phoneNumber' label='Số điện thoại' defaultValue={userInfo?.phone} />
      </AppForm>

      <div className='mb-1.5 font-medium block w-full text-sm text-neutral-500'>Địa chỉ</div>
      {userInfo?.address?.map((address) => {
        return (
          <div
            key={address}
            className={` w-full h-8 border-[1px] border-neutral-300 flex items-center justify-between px-4 hover:opacity-90`}
          >
            <p>{address}</p>
            <TrashIcon className='cursor-pointer w-4 h-4' />
          </div>
        )
      })}
      <AppForm onSubmit={onAddAddress}>
        <div className='flex items-center gap-4 text-start'>
          <AppInput label='Địa chỉ mới' name='address' required placeholder='Địa chỉ mới' />
          <button
            className='flex items-end justify-center border-none outline-none'
            type='submit'
            disabled={isUpdating}
          >
            {isUpdating ? <BeatLoader size={12} color='#ff4d00' /> : <PlusCircleIcon className='w-6 h-6' />}
          </button>
        </div>
      </AppForm>
    </div>
  )
}

export default Profile
