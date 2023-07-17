/* eslint-disable react-hooks/exhaustive-deps */
import { CreditCardIcon, MapPinIcon } from '@heroicons/react/20/solid'
import Divider from '@src/components/Divider'
import OrderStatusHistory from '@src/components/OrderStatusHistory'
import accounting from 'accounting'
import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { adminApi } from '../../adminService'
import { useTitle } from '@src/hooks/useTitle'

function OrderDetail() {
  const { id } = useParams()

  const [getOrder, { data: orderDetails }] = adminApi.endpoints.getOneOrderByShop.useLazyQuery()

  useTitle('Quản lý đơn hàng')

  useEffect(() => {
    getOrder(id).catch(() => toast.error('Có lỗi xảy ra, vui lòng thử lại!'))
  }, [])

  console.log('orderDetails:: ', orderDetails)

  return (
    <>
      <div className='container mx-auto '>
        <div className='grid grid-cols-12 gap-3'>
          <div className='col-span-8'>
            <div className='rounded-sm bg-white p-3'>
              <p className='mb-2 font-semibold text-neutral-600'>Danh sách sản phẩm</p>
              {orderDetails?.metadata?.products.map((product) => {
                return (
                  <div
                    className='my-1 flex items-center gap-4 rounded-md border-[1px] border-neutral-300 p-2 transition hover:cursor-pointer hover:bg-secondary-purple'
                    key={product.variationId._id}
                  >
                    <Link
                      className='flex items-center gap-4'
                      to={`/product/${product.productId._id}`}
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      <img
                        src={product.variationId?.thumb ? product.variationId.thumb : product.productId.thumb[0]}
                        alt='thumb'
                        className='h-16 w-16 object-cover'
                      />
                      <div>
                        <p className='text-base font-medium text-neutral-700 line-clamp-2'>{product.productId.name}</p>
                        <p className='text-sm text-neutral-500 line-clamp-2'>
                          {product.variationId.keyVariation + ': ' + product.variationId.keyVariationValue}{' '}
                          {product.variationId?.subVariation &&
                            product.variationId?.subVariation + ': ' + product.variationId?.subVariationValue}
                          {' Còn '}
                          {product.variationId.stock}
                          {' sản phẩm'}
                        </p>
                      </div>
                    </Link>
                    <div className='ml-auto flex gap-3'>
                      <div className='ml-auto w-36'>
                        <p className='text-left text-base font-semibold text-primary-red'>
                          {accounting.formatNumber(product.variationId.price)}₫
                        </p>
                      </div>
                      <div className='flex items-center gap-2'>
                        <div className='flex h-9 items-center justify-center border-[1px] border-neutral-300 px-1 text-sm'>
                          Số lượng: {product.quantity}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
            <div className='mt-3 rounded-sm bg-white p-3'>
              <OrderStatusHistory order={orderDetails?.metadata} />
            </div>
          </div>
          <div className='col-span-4'>
            <div className='rounded-md bg-white px-3 py-1'>
              <div>
                <div className='flex w-full justify-center'></div>
                <h4 className='font-semibold text-neutral-600'>Địa điểm</h4>
                <div className='flex gap-4'>
                  <MapPinIcon className='h-6 w-6 bg-white' />
                  <div>
                    <p>{orderDetails?.metadata?.shipping?.address}</p>
                  </div>
                </div>
                <div className='flex h-6 items-center justify-between text-sm'>
                  <p className='font-medium text-neutral-500'>Người nhận</p>
                  <Link to={`/user/${orderDetails?.metadata?.userId?._id}`} className='text-neutral-500'>
                    {orderDetails?.metadata?.userId?.name}
                  </Link>
                </div>
                <div className='flex h-6 items-center justify-between text-sm'>
                  <p className='font-medium text-neutral-500'>Số điện thoại</p>
                  <p className='text-neutral-500'>{orderDetails?.metadata?.userId?.phoneNumber}</p>
                </div>
                <div className='flex h-6 items-center justify-between text-sm'>
                  <p className='font-medium text-neutral-500'>Email</p>
                  <p className='text-neutral-500'>{orderDetails?.metadata?.userId?.email}</p>
                </div>
                <Divider />

                <div>
                  <h4 className='text-md font-semibold text-neutral-700'>Phương thức thanh toán</h4>
                  {orderDetails?.metadata?.payment?.method === 'COD' && (
                    <div className='flex gap-4 rounded-md border-[1px] border-primary-green p-4 transition hover:bg-neutral-200'>
                      <CreditCardIcon className='h-6 w-6 text-secondary-green' />
                      <p className='text-sm text-neutral-500'>Thanh toán khi nhận hàng</p>
                    </div>
                  )}

                  <Divider />
                  <h4 className='text-md font-semibold text-neutral-700'>Thông tin đơn hàng</h4>
                  <div className='flex h-9 items-center justify-between text-sm'>
                    <p className='font-medium text-neutral-500'>Tạm tính</p>
                    <p className='text-neutral-500'>
                      ₫{accounting.formatNumber(orderDetails?.metadata?.checkout?.totalPrice)}
                    </p>
                  </div>
                  <div className='flex h-9 items-center justify-between text-sm'>
                    <p className='font-medium text-neutral-500'>Phí vận chuyển</p>
                    <p className='text-neutral-500'>
                      ₫{accounting.formatNumber(orderDetails?.metadata?.checkout?.shipFee)}
                    </p>
                  </div>
                  <div className='flex h-9 items-center justify-between text-sm'>
                    <p className='font-medium text-neutral-500'>Giảm giá voucher</p>
                    <p className='text-neutral-500'>- ₫{orderDetails?.metadata?.checkout?.discount || 0}</p>
                  </div>
                  <Divider />
                  <div className='flex h-9 items-center justify-between'>
                    <p className='font-medium text-neutral-500'>Tổng cộng</p>
                    <p className='text-lg text-primary-red'>
                      ₫
                      {accounting.formatNumber(
                        orderDetails?.metadata?.checkout?.totalPrice +
                          orderDetails?.metadata?.checkout?.shipFee -
                          (orderDetails?.metadata?.checkout?.discount || 0)
                      )}
                    </p>
                  </div>
                  <div className='ml-auto flex justify-end text-sm text-neutral-400'>Đã bao gồm VAT (nếu có)</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default OrderDetail
