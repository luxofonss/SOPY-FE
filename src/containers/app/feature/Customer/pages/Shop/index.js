/* eslint-disable react-hooks/exhaustive-deps */
import { ChatBubbleLeftIcon } from '@heroicons/react/20/solid'
import AppButton from '@src/components/AppButton'
import AppForm from '@src/components/Form/AppForm'
import AppInput from '@src/components/Form/AppInput'
import useNewConversation from '@src/hooks/useNewConversation'
import appApi from '@src/redux/service'
import { Divider } from 'antd'
import { useEffect } from 'react'
import { useLocation, useParams } from 'react-router'
import customerApi from '../../customer.service'
import { BeatLoader } from 'react-spinners'
import { isEmpty } from 'lodash'
import ProductCard from '../../components/ProductCard'
import { useTitle } from '@src/hooks/useTitle'

let filters = [
  {
    name: 'Nơi bán',
    value: [
      { name: 'Hà Nội', value: 'test' },
      { name: 'Hà Tĩnh', value: 'test' },
      { name: 'Thành phố Hồ Chí Minh', value: 'test' },
      { name: 'Đà Năng', value: 'test' },
      { name: 'Vinh', value: 'test' }
    ]
  },
  {
    name: 'Tình trạng',
    value: [
      { name: 'Mới', value: '1' },
      { name: 'Cũ', value: '0' }
    ]
  }
]

function Shop() {
  const { id } = useParams()
  const location = useLocation()
  const [getShop, { data: shopInfo }] = appApi.endpoints.getShopById.useLazyQuery()
  const [filterProduct, { data: products, isFetching: isGettingProduct }] =
    customerApi.endpoints.filterProduct.useLazyQuery()

  useTitle(shopInfo?.metadata?.shopInfo?.shopName || shopInfo?.metadata?.name || 'Sopy')

  const handleNewConversation = useNewConversation()

  useEffect(() => {
    getShop(id, false)
    filterProduct({ shop: id }, false)
  }, [location])
  const handleFilterPrice = () => {}
  return (
    <div className='container mx-auto'>
      <div className='h-36 w-full'>
        <div
          className='h-full flex gap-4 p-3 bg-cover bg-center rounded-sm'
          style={{
            backgroundImage: 'url("https://easyretro.io/blog/assets/images/ms-how-blur-bg-cover.jpg")'
          }}
        >
          <img
            className='w-28 h-28 rounded-full'
            src={
              shopInfo?.metadata?.avatar ||
              'https://yt3.googleusercontent.com/-CFTJHU7fEWb7BYEb6Jh9gm1EpetvVGQqtof0Rbh-VQRIznYYKJxCaqv_9HeBcmJmIsp2vOO9JU=s900-c-k-c0x00ffffff-no-rj'
            }
            alt='avatar'
          />
          <div className='flex flex-col'>
            <p className='text-md font-medium text-neutral-0 drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]'>
              {shopInfo?.metadata?.shopInfo?.shopName || shopInfo?.metadata?.name}
            </p>
            <p className='text-sm text-neutral-0 drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]'>
              {shopInfo?.metadata?.shopInfo?.address || shopInfo?.metadata?.address[0]}
            </p>
            <div className='flex gap-4 mt-auto'>
              <AppButton
                Icon={<ChatBubbleLeftIcon className='w-5 h-5' />}
                showIcon
                onClick={() => {
                  handleNewConversation({
                    receiverId: shopInfo?.metadata?._id,
                    name: shopInfo?.metadata?.shopInfo?.shopName || shopInfo?.metadata?.name,
                    avatar: shopInfo?.metadata?.avatar
                  })
                }}
                className='h-9 bg-transparent border-[1px] border-orange-4 text-orange-4 hover:bg-orange-1'
              >
                Chat
              </AppButton>
            </div>
          </div>
        </div>
      </div>
      <div className='grid grid-cols-12 gap-3 mt-4'>
        <div className='col-span-2 bg-neutral-0 p-3 rounded-md shadow-lg'>
          <h4 className='text-lg font-semibold text-neutral-500 mb-3'>Bộ lọc tìm kiếm</h4>
          <div className='mb-2'>
            <div className='text-neutral-700 font-medium mb-2'>Khoảng giá</div>
            <AppForm onSubmit={handleFilterPrice}>
              <AppInput type='number' name='minPrice' placeholder='Từ' />
              <AppInput type='number' name='maxPrice' placeholder='Đến' />
              <AppButton type='submit' className='w-full h-9 bg-orange-4 text-neutral-0 hover:bg-orange-3'>
                Áp dụng
              </AppButton>
            </AppForm>
          </div>
          {filters.map((filter) => {
            return (
              <div className='mb-4' key={filter.name}>
                <div className='text-neutral-700 font-medium mb-2'>{filter.name}</div>
                {filter.value.map((item) => {
                  return (
                    <div
                      className='flex px-3 rounded-sm gap-4 h-8 items-center my-1 hover:bg-neutral-300 transition cursor-pointer'
                      key={item.name}
                    >
                      <input
                        className='w-3 h-3 cursor-pointer'
                        id={item.value}
                        type='checkbox'
                        value={item.value}
                        name={item.name}
                      />
                      <label className='text-sm text-neutral-500 cursor-pointer' htmlFor={item.value}>
                        {item.name}
                      </label>
                    </div>
                  )
                })}
                <Divider />
              </div>
            )
          })}
        </div>
        <div className='col-span-10 bg-neutral-0 p-3 rounded-md shadow-lg'>
          <div className='grid grid-cols-5 gap-4'>
            {isGettingProduct ? (
              <div className='flex justify-center items-center'>
                <BeatLoader size={12} color='#ff4d00' />
              </div>
            ) : !isEmpty(products?.metadata?.products) ? (
              products?.metadata?.products?.map((product) => (
                <div key={product.name}>
                  <ProductCard product={product} />
                </div>
              ))
            ) : (
              <div className='w-full lex justify-center items-center'>Không tìm thấy sản phẩm</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Shop
