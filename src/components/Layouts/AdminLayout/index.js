import AdminHeader from '../components/AdminHeader'
import AdminSider from '../components/AdminSider'

function AdminLayout({ children }) {
  return (
    <div className='flex-col flex font-inter'>
      <div className='grid grid-cols-12'>
        <div className='col-span-2'>
          <AdminSider />
        </div>
        <div className='col-span-10'>
          <AdminHeader />
          <div className='p-8 bg-neutral-200'>{children}</div>
        </div>
      </div>
    </div>
  )
}

export default AdminLayout
