import Header from '../components/Header'

function AppLayout({ children }) {
  return (
    <div className='container 2xl'>
      <div className='grid grid-cols-1'>
        <Header />
      </div>
      {children}
    </div>
  )
}

export default AppLayout
