/* eslint-disable react-hooks/exhaustive-deps */
import { HeartIcon, MapPinIcon, MinusIcon, PlusCircleIcon, PlusIcon, TrashIcon } from '@heroicons/react/20/solid'
import AppButton from '@src/components/AppButton'
import Divider from '@src/components/Divider'
import AppForm from '@src/components/Form/AppForm'
import AppInput from '@src/components/Form/AppInput'
import AppModal from '@src/components/Modal'
import { authApi } from '@src/containers/authentication/feature/Auth/authService'
import { setUser } from '@src/containers/authentication/feature/Auth/authSlice'
import appApi from '@src/redux/service'
import accounting from 'accounting'
import { Checkbox } from 'flowbite-react'
import { Fragment, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { BeatLoader } from 'react-spinners'
import { toast } from 'react-toastify'
import ProductCard from '../../components/ProductCard'
import customerApi from '../../customer.service'
import { setCart } from '../../customer.slice'
import { useTitle } from '@src/hooks/useTitle'

function UserCart() {
  const dispatch = useDispatch()
  const userInfo = useSelector((state) => state.auth.user)
  const cartData = useSelector((state) => state.customer.cart)
  const navigate = useNavigate()

  const closeRef = useRef(null)
  const openRef = useRef(null)
  const addAddressCloseRef = useRef(null)
  const [deleteItemVariationId, setDeleteItemVariationId] = useState(null)
  const [chosenAddress, setChosenAddress] = useState()

  const [getCart] = customerApi.endpoints.getCart.useLazyQuery({ cache: false })
  const [getProducts, { data: products }] = customerApi.endpoints.getAllProducts.useLazyQuery()
  const [setAllCheck, { isLoading: isCheckingAll }] = customerApi.endpoints.setAllCheck.useMutation()
  const [setShopCheck, { isLoading: isCheckingShop }] = customerApi.endpoints.setShopCheck.useMutation()
  const [setProductCheck, { isLoading: isCheckingProduct }] = customerApi.endpoints.setProductCheck.useMutation()
  const [addToCart, { isLoading: isChangingCart }] = customerApi.endpoints.addToCart.useMutation()
  const [deleteItem, { isLoading: isDeletingItem }] = customerApi.endpoints.deleteItem.useMutation()
  const [updateUser, { isLoading: isUpdating }] = appApi.endpoints.updateUserInfo.useMutation()
  const [getProfile] = authApi.endpoints.getProfile.useLazyQuery()

  useTitle('Giỏ hàng - Sopy')

  useEffect(() => {
    getProducts()
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

  const updateCartRedux = async () => {
    const response = await getCart(null, false).unwrap()
    if (response) {
      console.log('response::', response)
      dispatch(setCart(response))
    } else toast.warn('Có lỗi xảy ra, vui lòng quay lại sau!')
  }

  const handleChooseAll = async (checked) => {
    await setAllCheck({ checked: checked })
    await updateCartRedux()
  }

  const handleChooseAllShop = async (checked, shopId) => {
    await setShopCheck({ checked, shopId })
    await updateCartRedux()
  }

  const handleChooseProduct = async (variationId, productId, shopId, quantity, checked) => {
    const response = await setProductCheck({ variationId, productId, shopId, quantity, checked })
    if (response.error) {
      toast.error(response.error.data.message)
    }
    await updateCartRedux()
  }

  const handleIncreaseQuantity = async (productId, shopId, variationId, quantity) => {
    const response = await addToCart({ productId, shopId, variationId, quantity: quantity + 1 })
    console.log('response:: ', response)
    if (!response.error) {
      toast.success('Cập nhật thành công!')
    } else {
      toast.error(response.error.data.message || 'Có lỗi ảy ra, vui lòng thử lại sau!')
    }
    await updateCartRedux()
  }

  const handleDecreaseQuantity = async (productId, shopId, variationId, quantity) => {
    if (quantity - 1 >= 1) {
      const response = await addToCart({ productId, shopId, variationId, quantity: quantity - 1 })
      console.log('response:: ', response)
      if (!response.error) {
        toast.success('Cập nhật thành công!')
      } else {
        toast.error(response.error.data.message || 'Có lỗi ảy ra, vui lòng thử lại sau!')
      }
      await updateCartRedux()
    } else {
      toast.error('Quantity must be greater than 1!')
    }
  }

  const handleDeleteItem = async () => {
    const response = await deleteItem({ variationId: deleteItemVariationId })
    if (response?.error) {
      toast.error('Có lỗi ảy ra, vui lòng thử lại sau!')
    } else {
      closeRef.current.closeModal()
      await updateCartRedux()
    }
  }

  const onAddAddress = async (data) => {
    const response = await updateUser({ address: [data.address] })
    if (response.error) {
      toast.error(response.error.data.message)
    } else {
      const profile = await getProfile()
      console.log('profile:: ', profile)

      if (!profile.error) dispatch(setUser(profile.data.metadata.user))
      toast.success('Cập nhật địa chỉ thành công')
    }
  }

  const onChooseAddress = async (checked, address) => {
    if (checked) setChosenAddress(address)
  }

  const handleCheckout = () => {
    if (cartData?.metadata?.hasProductChecked > 0) {
      navigate('/checkout')
    } else {
      toast.error('Bạn chưa chọn sản phẩm nào')
    }
  }

  return (
    <>
      <div
        className={`${
          isChangingCart || isDeletingItem || isCheckingAll || isCheckingShop || isCheckingProduct ? '' : 'hidden '
        } absolute flex h-screen w-screen items-center justify-center bg-neutral-300 bg-opacity-30`}
      >
        <BeatLoader size={16} color='#ff4d00' />
      </div>
      <div className='container mx-auto '>
        <AppModal openRef={openRef} closeRef={closeRef} Trigger={null}>
          <div className='flex h-32 w-80 flex-col justify-between rounded-lg bg-neutral-0 p-6'>
            <p className='font-medium'>Are you want to delete this product?</p>
            <div className='flex justify-center gap-4'>
              <AppButton
                onClick={() => {
                  setDeleteItemVariationId(null)
                  closeRef.current.closeModal()
                }}
                className='bg-neutral-400'
              >
                Cancel
              </AppButton>
              <AppButton
                onClick={() => {
                  handleDeleteItem()
                }}
              >
                Delete
              </AppButton>
            </div>
          </div>
        </AppModal>
        <div className='grid grid-cols-12 gap-4 rounded-sm'>
          <div className='col-span-12 mb-2 flex items-center gap-4 bg-white p-3'>
            <Checkbox
              onChange={(e) => {
                handleChooseAll(e.target.checked)
              }}
              checked={cartData?.metadata?.allChecked}
            />
            <p className='font-semibold text-neutral-600'>Chọn tất cả</p>
          </div>
          <div className='col-span-8'>
            {cartData ? (
              cartData?.metadata?.data?.map((shop) => {
                return (
                  <div key={shop.shop._id} className='mb-2 bg-white p-3'>
                    <div className='flex h-8 items-center gap-4 rounded-sm bg-secondary-purple py-1 px-2'>
                      <Checkbox
                        onChange={(e) => {
                          handleChooseAllShop(e.target.checked, shop.shop._id)
                        }}
                        checked={shop.checked}
                      />
                      <p className='text-base font-medium text-neutral-700'>{shop.shop?.name}</p>
                    </div>

                    <div>
                      {shop.products.map((product) => {
                        let isAble = product.quantity <= product.variation.stock
                        return (
                          <div
                            className={`${
                              isAble ? 'hover:cursor-pointer hover:bg-secondary-purple ' : 'bg-neutral-300'
                            } my-1 flex items-center gap-4 rounded-md p-2 transition`}
                            key={product.variation._id}
                          >
                            <Checkbox
                              onChange={(e) => {
                                handleChooseProduct(
                                  product.variation._id,
                                  product.product._id,
                                  shop.shop._id,
                                  product.quantity,
                                  e.target.checked
                                )
                              }}
                              checked={product.checked}
                              disable={!isAble}
                            />
                            <Link
                              className='flex items-center gap-4'
                              to={`/product/${product.product._id}`}
                              target='_blank'
                              rel='noopener noreferrer'
                            >
                              <img
                                src={product.variation?.thumb ? product.variation.thumb : product.product.thumb[0]}
                                alt='thumb'
                                className='h-16 w-16 object-cover'
                              />
                              <div>
                                <p className='text-base font-medium text-neutral-700 line-clamp-2'>
                                  {product.product.name}
                                </p>
                                <p className='text-sm text-neutral-500 line-clamp-2'>
                                  {product.variation.keyVariation + ': ' + product.variation.keyVariationValue}{' '}
                                  {product.variation?.subVariation &&
                                    product.variation?.subVariation + ': ' + product.variation?.subVariationValue}
                                  {' Còn '}
                                  {product.variation.stock}
                                  {' sản phẩm'}
                                </p>
                              </div>
                            </Link>
                            <div className='ml-auto flex gap-3'>
                              <div className='ml-auto w-36'>
                                <p className='text-left text-lg font-semibold text-primary-red'>
                                  {accounting.formatNumber(product.variation.price)}₫
                                </p>
                                <div className='flex items-center justify-center gap-4'>
                                  <HeartIcon className='h-6 w-6' />
                                  <TrashIcon
                                    onClick={() => {
                                      setDeleteItemVariationId(product.variation._id)
                                      openRef.current.openModal()
                                    }}
                                    className='h-6 w-6'
                                  />
                                </div>
                              </div>
                              <div className='flex items-center gap-2'>
                                <button
                                  onClick={() => {
                                    handleDecreaseQuantity(
                                      product.product._id,
                                      shop.shop._id,
                                      product.variation._id,
                                      product.quantity
                                    )
                                  }}
                                  className='h-6 w-6'
                                >
                                  <MinusIcon
                                    color='white'
                                    className='rounded-full bg-white text-neutral-500 transition hover:bg-secondary-orange'
                                  />
                                </button>
                                <div className='flex h-10 w-10 items-center justify-center border-[1px] border-neutral-300'>
                                  {product.quantity}
                                </div>
                                <button
                                  onClick={() => {
                                    handleIncreaseQuantity(
                                      product.product._id,
                                      shop.shop._id,
                                      product.variation._id,
                                      product.quantity
                                    )
                                  }}
                                  className='h-6 w-6'
                                >
                                  <PlusIcon className='rounded-full bg-white text-neutral-500 transition hover:bg-secondary-green' />
                                </button>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })
            ) : (
              <div>No data</div>
            )}
          </div>
          <div className='col-span-4'>
            <div className='rounded-md bg-white p-3'>
              <div>
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
                  <h4 className='text-md font-semibold text-neutral-700'>Thông tin đơn hàng</h4>
                  <div className='flex h-9 items-center justify-between'>
                    <p className='font-medium text-neutral-500'>Tạm tính</p>
                    <p className='text-neutral-500'>₫{accounting.formatNumber(cartData?.metadata.totalPrice || 0)}</p>
                  </div>
                  <div className='flex h-9 items-center justify-between'>
                    <p className='font-medium text-neutral-500'>Phí vận chuyển</p>
                    <p className='text-neutral-500'>₫50.000d</p>
                  </div>
                  <div className='flex h-9 items-center justify-between'>
                    <p className='font-medium text-neutral-500'>Tổng cộng</p>
                    <p className='text-neutral-500'>
                      ₫{accounting.formatNumber(50000 + cartData?.metadata.totalPrice)}
                    </p>
                  </div>
                  <div className='ml-auto flex justify-end text-sm text-neutral-400'>Đã bao gồm VAT (nếu có)</div>
                </div>
                <div className='flex justify-center'>
                  {/* <Link to='/checkout'> */}
                  <AppButton onClick={handleCheckout} className='mt-6'>
                    Xác nhận mua hàng
                  </AppButton>
                  {/* </Link> */}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='mt-4 rounded-lg bg-white p-2'>
          <div className='flex justify-between'>
            <h4 className='text-lg font-semibold text-neutral-700'>Hot sale</h4>
          </div>
          <div className='grid grid-cols-6 gap-3'>
            {products?.metadata?.map((product) => (
              <div key={product.name}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default UserCart
