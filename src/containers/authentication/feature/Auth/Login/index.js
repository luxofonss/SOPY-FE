/* eslint-disable no-undef */
import { IconEye, IconEyeSlash } from '@src/assets/svgs'
import AppButton from '@src/components/AppButton'
import AppForm from '@src/components/Form/AppForm'
import AppInput from '@src/components/Form/AppInput'
import { getEmailValidationRegex } from '@src/helpers/validator'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import { BeatLoader } from 'react-spinners'
import { toast } from 'react-toastify'
import { useLoginMutation } from '../authService'
import { login, setUser } from '../authSlice'
import auth_bg from '@src/assets/images/auth_bg.jpg'
import * as yup from 'yup'
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
    <div
      style={{ backgroundImage: `url("${auth_bg}")` }}
      className='flex h-screen items-center justify-center rounded bg-zinc-200'
    >
      <div className='flex bg-violet-400 shadow-md shadow-violet-300 bg-opacity-75 rounded-md items-center'>
        <div className='w-96 h-full bg-red-400'>
          {/* <img height={400} src={banner} alt='banner' className='w-full h-full object-contain' /> */}
        </div>
        <AppForm resolver={loginForm} className='h-auto w-96 rounded-r-md  bg-slate-500 px-8 py-16' onSubmit={onSubmit}>
          <h3 className='bold text-center text-2xl text-white'>Welcome back</h3>
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
          <AppButton disabled={isLoading} className='my-4' formNoValidate type='submit'>
            {!isLoading ? 'Login' : <BeatLoader size={12} color='#36d7b7' />}
          </AppButton>
          <AppButton className='my-4' type='button' onClick={handleGoogleLogin}>
            Login with Google
          </AppButton>
        </AppForm>
      </div>
    </div>
  )
}

export default Login
