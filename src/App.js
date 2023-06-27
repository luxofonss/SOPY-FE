/* eslint-disable react-hooks/exhaustive-deps */
import { Suspense } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { PersistGate } from 'redux-persist/integration/react'
import './App.css'
import { persistor } from './redux/store'
import { WebRoutes } from './routes'
import { history } from './utils/history'

const App = () => {
  return (
    <PersistGate loading={null} persistor={persistor}>
      <ToastContainer style={{ marginTop: '86px' }} />
      <Suspense fallback={<div>Loading...</div>}>
        <BrowserRouter history={history}>
          <WebRoutes />
        </BrowserRouter>
      </Suspense>
    </PersistGate>
  )
}

export default App
