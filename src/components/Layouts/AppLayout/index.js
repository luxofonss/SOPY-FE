import Header from '../components/Header'

function AppLayout({ children }) {
  return (
    <div className='flex-col flex'>
      <Header />
      <div className='mt-24'>{children}</div>
    </div>
  )
}

export default AppLayout
