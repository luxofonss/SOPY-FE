import AppFooter from '../components/Footer'
import Header from '../components/Header'

function AppLayout({ hasFooter = true, children }) {
  return (
    <div className='flex flex-col'>
      <Header />
      <div className='min-h-screen bg-page-bg pt-28 pb-8'>{children}</div>
      {hasFooter && (
        <div>
          <AppFooter />
        </div>
      )}
    </div>
  )
}

export default AppLayout
