/* eslint-disable react-hooks/exhaustive-deps */
import { Popover, Transition } from '@headlessui/react'
import { ShoppingCartIcon } from '@heroicons/react/20/solid'
import { Fragment, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import customerApi from '../../customer.service'
import { setCart } from '../../customer.slice'
import empty_cart from '@src/assets/images/empty_cart.png'
import AppButton from '@src/components/AppButton'
import accounting from 'accounting'

function Cart() {
  const [getCart] = customerApi.endpoints.getCart.useLazyQuery({ cache: false })
  const cartData = useSelector((state) => state.customer.cart)
  const dispatch = useDispatch()

  useEffect(() => {
    getCart(null, false)
      .then((response) => {
        console.log(response)
        dispatch(setCart(response.data))
      })
      .catch((error) => {
        console.log('error: ', error)
      })
  }, [])

  console.log('cartData:: ', cartData)
  return (
    <Popover className='relative z-[1000]'>
      {({ open }) => (
        <>
          <Popover.Button
            className={`
      ${open ? '' : 'text-opacity-90 '}
      focus-visible:ring-none group inline-flex items-center rounded-md px-3 py-2 text-base font-medium  text-gray-700 hover:text-opacity-100 focus:outline-none focus-visible:ring-opacity-75`}
          >
            <div className='hover:bg--orange-3 flex h-8 w-8 items-center justify-center rounded-full transition'>
              <ShoppingCartIcon className='h-6 w-6 text-neutral-0' />
            </div>
          </Popover.Button>
          <Transition
            as={Fragment}
            enter='transition ease-out duration-200'
            enterFrom='opacity-0 translate-y-1'
            enterTo='opacity-100 translate-y-0'
            leave='transition ease-in duration-150'
            leaveFrom='opacity-100 translate-y-0'
            leaveTo='opacity-0 translate-y-1'
          >
            <Popover.Panel className='absolute right-0 z-10 mt-3 max-h-96 w-96 max-w-sm transform overflow-y-scroll rounded-xl border-2 bg-neutral-0 p-3 shadow-xl sm:p-4 lg:max-w-3xl'>
              {cartData ? (
                <>
                  <div className='px-3'>
                    <h4 className='text-lg font-semibold text-neutral-700'>Giỏ hàng của tôi</h4>
                  </div>
                  <div className='mt-3'>
                    {cartData && cartData?.metadata?.data?.length > 0 ? (
                      <>
                        {cartData?.metadata?.data.map((shop) => {
                          return (
                            <>
                              {shop?.products?.map((item) => {
                                return (
                                  <Link
                                    to={`/product/${item.product._id}`}
                                    className='my-[2px] flex gap-1 px-[1px] py-[2px] transition hover:translate-x-[2px] hover:cursor-pointer hover:bg-neutral-300'
                                    key={item.variation._id}
                                  >
                                    <img
                                      className='h-12 w-12'
                                      src={item.variation?.thumb ? item.variation.thumb : item.product.thumb[0]}
                                      alt='thumb'
                                    />
                                    <div className='flex flex-col justify-around'>
                                      <p className='text-sm font-medium text-neutral-700 line-clamp-1'>
                                        {item.product.name}
                                      </p>
                                      <p className='text-xs text-neutral-500 line-clamp-1'>
                                        {item.variation.keyVariation + ': ' + item.variation.keyVariationValue}{' '}
                                        {item.variation?.subVariation &&
                                          item.variation?.subVariation + ': ' + item.variation?.subVariationValue}
                                      </p>
                                    </div>
                                    <div className='ml-auto w-20 text-sm text-primary-red'>
                                      ₫{accounting.formatNumber(item.variation.price)}
                                    </div>
                                  </Link>
                                )
                              })}
                            </>
                          )
                        })}
                        <div className='mt-4 flex justify-end'>
                          <Link
                            className='text-sm text-neutral-500 hover:cursor-pointer hover:font-medium hover:text-neutral-800'
                            to='/cart'
                          >
                            View all
                          </Link>
                        </div>
                      </>
                    ) : (
                      <div className='flex flex-col items-center justify-center text-lg font-semibold text-neutral-500'>
                        <img className='h-24 w-24' src={empty_cart} alt='empty-cart' />
                        <div>
                          <p className='text-sm text-neutral-400'>Giỏ hàng của bạn đang trống</p>
                          <Link to='/' className='mt-4 flex justify-center'>
                            <AppButton>Mua sắm ngay</AppButton>
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div>Loading</div>
              )}
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  )
}

export default Cart
