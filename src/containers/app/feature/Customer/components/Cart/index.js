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
      group inline-flex items-center rounded-md px-3 text-gray-700 py-2 text-base font-medium  hover:text-opacity-100 focus:outline-none focus-visible:ring-none focus-visible:ring-opacity-75`}
          >
            <div className='w-8 h-8 rounded-full flex justify-center items-center hover:bg--orange-3 transition'>
              <ShoppingCartIcon className='w-6 h-6 text-neutral-0' />
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
            <Popover.Panel className='absolute max-h-96 overflow-y-scroll shadow-xl bg-neutral-0 rounded-xl p-3 right-0 z-10 mt-3 w-96 border-2 max-w-sm transform sm:p-4 lg:max-w-3xl'>
              {cartData ? (
                <>
                  <div className='px-3'>
                    <h4 className='text-neutral-700 text-lg font-semibold'>Giỏ hàng của tôi</h4>
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
                                    className='flex gap-1 px-[1px] py-[2px] my-[2px] hover:bg-neutral-300 hover:cursor-pointer hover:translate-x-[2px] transition'
                                    key={item.variation._id}
                                  >
                                    <img
                                      className='w-12 h-12'
                                      src={item.variation?.thumb ? item.variation.thumb : item.product.thumb[0]}
                                      alt='thumb'
                                    />
                                    <div className='flex flex-col justify-around'>
                                      <p className='text-sm text-neutral-700 font-medium line-clamp-1'>
                                        {item.product.name}
                                      </p>
                                      <p className='text-xs text-neutral-500 line-clamp-1'>
                                        {item.variation.keyVariation + ': ' + item.variation.keyVariationValue}{' '}
                                        {item.variation?.subVariation &&
                                          item.variation?.subVariation + ': ' + item.variation?.subVariationValue}
                                      </p>
                                    </div>
                                    <div className='w-20 text-sm text-primary-red ml-auto'>
                                      ₫{accounting.formatNumber(item.variation.price)}
                                    </div>
                                  </Link>
                                )
                              })}
                            </>
                          )
                        })}
                        <div className='flex justify-end mt-4'>
                          <Link
                            className='text-neutral-500 text-sm hover:text-neutral-800 hover:font-medium hover:cursor-pointer'
                            to='/cart'
                          >
                            View all
                          </Link>
                        </div>
                      </>
                    ) : (
                      <div className='flex flex-col items-center justify-center text-lg text-neutral-500 font-semibold'>
                        <img className='w-24 h-24' src={empty_cart} alt='empty-cart' />
                        <div>
                          <p className='text-sm text-neutral-400'>Giỏ hàng của bạn đang trống</p>
                          <Link to='/' className='flex justify-center mt-4'>
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
