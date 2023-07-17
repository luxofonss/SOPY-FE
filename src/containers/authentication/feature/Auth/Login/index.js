/* eslint-disable no-undef */
import { useContext, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import * as yup from 'yup'

import { FacebookLogo, GoogleLogo, IconEye, IconEyeSlash } from '@src/assets/svgs'
import AppButton from '@src/components/AppButton'
import AppForm from '@src/components/Form/AppForm'
import AppInput from '@src/components/Form/AppInput'
import { SocketContext } from '@src/context/socket.context'
import { getEmailValidationRegex } from '@src/helpers/validator'
import { useLoginMutation } from '../authService'
import { login, setUser } from '../authSlice'

const loginForm = yup.object({
  email: yup.string().email('Email không hợp lệ').required('Bạn chưa nhập email'),
  password: yup
    .string()
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
    .max(32, 'Mật khẩu có tối đa 32 ký tự')
    .required('Bạn chưa nhập mật khẩu')
})

function Login() {
  const [open, setOpen] = useState(false)
  const [loginRequest, { isLoading }] = useLoginMutation()
  const auth = useSelector((state) => state.auth)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const socket = useContext(SocketContext)

  useEffect(() => {
    if (auth.isLoggedIn) {
      navigate('/')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth.isLoggedIn])

  const onSubmit = async (loginData) => {
    const response = await loginRequest(loginData)
    if (!response.error) {
      dispatch(setUser(response.data.metadata.user))
      socket.emit('newConnection', response.data.metadata.user._id)
      dispatch(login())
    } else {
      toast.error(response.error?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại sau!')
    }
  }

  const toggleEyeIcon = () => {
    setOpen(!open)
  }

  const handleGoogleLogin = async () => {
    let timer = null
    // const googleLoginUrl = 'http://localhost:8080/v1/api/auth/login/google'
    const googleLoginUrl = 'https://sopt.onrender.com/v1/api/auth/login/google'
    const newWindow = window.open(googleLoginUrl, '_self')
    if (newWindow) {
      timer = setInterval(() => {
        if (newWindow.closed) {
          console.log('Authentication successful')
          if (timer) {
            clearInterval(timer)
          }
        }
      }, 500)
    }
  }

  return (
    <div className='container mx-auto my-6 md:px-10 lg:px-16'>
      <h3 className='bold text-start text-2xl text-neutral-600'>Đăng nhập</h3>

      <div className='mt-4 rounded-md bg-white px-14 py-8 shadow-md shadow-neutral-200'>
        <AppForm resolver={loginForm} className='grid h-auto w-full grid-cols-12 gap-14 rounded-lg' onSubmit={onSubmit}>
          <div className='col-span-6 '>
            <AppInput
              validate={{ pattern: { value: getEmailValidationRegex(), message: 'Email is invalid!' } }}
              type='email'
              placeholder='Email'
              name='email'
              label='Email'
              required
            />
            <AppInput
              type={open ? 'text' : 'password'}
              placeholder='Password'
              name='password'
              label='Password'
              required
              showIcon
              Icon={open ? <IconEye onClick={toggleEyeIcon} /> : <IconEyeSlash onClick={toggleEyeIcon} />}
            />

            <AppButton disabled={isLoading} isLoading={isLoading} className='my-4 w-full' formNoValidate type='submit'>
              Đăng nhập
            </AppButton>
          </div>
          <div className='col-span-6 '>
            <h4 className='mt-4 font-medium text-neutral-500'>Hoặc đăng nhập với</h4>
            <button
              onClick={handleGoogleLogin}
              className='mt-4 flex h-12 w-full cursor-pointer items-center justify-center gap-6 rounded-md bg-neutral-200 transition hover:translate-y-[1px] hover:opacity-95'
              type='button'
            >
              <GoogleLogo />
              <p className='font-medium text-neutral-500'>Đăng nhập với Google</p>
            </button>
            <button
              className='mt-4 flex h-12 w-full cursor-pointer items-center justify-center gap-6 rounded-md bg-neutral-200 transition hover:translate-y-[1px] hover:opacity-95'
              type='button'
            >
              <FacebookLogo />
              <p className='font-medium text-neutral-500'>Đăng nhập với Facebook</p>
            </button>
          </div>
        </AppForm>
        <div className='text-sm'>
          Chưa có tài khoản?{' '}
          <Link className='font-medium text-neutral-600' to='/signup'>
            Đăng ký ngay
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Login
