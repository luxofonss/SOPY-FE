import { createSlice } from '@reduxjs/toolkit'
import Cookies from 'universal-cookie/cjs/Cookies'

const cookies = new Cookies()

const initialState = {
  user: {
    address: '',
    avatar: '',
    firstName: '',
    lastName: '',
    name: '',
    id: '',
    email: '',
    phoneNumber: '',
    gender: '',
    role: ''
  }
}

export const authSlice = createSlice({
  name: 'auth',
  initialState: initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload
    },
    logOut: (state) => {
      cookies.remove('access_token')
      state.user = {}
    }
  }
})

export const { setUser, logOut } = authSlice.actions

export default authSlice.reducer
