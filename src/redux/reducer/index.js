import { combineReducers } from 'redux'
import todoReducer from '@src/containers/app/feature/Customer/pages/Todo/todoSlice'
import authReducer from '@src/containers/authentication/feature/Auth/authSlice'
import { todoApi } from '@src/containers/app/feature/Customer/pages/Todo/todo.services'
import { authApi } from '@src/containers/authentication/feature/Auth/authService'

export const rootReducer = combineReducers({
  todo: todoReducer,
  auth: authReducer,
  [todoApi.reducerPath]: todoApi.reducer,
  authApi: authApi.reducer
})
