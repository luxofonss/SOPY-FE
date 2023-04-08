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

function Login() {
  const [open, setOpen] = useState(false)
  const [loginRequest, { isLoading }] = useLoginMutation()
  const auth = useSelector((state) => state.auth)
  const navigate = useNavigate()
  const dispatch = useDispatch()

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
    const googleLoginUrl = 'http://localhost:8080/v1/api/auth/google'
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
    <div className='flex h-screen items-center justify-center rounded bg-slate-400'>
      <AppForm className='h-auto w-96 rounded-lg bg-purple-700 px-4 py-8' onSubmit={onSubmit}>
        <h3 className='bold text-center text-2xl text-white'>Login</h3>
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
          {!isLoading ? 'Submit' : <BeatLoader size={12} color='#36d7b7' />}
        </AppButton>
        <AppButton className='my-4' type='button' onClick={handleGoogleLogin}>
          Login with Google
        </AppButton>
      </AppForm>
    </div>
  )
}

export default Login
