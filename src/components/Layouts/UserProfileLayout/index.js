import Header from '../components/Header'
import UserSider from '../components/UserSider'

function UserProfileLayout({ children }) {
  return (
    <div className='font-inter bg-neutral-200'>
      <Header />
      <div className='container min-h-screen pt-28 mx-auto grid grid-cols-12 gap-12'>
        <div className='col-span-3 '>
          <UserSider />
        </div>
        <div className='col-span-9 '>{children}</div>
      </div>
    </div>
  )
}

export default UserProfileLayout
