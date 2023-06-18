import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  cart: null
}

export const customerSlice = createSlice({
  name: 'customer',
  initialState: initialState,
  reducers: {
    setCart: (state, action) => {
      const newCart = action.payload
      state.cart = newCart
    }
  }
})

export const { setCart } = customerSlice.actions

export default customerSlice.reducer
