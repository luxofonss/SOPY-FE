import { PlusCircleIcon, TrashIcon } from '@heroicons/react/20/solid'
import AppForm from '@src/components/Form/AppForm'
import AppInput from '@src/components/Form/AppInput'
import { authApi } from '@src/containers/authentication/feature/Auth/authService'
import { setUser } from '@src/containers/authentication/feature/Auth/authSlice'
import { useTitle } from '@src/hooks/useTitle'
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

  useTitle('Hồ sơ - Sopy')

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
    <div className='rounded-lg bg-neutral-0 p-4'>
      <div>
        <h4 className='text-lg font-semibold text-neutral-700'>Hồ sơ của tôi</h4>
        <p className='text-sm font-medium text-neutral-500'>Quản lý thông tin hồ sơ để bảo mật tài khoản</p>
      </div>
      <Divider />
      <AppForm>
        <AppInput type='text' id='name-profile' name='name' label='Tên' defaultValue={userInfo.name} />
        <AppInput type='email' id='email-profile' name='email' label='Email' defaultValue={userInfo.email} />
        <AppInput id='phone-profile' name='phoneNumber' label='Số điện thoại' defaultValue={userInfo?.phoneNumber} />
      </AppForm>

      <div className='mb-1.5 block w-full text-sm font-medium text-neutral-500'>Địa chỉ</div>
      {userInfo?.address?.map((address) => {
        return (
          <div
            key={address}
            className={` flex h-8 w-full items-center justify-between border-[1px] border-neutral-300 px-4 hover:opacity-90`}
          >
            <p>{address}</p>
            <TrashIcon className='h-4 w-4 cursor-pointer' />
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
            {isUpdating ? <BeatLoader size={12} color='#fff' /> : <PlusCircleIcon className='h-6 w-6' />}
          </button>
        </div>
      </AppForm>
    </div>
  )
}

export default Profile
