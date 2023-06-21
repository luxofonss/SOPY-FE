/* eslint-disable react-hooks/exhaustive-deps */
import { CheckCircleIcon, CreditCardIcon, MapPinIcon, PlusCircleIcon } from '@heroicons/react/20/solid'
import AppButton from '@src/components/AppButton'
import Divider from '@src/components/Divider'
import AppForm from '@src/components/Form/AppForm'
import AppInput from '@src/components/Form/AppInput'
import AppModal from '@src/components/Modal'
import ProductInOrder from '@src/components/ProductInOrder'
import { authApi } from '@src/containers/authentication/feature/Auth/authService'
import { setUser } from '@src/containers/authentication/feature/Auth/authSlice'
import appApi from '@src/redux/service'
import accounting from 'accounting'
import { Fragment, useEffect, useRef, useState } from 'react'
import Skeleton from 'react-loading-skeleton'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import customerApi from '../../customer.service'
import { setCart } from '../../customer.slice'

function Checkout() {
  const dispatch = useDispatch()
  const userInfo = useSelector((state) => state.auth.user)
  const cartData = useSelector((state) => state.customer.cart)

  const addAddressCloseRef = useRef(null)
  const [chosenAddress, setChosenAddress] = useState()

  const [getCart] = customerApi.endpoints.getCart.useLazyQuery({ cache: false })
  const [buyProducts, { isLoading: isBuying }] = customerApi.endpoints.buyProducts.useMutation()
  const [updateUser, { isLoading: isUpdating }] = appApi.endpoints.updateUserInfo.useMutation()
  const [getProfile] = authApi.endpoints.getProfile.useLazyQuery()

  useEffect(() => {
    getCart(null, false)
      .then((response) => {
        dispatch(setCart(response.data))
      })
      .catch((error) => {
        console.log('error: ', error)
      })
  }, [])

  useEffect(() => {
    setChosenAddress(userInfo?.address[0])
  }, [userInfo])

  const onAddAddress = async (data) => {
    const response = await updateUser({ address: [data.address] })
    if (response.error) {
      toast.error('response.error.data.message')
    } else {
      const profile = await getProfile()

      if (!profile.error) dispatch(setUser(profile.data.metadata.user))
      toast.success('Cập nhật địa chỉ thành công')
    }
  }

  const onChooseAddress = async (checked, address) => {
    if (checked) setChosenAddress(address)
  }

  const handleBuy = async () => {
    const response = await buyProducts({ address: chosenAddress })
    if (response.error) {
      toast.error(response.error.data.message)
    } else toast.success('Tạo đơn hàng thành công!')
  }

  return (
    <>
      <div className='container mx-auto '>
        <div className='grid grid-cols-12 rounded-sm gap-3'>
          <div className='col-span-12 flex items-center gap-4 bg-white px-3 py-1 mb-1'>
            <p className='text-neutral-600 font-semibold'>Danh sách sản phẩm</p>
          </div>
          <div className='col-span-8'>
            {cartData ? (
              cartData?.metadata[0]?.products?.map((shop, index) => {
                let length = cartData?.metadata[0]?.products?.length
                return (
                  <div key={shop.shop._id} className='bg-white mb-2 p-3'>
                    <div className='h-8 py-1 px-2 rounded-sm flex  justify-between items-center bg-secondary-purple'>
                      <p className='text-neutral-700 font-medium text-base'>
                        Gói hàng {index + 1} của {length}
                      </p>
                      <p className='text-neutral-600 font-medium text-sm'>Được giao bởi {shop.shop?.name}</p>
                    </div>
                    <div className='mt-2'>
                      <p className='text-sm text-neutral-500'>Tùy chọn giao hàng</p>
                      <div className='grid grid-cols-4 mt-1'>
                        <div className='w-full px-3 py-2 bg-secondary-green rounded-md hover:opacity-90 hover:cursor-pointer'>
                          <div className='flex gap-2 items-center'>
                            <CheckCircleIcon className='w-6 h-6 text-primary-green' />
                            <p className='text-neutral-600 font-medium text-sm'>₫{accounting.formatNumber(50000)}</p>
                          </div>
                          <div className='pl-6 flex flex-col gap-1'>
                            <p className='text-neutral-600 font-medium text-xs'>Giao hàng tiêu chuẩn</p>
                            <p className='text-neutral-600 font-medium text-xs'>Nhận hàng vào 20-21 thg6 </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      {shop.products.map((product) => {
                        if (product.checked)
                          return (
                            <ProductInOrder product={product} />
                            // <div
                            //   className='flex items-center gap-4 p-2 my-1 rounded-md hover:bg-secondary-purple hover:cursor-pointer transition'
                            //   key={product.variation._id}
                            // >
                            //   <Link
                            //     className='flex items-center gap-4'
                            //     to={`/product/${product.product._id}`}
                            //     target='_blank'
                            //     rel='noopener noreferrer'
                            //   >
                            //     <img
                            //       src={product.variation?.thumb ? product.variation.thumb : product.product.thumb[0]}
                            //       alt='thumb'
                            //       className='w-16 h-16 object-cover'
                            //     />
                            //     <div>
                            //       <p className='text-base font-medium text-neutral-700 line-clamp-2'>
                            //         {product.product.name}
                            //       </p>
                            //       <p className='text-sm text-neutral-500 line-clamp-2'>
                            //         {product.variation.keyVariation + ': ' + product.variation.keyVariationValue}{' '}
                            //         {product.variation?.subVariation &&
                            //           product.variation?.subVariation + ': ' + product.variation?.subVariationValue}
                            //         {' Còn '}
                            //         {product.variation.stock}
                            //         {' sản phẩm'}
                            //       </p>
                            //     </div>
                            //   </Link>
                            //   <div className='flex gap-3 ml-auto'>
                            //     <div className='w-36 ml-auto'>
                            //       <p className='text-base font-semibold text-primary-red text-left'>
                            //         {accounting.formatNumber(product.variation.price)}₫
                            //       </p>
                            //     </div>
                            //     <div className='flex gap-2 items-center'>
                            //       <div className='h-9 flex items-center text-sm justify-center border-neutral-300 border-[1px]'>
                            //         Số lượng: {product.quantity}
                            //       </div>
                            //     </div>
                            //   </div>
                            // </div>
                          )
                        else return null
                      })}
                    </div>
                  </div>
                )
              })
            ) : (
              <div>Loading...</div>
            )}
          </div>
          <div className='col-span-4'>
            <div className='bg-white px-3 py-1 rounded-md'>
              <div>
                <div className='flex w-full justify-center'>
                  <AppButton
                    onClick={() => {
                      handleBuy()
                    }}
                    isLoading={isBuying}
                    className='w-full mt-6'
                  >
                    Mua hàng
                  </AppButton>
                </div>
                <h4 className='font-semibold text-neutral-600'>Địa điểm</h4>
                <div className='flex gap-4'>
                  <MapPinIcon className='w-8 h-8 bg-white' />
                  <div>
                    <p>{userInfo?.address ? chosenAddress : 'Chưa có địa chỉ'}</p>
                    <AppModal
                      closeRef={addAddressCloseRef}
                      Trigger={<div className='hover:text-neutral-700 hover:cursor-pointer'>Chọn địa chỉ</div>}
                    >
                      <div className='w-[550px] bg-neutral-200 rounded-lg p-10'>
                        <h4 className='text-lg text-neutral-400 font-semibold'>Chọn địa chỉ</h4>
                        {userInfo?.address?.map((address) => {
                          return (
                            <Fragment key={address}>
                              <label
                                htmlFor={address}
                                className={`${
                                  chosenAddress === address ? 'bg-secondary-purple' : ''
                                } w-full h-12 flex items-center px-4 hover:opacity-90 hover:cursor-pointer`}
                              >
                                {address}
                              </label>
                              <input
                                className='hidden'
                                name='chosen-address'
                                onChange={(e) => onChooseAddress(e.target.checked, address)}
                                type='radio'
                                id={address}
                              />
                            </Fragment>
                          )
                        })}
                        <div>
                          <AppForm onSubmit={onAddAddress}>
                            <div className='flex items-center gap-4 text-start'>
                              <AppInput label='Địa chỉ mới' name='address' required placeholder='Địa chỉ mới' />
                              <button
                                className='flex items-end justify-center border-none outline-none'
                                type='submit'
                                disabled={isUpdating}
                              >
                                {isUpdating ? <Skeleton /> : <PlusCircleIcon className='w-6 h-6' />}
                              </button>
                            </div>
                          </AppForm>
                        </div>
                        <div className='flex justify-end items-center mt-6'>
                          <AppButton type='button' onClick={() => addAddressCloseRef.current.closeModal()}>
                            Ok
                          </AppButton>
                        </div>
                      </div>
                    </AppModal>
                  </div>
                </div>

                <Divider />

                <div>
                  <h4 className='text-neutral-700 font-semibold text-md'>Phương thức thanh toán</h4>
                  <div className='p-4 flex gap-4 border-primary-green border-[1px] rounded-md hover:bg-neutral-200 transition'>
                    <CreditCardIcon className='w-6 h-6 text-secondary-green' />
                    <p className='text-sm text-neutral-500'>Thanh toán khi nhận hàng</p>
                  </div>
                  <Divider />
                  <h4 className='text-neutral-700 font-semibold text-md'>Mã giảm giá</h4>
                  <div className='w-full flex justify-between gap-2'>
                    <input
                      type='text'
                      placeholder='Nhập mã giảm giá (áp dụng 1 lần)'
                      onChange={(e) => console.log('disount: ', e.target.value)}
                      className='h-9 flex-1 border-[1px] border-neutral-400 text-sm text-neutral-500 rounded-sm'
                    />
                    <AppButton className='h-9 rounded-sm bg-primary-green hover:opacity-90 text-sm'>Áp dụng</AppButton>
                    <AppButton className='h-9 rounded-sm bg-primary-blue hover:opacity-90 text-sm'>Chọn mã</AppButton>
                  </div>
                  <Divider />
                  <h4 className='text-neutral-700 font-semibold text-md'>Thông tin đơn hàng</h4>
                  <div className='h-9 flex justify-between items-center text-sm'>
                    <p className='text-neutral-500 font-medium'>Tạm tính</p>
                    <p className='text-neutral-500'>
                      ₫{accounting.formatNumber(cartData?.metadata[0]?.totalPrice || 0)}
                    </p>
                  </div>
                  <div className='h-9 flex justify-between items-center text-sm'>
                    <p className='text-neutral-500 font-medium'>Phí vận chuyển</p>
                    <p className='text-neutral-500'>₫50.000d</p>
                  </div>
                  <div className='h-9 flex justify-between items-center text-sm'>
                    <p className='text-neutral-500 font-medium'>Giảm giá voucher</p>
                    <p className='text-neutral-500'>- ₫50.000d</p>
                  </div>
                  <Divider />
                  <div className='h-9 flex justify-between items-center'>
                    <p className='text-neutral-500 font-medium'>Tổng cộng</p>
                    <p className='text-primary-red text-lg'>
                      ₫{accounting.formatNumber(50000 + cartData?.metadata[0]?.totalPrice)}
                    </p>
                  </div>
                  <div className='text-sm flex justify-end text-neutral-400 ml-auto'>Đã bao gồm VAT (nếu có)</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Checkout
