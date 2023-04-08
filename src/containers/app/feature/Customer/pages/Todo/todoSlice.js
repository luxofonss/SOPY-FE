import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

const initialState = {
  todos: []
}

export const fetchTodos = createAsyncThunk(
  'todo/getAll',
  async () => {
    const response = await fetch('https://jsonplaceholder.typicode.com/todos')
    const data = await response.json()
    console.log(data)
    return data
  },
  {
    condition: ({ getState }) => {
      console.log('condition')
      const { todos } = getState()
      console.log('todos', todos)
      const fetchStatus = todos.requests
      if (fetchStatus === 'fulfilled' || fetchStatus === 'loading') {
        console.log('Loading')
        return true
      }
    }
  }
)

export const todoSlice = createSlice({
  name: 'todo',
  initialState,
  reducers: {
    create: (state, action) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.todos.push(action.payload)
    },
    decrement: (state) => {
      state.value -= 1
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchTodos.fulfilled, (state, action) => {
      state.todos.push(...action.payload)
    })
  }
})

// Action creators are generated for each case reducer function
export const { create, decrement } = todoSlice.actions

export default todoSlice.reducer
