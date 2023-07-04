/* eslint-disable no-undef */
import { createSlice } from '@reduxjs/toolkit'
import { disConnectSocket } from '@src/context/socket.context'

const initialState = {
  user: {
    _id: '',
    roles: []
  },
  isLoggedIn: false
}

export const authSlice = createSlice({
  name: 'auth',
  initialState: initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = { ...action.payload }
    },
    login: (state) => {
      state.isLoggedIn = true
    },
    logout: (state) => {
      disConnectSocket(state.user._id)
      // localStorage.removeItem('persist:root')
      state.user = {}
      state.isLoggedIn = false
    }
  }
})

export const { setUser, logout, login } = authSlice.actions

export default authSlice.reducer
