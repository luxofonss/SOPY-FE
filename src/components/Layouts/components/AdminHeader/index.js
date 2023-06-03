import { MessageIcon, NotifyIcon } from '@src/assets/svgs'

function AdminHeader() {
  return (
    <div className='w-full bg-neutral-100 h-16 flex justify-end items-center px-10'>
      <div className='flex gap-3'>
        <div className='w-9 h-9 flex items-center justify-center rounded-md hover:bg-secondary-blue cursor-pointer'>
          <MessageIcon />
        </div>
        <div className='w-9 h-9 flex items-center justify-center rounded-md hover:bg-secondary-blue cursor-pointer'>
          <NotifyIcon />
        </div>
        <div>
          <img
            width={36}
            height={36}
            src='https://yt3.googleusercontent.com/-CFTJHU7fEWb7BYEb6Jh9gm1EpetvVGQqtof0Rbh-VQRIznYYKJxCaqv_9HeBcmJmIsp2vOO9JU=s900-c-k-c0x00ffffff-no-rj'
            alt='avatar'
          />
        </div>
      </div>
    </div>
  )
}

export default AdminHeader
