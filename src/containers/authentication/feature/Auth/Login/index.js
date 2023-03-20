import { IconEye, IconEyeSlash } from '@src/assets/svgs'
import AppButton from '@src/components/AppButton'
import AppForm from '@src/components/Form/AppForm'
import AppInput from '@src/components/Form/AppInput'
import { getEmailValidationRegex } from '@src/helpers/validator'
import { useLayoutEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import { BeatLoader } from 'react-spinners'
import { useLazyGetProfileQuery, useLoginMutation } from '../authService'
import { setUser } from '../authSlice'

function Login() {
  const [open, setOpen] = useState(false)
  const [login, { isLoading }] = useLoginMutation()
  const user = useSelector((state) => state.auth.user)
  const [getProfile] = useLazyGetProfileQuery()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useLayoutEffect(() => {
    console.log('user: ', user)
    console.log('user login page: ' + user?.role)

    if (user?.role === '0' || user?.role === '1') {
      navigate('/')
    }
  }, [navigate, user])

  const onSubmit = async (data) => {
    try {
      const response = await login(data)
      console.log('response', response)
      const profile = await getProfile(response.data.accessToken)
      dispatch(setUser(profile.data))
      navigate('/product')
    } catch (error) {
      console.log('error: ', error)
    }
  }

  const toggleEyeIcon = () => {
    setOpen(!open)
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
        <AppButton disabled={isLoading} className='mt-4' formNoValidate type='submit'>
          {!isLoading ? 'Submit' : <BeatLoader size={12} color='#36d7b7' />}
        </AppButton>
      </AppForm>
    </div>
  )
}

export default Login
