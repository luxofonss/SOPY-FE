import { IconEye, IconEyeSlash } from '@src/assets/svgs'
import AppButton from '@src/components/AppButton'
import AppForm from '@src/components/Form/AppForm'
import AppInput from '@src/components/Form/AppInput'
import { getEmailValidationRegex } from '@src/helpers/validator'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import { BeatLoader } from 'react-spinners'
import { useSignupMutation } from '../authService'
import { setUser } from '../authSlice'

function Signup() {
  const [open, setOpen] = useState(false)
  const [signup, { isLoading }] = useSignupMutation()
  const user = useSelector((state) => state.auth.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    console.log('user: ', user)
    console.log('user login page: ' + user?.roles)

    if (user.roles && user?.roles !== []) {
      navigate('/')
    }
  }, [navigate, user])

  const onSubmit = async (data) => {
    const response = await signup(data)
    console.log('response', response)
    dispatch(setUser({ ...response.data.metadata.shop, isLogin: true }))
    navigate('/product')
  }

  const toggleEyeIcon = () => {
    setOpen(!open)
  }
  return (
    <div className='flex h-screen items-center justify-center rounded bg-slate-400'>
      <AppForm className='h-auto w-96 rounded-lg bg-purple-700 px-4 py-8' onSubmit={onSubmit}>
        <h3 className='bold text-center text-2xl text-white'>Sign up</h3>
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

export default Signup
