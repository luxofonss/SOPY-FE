import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  cart: null,
  notifications: null
}

export const customerSlice = createSlice({
  name: 'customer',
  initialState: initialState,
  reducers: {
    setCart: (state, action) => {
      const newCart = action.payload
      state.cart = newCart
    },
    setNotification: (state, action) => {
      state.notifications = action.payload
    }
  }
})

export const { setCart, setNotification } = customerSlice.actions

export default customerSlice.reducer
