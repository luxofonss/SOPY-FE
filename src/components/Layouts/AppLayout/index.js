import AppFooter from '../components/Footer'
import Header from '../components/Header'

function AppLayout({ hasFooter = true, children }) {
  return (
    <div className='flex-col flex'>
      <Header />
      <div className='pt-28 pb-8 min-h-screen bg-page-bg'>{children}</div>
      {hasFooter && (
        <div>
          <AppFooter />
        </div>
      )}
    </div>
  )
}

export default AppLayout
