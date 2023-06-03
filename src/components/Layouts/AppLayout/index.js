import Header from '../components/Header'

function AppLayout({ children }) {
  return (
    <div className='flex-col flex'>
      <Header />
      <div className='mt-16 '>{children}</div>
    </div>
  )
}

export default AppLayout
