import Header from '../components/Header'
import UserSider from '../components/UserSider'

function UserProfileLayout({ children }) {
  return (
    <div className='bg-neutral-200 font-inter'>
      <Header />
      <div className='container mx-auto grid min-h-screen grid-cols-12 gap-12 pt-28'>
        <div className='col-span-3 '>
          <UserSider />
        </div>
        <div className='col-span-9 '>{children}</div>
      </div>
    </div>
  )
}

export default UserProfileLayout
