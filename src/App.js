import { Suspense } from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import './App.css'
import store, { persistor } from './redux/store'
import { AppRoutes } from './routes'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { PersistGate } from 'redux-persist/integration/react'

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ToastContainer />
        <Suspense fallback={<div>Loading...</div>}>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </Suspense>
      </PersistGate>
    </Provider>
  )
}

export default App
