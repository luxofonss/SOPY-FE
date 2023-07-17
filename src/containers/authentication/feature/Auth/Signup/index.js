import { useContext, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import * as yup from 'yup'

import { FacebookLogo, GoogleLogo, IconEye, IconEyeSlash } from '@src/assets/svgs'
import AppButton from '@src/components/AppButton'
import AppDateInput from '@src/components/Form/AppDateInput'
import AppForm from '@src/components/Form/AppForm'
import AppInput from '@src/components/Form/AppInput'
import { useSignupMutation } from '../authService'
import { login, setUser } from '../authSlice'
import { SocketContext } from '@src/context/socket.context'
import { getEmailValidationRegex, phoneRegExp } from '@src/helpers/validator'

const signupForm = yup.object({
  name: yup.string().required('Bạn chưa nhập tên'),
  email: yup.string().email('Email không hợp lệ').required('Bạn chưa nhập email'),
  password: yup
    .string()
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
    .max(32, 'Mật khẩu có tối đa 32 ký tự')
    .required('Bạn chưa nhập mật khẩu'),
  phoneNumber: yup.string().matches(phoneRegExp, 'Số điện thoại không hợp lệ').required('Bạn chưa nhập số điện thoại'),
  address: yup.string().required('Bạn chưa nhập địa chỉ'),
  dateOfBirth: yup.string()
})

function Signup() {
  const [open, setOpen] = useState(false)
  const [signup, { isLoading }] = useSignupMutation()
  const auth = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const socket = useContext(SocketContext)

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
      socket.emit('newConnection', response.data.metadata.user._id)
      dispatch(login())
    } else {
      toast.error(response.error?.data?.message?.error || 'Có lỗi xảy ra, vui lòng thử lại!')
    }
  }

  const toggleEyeIcon = () => {
    setOpen(!open)
  }
  return (
    <div className='container mx-auto my-6 md:px-10 lg:px-16'>
      <h3 className='bold text-start text-2xl text-neutral-600'>Đăng ký</h3>

      <div className='mt-4 rounded-md bg-white px-14 py-8 shadow-md shadow-neutral-200'>
        <AppForm
          className='grid h-auto w-full grid-cols-12 gap-14 rounded-lg'
          resolver={signupForm}
          onSubmit={onSubmit}
        >
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
              Tôi đã đọc và đồng ý với Điều Khoản Sử Dụng và Chính Sách Bảo Mật của sopy\\\ của Lazada, bao gồm quyền
              thu thập, sử dụng, và tiết lộ dữ liệu cá nhân của tôi theo pháp luật quy định.
            </p>
            <AppButton disabled={isLoading} isLoading={isLoading} className='mt-6 w-full' formNoValidate type='submit'>
              Đăng ký
            </AppButton>
            <h4 className='mt-4 font-medium text-neutral-500'>Hoặc đăng ký với</h4>
            <Link
              className='mt-4 flex h-12 w-full cursor-pointer items-center justify-center gap-6 rounded-md bg-neutral-200 transition hover:translate-y-[1px] hover:opacity-95'
              to='/'
            >
              <GoogleLogo />
              <p className='font-medium text-neutral-500'>Đăng ký với Google</p>
            </Link>
            <Link
              className='mt-4 flex h-12 w-full cursor-pointer items-center justify-center gap-6 rounded-md bg-neutral-200 transition hover:translate-y-[1px] hover:opacity-95'
              to='/'
            >
              <FacebookLogo />
              <p className='font-medium text-neutral-500'>Đăng ký với Facebook</p>
            </Link>
          </div>
        </AppForm>
        <div className='text-sm'>
          Đã có tài khoản?{' '}
          <Link className='font-medium' to='/login'>
            Đăng nhập
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Signup
