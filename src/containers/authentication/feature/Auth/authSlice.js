import { createSlice } from '@reduxjs/toolkit'
import Cookies from 'universal-cookie/cjs/Cookies'

const cookies = new Cookies()

const initialState = {
  user: {
    _id: '',
    roles: [],
    isLogin: false
  }
}

export const authSlice = createSlice({
  name: 'auth',
  initialState: initialState,
  reducers: {
    setUser: (state, action) => {
      console.log('payload: ', action.payload)
      state.user = { ...action.payload }
    },
    logOut: (state) => {
      cookies.remove('access_token')
      cookies.remove('user_id')
      state.user = {
        isLogin: false
      }
    }
  }
})

export const { setUser, logOut } = authSlice.actions

export default authSlice.reducer
