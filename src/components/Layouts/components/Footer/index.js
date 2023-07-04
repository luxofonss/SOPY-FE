'use client'

import notice from '../../../../assets/images/notice.png'
import register from '../../../../assets/images/register.png'

function AppFooter() {
  return (
    <div className='container mx-auto p-8 '>
      <div className='grid grid-cols-4 gap-6'>
        <div>
          <div className='text-neutral-700 font-semibold text-sm'>CHĂM SÓC KHÁCH HÀNG</div>
          <div className='text-neutral-500 text-xs'>Trung Tâm Trợ Giúp</div>
          <div className='text-neutral-500 text-xs'>Sopy Blog</div>
          <div className='text-neutral-500 text-xs'>Sopy Mall</div>
          <div className='text-neutral-500 text-xs'>Hướng Dẫn Mua Hàng</div>
          <div className='text-neutral-500 text-xs'>Hướng Dẫn Bán Hàng</div>
          <div className='text-neutral-500 text-xs'>Thanh Toán</div>
          <div className='text-neutral-500 text-xs'>Sopy Xu</div>
          <div className='text-neutral-500 text-xs'>Vận Chuyển</div>
          <div className='text-neutral-500 text-xs'>Trả Hàng & Hoàn Tiền</div>
          <div className='text-neutral-500 text-xs'>Chăm Sóc Khách Hàng</div>
          <div className='text-neutral-500 text-xs'>Chính Sách Bảo Hành</div>
        </div>
        <div>
          <div className='text-neutral-700 font-semibold text-sm'>VỀ SOPY</div>
          <div className='text-neutral-500 text-xs'>Giới Thiệu Về Sopy Việt Nam</div>
          <div className='text-neutral-500 text-xs'>Tuyển Dụng</div>
          <div className='text-neutral-500 text-xs'>Điều Khoản Sopy</div>
          <div className='text-neutral-500 text-xs'>Chính Sách Bảo Mật</div>
          <div className='text-neutral-500 text-xs'>Chính Hãng</div>
          <div className='text-neutral-500 text-xs'>Kênh Người Bán</div>
          <div className='text-neutral-500 text-xs'>Chương Trình Tiếp Thị Liên Kết Sopy</div>
          <div className='text-neutral-500 text-xs'>Flash Sales</div>
          <div className='text-neutral-500 text-xs'>Liên Hệ Với Truyền Thông</div>
        </div>
        <div>
          <div className='text-neutral-700 font-semibold text-sm'>THEO DÕI CHÚNG TÔI TRÊN</div>
          <div className='text-neutral-500 text-xs'>Facebook</div>
          <div className='text-neutral-500 text-xs'>Instagram</div>
          <div className='text-neutral-500 text-xs'>LinkedIn</div>
        </div>
        <div>
          <div className='text-neutral-700 font-semibold text-sm'>CHỨNG NHẬN</div>
          <div className='text-neutral-500 text-xs'>
            <img src={notice} className='w-full' alt='notice' />
          </div>
          <div className='text-neutral-500 text-xs'>
            <img src={register} className='w-full' alt='register' />
          </div>
        </div>
      </div>
    </div>
  )
}

export default AppFooter
