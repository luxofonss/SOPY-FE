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
import { useDispatch, useSelector } from 'react-redux'
import { BeatLoader } from 'react-spinners'
import { toast } from 'react-toastify'
import customerApi from '../../customer.service'
import { setCart } from '../../customer.slice'
import { useNavigate } from 'react-router'
import { useTitle } from '@src/hooks/useTitle'

function Checkout() {
  const dispatch = useDispatch()
  const userInfo = useSelector((state) => state.auth.user)
  const cartData = useSelector((state) => state.customer.cart)
  const navigate = useNavigate()

  const addAddressCloseRef = useRef(null)
  const [chosenAddress, setChosenAddress] = useState()
  const [loadingPage, setLoadingPage] = useState(true)

  const [getCart] = customerApi.endpoints.getCart.useLazyQuery({ cache: false })
  const [buyProducts, { isLoading: isBuying }] = customerApi.endpoints.buyProducts.useMutation()
  const [updateUser, { isLoading: isUpdating }] = appApi.endpoints.updateUserInfo.useMutation()
  const [getProfile] = authApi.endpoints.getProfile.useLazyQuery()

  useTitle('Thanh toán - Sopy')

  useEffect(() => {
    setTimeout(() => {
      setLoadingPage(false)
    }, [200])
  }, [])

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
    if (userInfo?.address) setChosenAddress(userInfo?.address[0])
  }, [userInfo])

  const onAddAddress = async (data) => {
    const response = await updateUser({ address: [data.address] })
    if (response.error) {
      toast.error(response.error.data.message)
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
    } else {
      toast.success('Tạo đơn hàng thành công!')
      navigate('/me/orders')
    }
  }

  return (
    <>
      {loadingPage ? (
        <div className={`absolute flex h-screen w-screen items-center justify-center bg-neutral-300 bg-opacity-30`}>
          <BeatLoader size={16} color='#ff4d00' />
        </div>
      ) : (
        <div className='container mx-auto '>
          <div className='grid grid-cols-12 gap-3 rounded-sm'>
            <div className='col-span-12 mb-1 flex items-center gap-4 bg-white px-3 py-1'>
              <p className='font-semibold text-neutral-600'>Danh sách sản phẩm</p>
            </div>
            <div className='col-span-8'>
              {cartData ? (
                cartData?.metadata?.data?.map((shop, index) => {
                  let length = cartData?.metadata?.data?.length
                  return (
                    <div key={shop.shop._id} className='mb-2 bg-white p-3'>
                      <div className='flex h-8 items-center justify-between rounded-sm  bg-secondary-purple py-1 px-2'>
                        <p className='text-base font-medium text-neutral-700'>
                          Gói hàng {index + 1} của {length}
                        </p>
                        <p className='text-sm font-medium text-neutral-600'>Được giao bởi {shop.shop?.name}</p>
                      </div>
                      <div className='mt-2'>
                        <p className='text-sm text-neutral-500'>Tùy chọn giao hàng</p>
                        <div className='mt-1 grid grid-cols-4'>
                          <div className='w-full rounded-md bg-secondary-green px-3 py-2 hover:cursor-pointer hover:opacity-90'>
                            <div className='flex items-center gap-2'>
                              <CheckCircleIcon className='h-6 w-6 text-primary-green' />
                              <p className='text-sm font-medium text-neutral-600'>₫{accounting.formatNumber(50000)}</p>
                            </div>
                            <div className='flex flex-col gap-1 pl-6'>
                              <p className='text-xs font-medium text-neutral-600'>Giao hàng tiêu chuẩn</p>
                              <p className='text-xs font-medium text-neutral-600'>Nhận hàng vào 20-21 thg6 </p>
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
              <div className='rounded-md bg-white px-3 py-1'>
                <div>
                  <div className='flex w-full justify-center'>
                    <AppButton
                      onClick={() => {
                        handleBuy()
                      }}
                      isLoading={isBuying}
                      className='mt-6 w-full'
                    >
                      Mua hàng
                    </AppButton>
                  </div>
                  <h4 className='font-semibold text-neutral-600'>Địa điểm</h4>
                  <div className='flex gap-4'>
                    <MapPinIcon className='h-8 w-8 bg-white' />
                    <div>
                      <p>{userInfo?.address ? chosenAddress : 'Chưa có địa chỉ'}</p>
                      <AppModal
                        closeRef={addAddressCloseRef}
                        Trigger={<div className='hover:cursor-pointer hover:text-neutral-700'>Chọn địa chỉ</div>}
                      >
                        <div className='w-[550px] rounded-lg bg-neutral-200 p-10'>
                          <h4 className='text-lg font-semibold text-neutral-400'>Chọn địa chỉ</h4>
                          {userInfo?.address?.map((address) => {
                            return (
                              <Fragment key={address}>
                                <label
                                  htmlFor={address}
                                  className={`${
                                    chosenAddress === address ? 'bg-secondary-purple' : ''
                                  } flex h-12 w-full items-center px-4 hover:cursor-pointer hover:opacity-90`}
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
                                  {isUpdating ? (
                                    <BeatLoader size={12} color='#ff4d00' />
                                  ) : (
                                    <PlusCircleIcon className='h-6 w-6' />
                                  )}
                                </button>
                              </div>
                            </AppForm>
                          </div>
                          <div className='mt-6 flex items-center justify-end'>
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
                    <h4 className='text-md font-semibold text-neutral-700'>Phương thức thanh toán</h4>
                    <div className='flex gap-4 rounded-md border-[1px] border-primary-green p-4 transition hover:bg-neutral-200'>
                      <CreditCardIcon className='h-6 w-6 text-secondary-green' />
                      <p className='text-sm text-neutral-500'>Thanh toán khi nhận hàng</p>
                    </div>
                    <Divider />
                    <h4 className='text-md font-semibold text-neutral-700'>Mã giảm giá</h4>
                    <div className='flex w-full justify-between gap-2'>
                      <input
                        type='text'
                        placeholder='Nhập mã giảm giá (áp dụng 1 lần)'
                        onChange={(e) => console.log('disount: ', e.target.value)}
                        className='h-9 flex-1 rounded-sm border-[1px] border-neutral-400 text-sm text-neutral-500'
                      />
                      <AppButton className='h-9 rounded-sm bg-primary-green text-sm hover:opacity-90'>
                        Áp dụng
                      </AppButton>
                      <AppButton className='h-9 rounded-sm bg-primary-blue text-sm hover:opacity-90'>Chọn mã</AppButton>
                    </div>
                    <Divider />
                    <h4 className='text-md font-semibold text-neutral-700'>Thông tin đơn hàng</h4>
                    <div className='flex h-9 items-center justify-between text-sm'>
                      <p className='font-medium text-neutral-500'>Tạm tính</p>
                      <p className='text-neutral-500'>₫{accounting.formatNumber(cartData?.metadata.totalPrice || 0)}</p>
                    </div>
                    <div className='flex h-9 items-center justify-between text-sm'>
                      <p className='font-medium text-neutral-500'>Phí vận chuyển</p>
                      <p className='text-neutral-500'>₫50.000d</p>
                    </div>
                    <div className='flex h-9 items-center justify-between text-sm'>
                      <p className='font-medium text-neutral-500'>Giảm giá voucher</p>
                      <p className='text-neutral-500'>- ₫50.000d</p>
                    </div>
                    <Divider />
                    <div className='flex h-9 items-center justify-between'>
                      <p className='font-medium text-neutral-500'>Tổng cộng</p>
                      <p className='text-lg text-primary-red'>
                        ₫{accounting.formatNumber(50000 + cartData?.metadata.totalPrice)}
                      </p>
                    </div>
                    <div className='ml-auto flex justify-end text-sm text-neutral-400'>Đã bao gồm VAT (nếu có)</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Checkout
