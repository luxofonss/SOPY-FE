import register_bg from '@src/assets/images/register_bg.jpg'
import AppButton from '@src/components/AppButton'
import AppCheckbox from '@src/components/Form/AppCheckbox'
import AppForm from '@src/components/Form/AppForm'
import AppInput from '@src/components/Form/AppInput'
import AppTextArea from '@src/components/Form/AppTextArea'
import { BeatLoader } from 'react-spinners'
import { toast } from 'react-toastify'
import customerApi from '../../customer.service'
import { useNavigate } from 'react-router'

function ShopRegister() {
  const navigate = useNavigate()
  const onSubmit = async (data) => {
    const response = await register({
      shopName: data.name,
      address: data.address,
      phoneNumber: data.phoneNumber,
      description: data.description
    })
    console.log('response:: ', response)

    if (!response.error) {
      toast.success('Chúc mừng bạn đã đăng ký thành công!')
      navigate('/shop/product/all')
    } else {
      toast.error(response.error?.data?.message)
    }
  }

  const [register, { isLoading }] = customerApi.endpoints.shopRegister.useMutation()

  return (
    <div
      style={{ backgroundImage: `url(${register_bg})` }}
      className='w-100% grid px-60 gap-12 grid-cols-12 bg-cover bg-center bg-no-repeat h-[calc(100vh_-_88px)] object-cover'
    >
      <div className='col-span-6'></div>
      <div className='col-span-6 flex items-center'>
        <AppForm className='bg-neutral-0 p-4 h-auto w-full rounded-lg' onSubmit={onSubmit}>
          <h4 className='text-neutral-500 font-semibold text-md text-center mb-2'>Đăng ký bán hàng</h4>
          <AppInput type='text' placeholder='Tên shop' name='name' label='Tên shop' required className='mb-2' />
          <AppInput type='text' placeholder='Địa chỉ' name='address' label='Địa chỉ' required className='mb-2' />
          <AppInput
            type='number'
            placeholder='Số điện thoại'
            name='phoneNumber'
            label='Số điện thoại'
            required
            className='mb-2'
          />
          <AppTextArea
            rows={4}
            type='text'
            placeholder='Giới thiệu về shop'
            name='description'
            label='Giới thiệu về shop'
            required
            className='mb-2'
          />
          <AppCheckbox
            name='agree'
            options={[{ name: 'Tôi đồng ý với điều khoản dịch vụ của Shope', value: 1 }]}
            required='Bạn phải đồng ý với điều khoản dịch vụ'
          />
          <AppButton disabled={isLoading} className='w-full my-4' formNoValidate type='submit'>
            {!isLoading ? ' Đăng ký' : <BeatLoader size={12} color='#ff4d00' />}
          </AppButton>
        </AppForm>
      </div>
    </div>
  )
}

export default ShopRegister
