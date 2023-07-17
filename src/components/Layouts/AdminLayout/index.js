import AdminHeader from '../components/AdminHeader'
import AdminSider from '../components/AdminSider'

function AdminLayout({ children }) {
  return (
    <div className='flex min-h-screen flex-col font-inter'>
      <div className='grid grid-cols-12'>
        <div className='col-span-2'>
          <AdminSider />
        </div>
        <div className='col-span-10 min-h-screen'>
          <AdminHeader />
          <div className='h-[calc(100%_-_64px)] bg-neutral-200 p-8'>{children}</div>
        </div>
      </div>
    </div>
  )
}

export default AdminLayout
