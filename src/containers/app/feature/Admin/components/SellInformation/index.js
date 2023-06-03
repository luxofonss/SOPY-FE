import AppButton from '@src/components/AppButton'
import AppForm from '@src/components/Form/AppForm'
import AppInput from '@src/components/Form/AppInput'

function SellInformation() {
  return (
    <div>
      <div>
        <h4>Phân loại hàng</h4>
        <div>
          <AppForm onSubmit={() => {}}>
            <div className='gap-6 grid grid-cols-12'>
              <div className='col-span-2'>Nhóm phân loại 1</div>
              <div className='col-span-5'>
                <AppInput id='variation1' name='variation1' required placeholder='ví dụ: màu sắc vv' />
              </div>
            </div>
            <div className='gap-6 grid grid-cols-12'>
              <div className='col-span-2'>Phân loại hàng</div>
              <div className='col-span-10 grid grid-cols-2 gap-x-8'>
                <AppInput id='variation1[0]' name='variation1[0]' required placeholder='ví dụ: Trăng, đỏ vv' />
                <AppInput id='variation1[1]' name='variation1[1]' required placeholder='ví dụ: Trăng, đỏ vv' />
                <AppInput id='variation1[2]' name='variation1[2]' required placeholder='ví dụ: Trăng, đỏ vv' />
                <AppInput id='variation1[3]' name='variation1[3]' required placeholder='ví dụ: Trăng, đỏ vv' />
              </div>
            </div>
          </AppForm>
        </div>
      </div>
      <div>
        <h4>Danh sách phân loại hàng</h4>
        <div>
          <AppForm onSubmit={() => {}}>
            <div className='grid grid-cols-4 gap-2'>
              <AppInput id='allPrice' name='allPrice' required placeholder='Giá' />
              <AppInput id='allStock' name='allStock' required placeholder='Kho hàng' />
              <AppInput id='allSKU' name='allSKU' required placeholder='SKU phân loại' />
              <AppButton type='submit'>Áp dụng cho tất cả</AppButton>
            </div>
          </AppForm>
          <AppForm onSubmit={() => {}}>
            <table className='w-full text-sm text-left text-gray-500 dark:text-gray-400'>
              <thead className='text-xs text-gray-700 uppercase bg-gray-50 '>
                <tr>
                  <th>Nhóm phân loại</th>
                  <th>Giá</th>
                  <th>Kho hàng</th>
                  <th>SKU phân loại</th>
                </tr>
              </thead>
              <tbody>
                <tr className='bg-white border-b '>
                  <td className='pr-4'>
                    <AppInput id='allPrice' type='number' name='allPrice' required placeholder='Giá' />
                  </td>
                  <td className='pr-4'>
                    <AppInput id='allPrice' type='number' name='allPrice' required placeholder='Giá' />
                  </td>
                  <td className='pr-4'>
                    <AppInput id='allPrice' type='number' name='allPrice' required placeholder='Kho hàng' />
                  </td>
                  <td className='pr-4'>
                    <AppInput id='allPrice' type='number' name='allPrice' required placeholder='Kho hàng' />
                  </td>
                </tr>
              </tbody>
            </table>
          </AppForm>
        </div>
      </div>
    </div>
  )
}

export default SellInformation
