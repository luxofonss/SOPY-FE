/* eslint-disable react-hooks/exhaustive-deps */
import { HeartIcon, MapPinIcon, MinusIcon, PlusIcon, TrashIcon } from '@heroicons/react/20/solid'
import AppButton from '@src/components/AppButton'
import Divider from '@src/components/Divider'
import { Checkbox } from 'flowbite-react'
import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import ProductCard from '../../components/ProductCard'
import customerApi from '../../customer.service'
import { setCart } from '../../customer.slice'
import { toast } from 'react-toastify'
import { BeatLoader } from 'react-spinners'
import AppModal from '@src/components/Modal'
import { isEmptyValue } from '@src/helpers/check'
import accounting from 'accounting'

function UserCart() {
  const dispatch = useDispatch()
  const userInfo = useSelector((state) => state.auth.user)
  const cartData = useSelector((state) => state.customer.cart)

  const closeRef = useRef(null)
  const openRef = useRef(null)
  const [deleteItemVariationId, setDeleteItemVariationId] = useState(null)

  const [getCart] = customerApi.endpoints.getCart.useLazyQuery()
  const [getProducts, { data: products }] = customerApi.endpoints.getAllProducts.useLazyQuery()
  const [setAllCheck] = customerApi.endpoints.setAllCheck.useMutation()
  const [setShopCheck] = customerApi.endpoints.setShopCheck.useMutation()
  const [setProductCheck] = customerApi.endpoints.setProductCheck.useMutation()
  const [addToCart, { isLoading: isChangingCart }] = customerApi.endpoints.addToCart.useMutation()
  const [deleteItem, { isLoading: isDeletingItem }] = customerApi.endpoints.deleteItem.useMutation()

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

  const updateCartRedux = async () => {
    const response = await getCart(null, false)

    if (!response.error) {
      dispatch(setCart(response.data))
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

  const handleChooseProduct = async (variationId) => {
    await setProductCheck({ variationId: variationId })
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

  console.log('deleteItemVariationId:: ', deleteItemVariationId, !isEmptyValue(deleteItemVariationId))

  return (
    <>
      <div
        className={`${
          isChangingCart || isDeletingItem ? '' : 'hidden'
        } w-screen h-screen bg-neutral-300 bg-opacity-30 flex items-center justify-center`}
      >
        <BeatLoader size={16} color='#36d7b7' />
      </div>
      <div className='container mx-auto '>
        <AppModal openRef={openRef} closeRef={closeRef} Trigger={null}>
          <div className='w-80 h-32 bg-neutral-0 p-6 rounded-lg flex flex-col justify-between'>
            <p className='font-medium'>Are you want to delete this product?</p>
            <div className='flex gap-4 justify-center'>
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
        <div className='grid grid-cols-12 rounded-sm gap-4'>
          <div className='col-span-12 flex items-center gap-4 bg-white p-3 mb-2'>
            <Checkbox
              onChange={(e) => {
                handleChooseAll(e.target.checked)
              }}
              checked={cartData?.metadata[0]?.checked}
            />
            <p className='text-neutral-600 font-semibold'>Chọn tất cả</p>
          </div>
          <div className='col-span-8'>
            {cartData ? (
              cartData?.metadata[0]?.products?.map((shop) => {
                return (
                  <div key={shop.shop._id} className='bg-white mb-2 p-3'>
                    <div className='h-8 py-1 px-2 rounded-sm flex items-center gap-4 bg-secondary-purple'>
                      <Checkbox
                        onChange={(e) => {
                          handleChooseAllShop(e.target.checked, shop.shop._id)
                        }}
                        checked={shop.checked}
                      />
                      <p className='text-neutral-700 font-medium text-base'>{shop.shop?.name}</p>
                    </div>

                    <div>
                      {shop.products.map((product) => {
                        return (
                          <div
                            className='flex items-center gap-4 p-2 my-1 rounded-md hover:bg-secondary-purple hover:cursor-pointer transition'
                            key={product.variation._id}
                          >
                            <Checkbox
                              onChange={() => {
                                handleChooseProduct(product.variation._id)
                              }}
                              checked={product.checked}
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
                                className='w-16 h-16 object-cover'
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
                            <div className='flex gap-3 ml-auto'>
                              <div className='w-36 ml-auto'>
                                <p className='text-lg font-semibold text-primary-red text-left'>
                                  {accounting.formatNumber(product.variation.price)}₫
                                </p>
                                <div className='flex gap-4 items-center justify-center'>
                                  <HeartIcon className='w-6 h-6' />
                                  <TrashIcon
                                    onClick={() => {
                                      setDeleteItemVariationId(product.variation._id)
                                      openRef.current.openModal()
                                    }}
                                    className='w-6 h-6'
                                  />
                                </div>
                              </div>
                              <div className='flex gap-2 items-center'>
                                <button
                                  onClick={() => {
                                    handleDecreaseQuantity(
                                      product.product._id,
                                      shop.shop._id,
                                      product.variation._id,
                                      product.quantity
                                    )
                                  }}
                                  className='w-6 h-6'
                                >
                                  <MinusIcon
                                    color='white'
                                    className='bg-white text-neutral-500 rounded-full transition hover:bg-secondary-orange'
                                  />
                                </button>
                                <div className='w-10 h-10 flex items-center justify-center border-neutral-300 border-[1px]'>
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
                                  className='w-6 h-6'
                                >
                                  <PlusIcon className='bg-white text-neutral-500 rounded-full transition hover:bg-secondary-green' />
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
              <div>Loading...</div>
            )}
          </div>
          <div className='col-span-4'>
            <div className='bg-white p-3 rounded-md'>
              <div>
                <h4 className='font-semibold text-neutral-600'>Địa điểm</h4>

                <div className='flex gap-4'>
                  <MapPinIcon className='w-8 h-8 bg-white' />
                  <div>{userInfo && userInfo?.address}</div>
                </div>

                <Divider />

                <div>
                  <h4 className='text-neutral-700 font-semibold text-md'>Thông tin đơn hàng</h4>
                  <div className='h-9 flex justify-between items-center'>
                    <p className='text-neutral-500 font-medium'>Tạm tính</p>
                    <p className='text-neutral-500'>
                      ₫{accounting.formatNumber(cartData?.metadata[0]?.totalPrice || 0)}
                    </p>
                  </div>
                  <div className='h-9 flex justify-between items-center'>
                    <p className='text-neutral-500 font-medium'>Phí vận chuyển</p>
                    <p className='text-neutral-500'>₫50.000d</p>
                  </div>
                  <div className='h-9 flex justify-between items-center'>
                    <p className='text-neutral-500 font-medium'>Tổng cộng</p>
                    <p className='text-neutral-500'>
                      ₫{accounting.formatNumber(50000 + cartData?.metadata[0]?.totalPrice)}
                    </p>
                  </div>
                  <div className='text-sm flex justify-end text-neutral-400 ml-auto'>Đã bao gồm VAT (nếu có)</div>
                </div>
                <div className='flex justify-center'>
                  <AppButton className='mt-6'>Xác nhận mua hàng</AppButton>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='mt-4 p-2 bg-white rounded-lg'>
          <div className='flex justify-between'>
            <h4 className='font-semibold text-lg text-neutral-700'>Hot sale</h4>
          </div>
          <div className='grid grid-cols-6 gap-8'>
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
