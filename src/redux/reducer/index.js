import { adminApi } from '@src/containers/app/feature/Admin/adminService'
import customerApi from '@src/containers/app/feature/Customer/customer.service'
import { authApi } from '@src/containers/authentication/feature/Auth/authService'
import authReducer from '@src/containers/authentication/feature/Auth/authSlice'
import customerReducer from '@src/containers/app/feature/Customer/customer.slice'
import { combineReducers } from 'redux'
import appApi from '../service'

export const rootReducer = combineReducers({
  auth: authReducer,
  customer: customerReducer,
  authApi: authApi.reducer,
  adminApi: adminApi.reducer,
  customerApi: customerApi.reducer,
  appApi: appApi.reducer
})
