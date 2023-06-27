import Header from '../components/Header'

function AppLayout({ children }) {
  return (
    <div className='flex-col flex'>
      <Header />
      <div className='pt-24 min-h-screen bg-page-bg'>{children}</div>
    </div>
  )
}

export default AppLayout
