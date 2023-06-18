import { FacebookLogo, GoogleLogo, IconEye, IconEyeSlash } from '@src/assets/svgs'
import AppButton from '@src/components/AppButton'
import AppDateInput from '@src/components/Form/AppDateInput'
import AppForm from '@src/components/Form/AppForm'
import AppInput from '@src/components/Form/AppInput'
import { getEmailValidationRegex } from '@src/helpers/validator'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import { Link } from 'react-router-dom'
import { BeatLoader } from 'react-spinners'
import { toast } from 'react-toastify'
import { useSignupMutation } from '../authService'
import { login, setUser } from '../authSlice'

function Signup() {
  const [open, setOpen] = useState(false)
  const [signup, { isLoading }] = useSignupMutation()
  const auth = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    if (auth.isLoggedIn) {
      navigate('/')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth.isLoggedIn])

  const onSubmit = async (data) => {
    const response = await signup(data)
    if (!response.error) {
      dispatch(setUser(response.data.metadata.user))
      dispatch(login())
    } else {
      toast.error(response.error?.data?.message?.error || 'Có lỗi xảy ra, vui lòng thử lại!')
    }
  }

  const toggleEyeIcon = () => {
    setOpen(!open)
  }
  return (
    <div className='container mx-auto px-10 my-6'>
      <h3 className='bold text-start text-2xl text-neutral-600'>Đăng ký</h3>

      <div className='px-14 py-8 bg-white shadow-md shadow-neutral-200 rounded-md mt-4'>
        <AppForm className='grid grid-cols-12 gap-14 h-auto w-full rounded-lg' onSubmit={onSubmit}>
          <div className='col-span-6 '>
            <AppInput id='name' name='name' required label='Họ và tên' />
            <AppInput
              validate={{ pattern: { value: getEmailValidationRegex(), message: 'Email không hợp lệ!' } }}
              type='email'
              placeholder='Email'
              name='email'
              label='Email'
              required
              className='mb-2'
            />
            <AppInput
              type={open ? 'text' : 'password'}
              placeholder='Mật khẩu'
              name='password'
              label='Mật khẩu'
              required
              showIcon
              Icon={open ? <IconEye onClick={toggleEyeIcon} /> : <IconEyeSlash onClick={toggleEyeIcon} />}
            />
            <AppInput id='phoneNumber' name='phoneNumber' type='number' required label='Số điện thoại' />
            <AppInput id='address' name='address' type='text' required label='Địa chỉ' />
          </div>
          <div className='col-span-6 '>
            <AppDateInput id='dateOfBirth' name='dateOfBirth' required label='Ngày sinh' />
            <p className='text-xs text-neutral-400'>
              Tôi đã đọc và đồng ý với Điều Khoản Sử Dụng và Chính Sách Bảo Mật của Lazada của Lazada, bao gồm quyền thu
              thập, sử dụng, và tiết lộ dữ liệu cá nhân của tôi theo pháp luật quy định.
            </p>
            <AppButton disabled={isLoading} className='mt-6 w-full' formNoValidate type='submit'>
              {!isLoading ? 'Submit' : <BeatLoader size={12} color='#36d7b7' />}
            </AppButton>
            <h4 className='font-medium text-neutral-500 mt-4'>Hoặc đăng ký với</h4>
            <Link
              className='w-full mt-4 flex justify-center items-center gap-6 h-12 rounded-md bg-neutral-200 hover:opacity-95 hover:translate-y-[1px] transition cursor-pointer'
              to='/'
            >
              <GoogleLogo />
              <p className='text-neutral-500 font-medium'>Đăng ký với Google</p>
            </Link>
            <Link
              className='w-full mt-4 flex justify-center items-center gap-6 h-12 rounded-md bg-neutral-200 hover:opacity-95 hover:translate-y-[1px] transition cursor-pointer'
              to='/'
            >
              <FacebookLogo />
              <p className='text-neutral-500 font-medium'>Đăng ký với Facebook</p>
            </Link>
          </div>
        </AppForm>
      </div>
    </div>
  )
}

export default Signup
