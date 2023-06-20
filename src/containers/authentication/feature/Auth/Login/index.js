/* eslint-disable no-undef */
import { FacebookLogo, GoogleLogo, IconEye, IconEyeSlash } from '@src/assets/svgs'
import AppButton from '@src/components/AppButton'
import AppForm from '@src/components/Form/AppForm'
import AppInput from '@src/components/Form/AppInput'
import { getEmailValidationRegex } from '@src/helpers/validator'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import { BeatLoader } from 'react-spinners'
import { toast } from 'react-toastify'
import * as yup from 'yup'
import { useLoginMutation } from '../authService'
import { login, setUser } from '../authSlice'
// import banner from '@src/assets/images/banner.jpg'

function Login() {
  const [open, setOpen] = useState(false)
  const [loginRequest, { isLoading }] = useLoginMutation()
  const auth = useSelector((state) => state.auth)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const loginForm = yup.object({
    email: yup.string().email().required(),
    password: yup.string().min(6).max(32).required()
  })

  useEffect(() => {
    console.log(auth.isLoggedIn)
    if (auth.isLoggedIn) {
      console.log('navigate')
      navigate('/')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth.isLoggedIn])

  const onSubmit = async (loginData) => {
    const response = await loginRequest(loginData)
    console.log('response: ', response)
    if (!response.error) {
      dispatch(setUser(response.data.metadata.user))
      dispatch(login())
    } else {
      toast.warn(response.error?.data?.message || 'Login error, please try again!')
    }
  }

  const toggleEyeIcon = () => {
    setOpen(!open)
  }

  const handleGoogleLogin = async () => {
    let timer = null
    const googleLoginUrl = 'http://localhost:8080/v1/api/auth/login/google'
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
    <div className='container mx-auto lg:px-16 md:px-10 my-6'>
      <h3 className='bold text-start text-2xl text-neutral-600'>Đăng nhập</h3>

      <div className='px-14 py-8 bg-white shadow-md shadow-neutral-200 rounded-md mt-4'>
        <AppForm resolver={loginForm} className='grid grid-cols-12 gap-14 h-auto w-full rounded-lg' onSubmit={onSubmit}>
          <div className='col-span-6 '>
            <AppInput
              validate={{ pattern: { value: getEmailValidationRegex(), message: 'Email is invalid!' } }}
              type='email'
              placeholder='Email'
              name='email'
              label='Email'
              required
              className='mb-2'
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

            <AppButton disabled={isLoading} className='w-full my-4' formNoValidate type='submit'>
              {!isLoading ? 'Login' : <BeatLoader size={12} color='#36d7b7' />}
            </AppButton>
          </div>
          <div className='col-span-6 '>
            <h4 className='font-medium text-neutral-500 mt-4'>Hoặc đăng nhập với</h4>
            <button
              onClick={handleGoogleLogin}
              className='w-full mt-4 flex justify-center items-center gap-6 h-12 rounded-md bg-neutral-200 hover:opacity-95 hover:translate-y-[1px] transition cursor-pointer'
              to='/'
            >
              <GoogleLogo />
              <p className='text-neutral-500 font-medium'>Đăng nhập với Google</p>
            </button>
            <button
              className='w-full mt-4 flex justify-center items-center gap-6 h-12 rounded-md bg-neutral-200 hover:opacity-95 hover:translate-y-[1px] transition cursor-pointer'
              to='/'
            >
              <FacebookLogo />
              <p className='text-neutral-500 font-medium'>Đăng nhập với Facebook</p>
            </button>
          </div>
        </AppForm>
      </div>
    </div>
  )
}

export default Login
