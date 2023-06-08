import AppButton from '@src/components/AppButton'
import AppForm from '@src/components/Form/AppForm'
import AppInput from '@src/components/Form/AppInput'
import AppSelect from '@src/components/Form/AppSelect'
import ProductTable from '../../components/ProductTable'

function ProductAll() {
  return (
    <div className=''>
      <div className='bg-neutral-100 p-8 rounded-lg'>
        <AppForm
          onSubmit={(data) => {
            console.log(data)
          }}
        >
          <div className='grid grid-cols-12 gap-x-4'>
            <div className='col-span-2'>
              <AppSelect name='type-pr' label='Loại sản phẩm' />
            </div>
            <div className='col-span-3'>
              <AppInput className='col-span-3' id='keyword' name='keyword' label='Từ khóa' />
            </div>
            <div className='col-span-3'>
              <AppSelect className='col-span-4' name='type' label='Ngành hàng' />
            </div>
            <div className='col-span-4'></div>
            <div className='col-span-2'>
              <AppInput id='min-stock' name='min-stock' label='Kho hàng tôi thiểu' />
            </div>
            <div className='col-span-2'>
              <AppInput id='max-stock' name='max-stock' label='  Kho hàng tôi đa' />
            </div>
            <div className='col-span-2'>
              <AppInput id='min-sale' name='min-sale' label='Doanh số tôi thiểu' />
            </div>
            <div className='col-span-2'>
              <AppInput id='max-sale' name='max-sale' label='  Doanh số tôi đa' />
            </div>
            <div className='flex items-end justify-end py-2'>
              <AppButton type='submit'>Lọc</AppButton>
            </div>
          </div>
        </AppForm>
      </div>

      <div className='bg-neutral-100 p-8 rounded-lg mt-6'>
        <div className='flex justify-between '>
          <div className='flex gap-6 '>
            <div className='w-4 h-7 bg-secondary-purple rounded-sm'></div>
            <div className='text-neutral-500 font-semibold text-xl '>Danh sách sản phẩm</div>
          </div>
          <nav className='flex gap-3'>
            <div className='h-10 px-4 py-2 rounded-lg bg-neutral-300 font-semibold text-neutral-700 hover:bg-neutral-400 transition hover:text-neutral-500 cursor-pointer'>
              Tất cả
            </div>
            <div className='h-10 px-4 py-2 rounded-lg  font-semibold text-neutral-400 hover:bg-neutral-200 transition hover:text-neutral-500 cursor-pointer'>
              Đang hoạt động
            </div>
            <div className='h-10 px-4 py-2 rounded-lg  font-semibold text-neutral-400 hover:bg-neutral-200 transition hover:text-neutral-500 cursor-pointer'>
              Hết hàng
            </div>
            <div className='h-10 px-4 py-2 rounded-lg  font-semibold text-neutral-400 hover:bg-neutral-200 transition hover:text-neutral-500 cursor-pointer'>
              Đã ẩn
            </div>
          </nav>
        </div>
        <div className='mt-6'>
          <ProductTable />
        </div>
      </div>
    </div>
  )
}

export default ProductAll
