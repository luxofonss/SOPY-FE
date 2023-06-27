import Header from '../components/Header'

function AppLayout({ children }) {
  return (
    <div className='flex-col flex'>
      <Header />
      <div className='pt-24 bg-page-bg'>{children}</div>
    </div>
  )
}

export default AppLayout
