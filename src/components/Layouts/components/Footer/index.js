'use client'

import notice from '../../../../assets/images/notice.png'
import register from '../../../../assets/images/register.png'

function AppFooter() {
  return (
    <div className='container mx-auto p-8 '>
      <div className='grid grid-cols-4 gap-6'>
        <div>
          <div className='text-sm font-semibold text-neutral-700'>CHĂM SÓC KHÁCH HÀNG</div>
          <div className='text-xs text-neutral-500'>Trung Tâm Trợ Giúp</div>
          <div className='text-xs text-neutral-500'>Sopy Blog</div>
          <div className='text-xs text-neutral-500'>Sopy Mall</div>
          <div className='text-xs text-neutral-500'>Hướng Dẫn Mua Hàng</div>
          <div className='text-xs text-neutral-500'>Hướng Dẫn Bán Hàng</div>
          <div className='text-xs text-neutral-500'>Thanh Toán</div>
          <div className='text-xs text-neutral-500'>Sopy Xu</div>
          <div className='text-xs text-neutral-500'>Vận Chuyển</div>
          <div className='text-xs text-neutral-500'>Trả Hàng & Hoàn Tiền</div>
          <div className='text-xs text-neutral-500'>Chăm Sóc Khách Hàng</div>
          <div className='text-xs text-neutral-500'>Chính Sách Bảo Hành</div>
        </div>
        <div>
          <div className='text-sm font-semibold text-neutral-700'>VỀ SOPY</div>
          <div className='text-xs text-neutral-500'>Giới Thiệu Về Sopy Việt Nam</div>
          <div className='text-xs text-neutral-500'>Tuyển Dụng</div>
          <div className='text-xs text-neutral-500'>Điều Khoản Sopy</div>
          <div className='text-xs text-neutral-500'>Chính Sách Bảo Mật</div>
          <div className='text-xs text-neutral-500'>Chính Hãng</div>
          <div className='text-xs text-neutral-500'>Kênh Người Bán</div>
          <div className='text-xs text-neutral-500'>Chương Trình Tiếp Thị Liên Kết Sopy</div>
          <div className='text-xs text-neutral-500'>Flash Sales</div>
          <div className='text-xs text-neutral-500'>Liên Hệ Với Truyền Thông</div>
        </div>
        <div>
          <div className='text-sm font-semibold text-neutral-700'>THEO DÕI CHÚNG TÔI TRÊN</div>
          <div className='text-xs text-neutral-500'>Facebook</div>
          <div className='text-xs text-neutral-500'>Instagram</div>
          <div className='text-xs text-neutral-500'>LinkedIn</div>
        </div>
        <div>
          <div className='text-sm font-semibold text-neutral-700'>CHỨNG NHẬN</div>
          <div className='text-xs text-neutral-500'>
            <img src={notice} className='w-full' alt='notice' />
          </div>
          <div className='text-xs text-neutral-500'>
            <img src={register} className='w-full' alt='register' />
          </div>
        </div>
      </div>
    </div>
  )
}

export default AppFooter
