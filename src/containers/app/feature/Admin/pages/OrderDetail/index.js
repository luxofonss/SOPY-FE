/* eslint-disable react-hooks/exhaustive-deps */
import { CreditCardIcon, MapPinIcon } from '@heroicons/react/20/solid'
import Divider from '@src/components/Divider'
import OrderStatusHistory from '@src/components/OrderStatusHistory'
import accounting from 'accounting'
import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { adminApi } from '../../adminService'

function OrderDetail() {
  const { id } = useParams()

  const [getOrder, { data: orderDetails }] = adminApi.endpoints.getOneOrderByShop.useLazyQuery()

  useEffect(() => {
    getOrder(id).catch(() => toast.error('Có lỗi xảy ra, vui lòng thử lại!'))
  }, [])

  console.log('orderDetails:: ', orderDetails)

  return (
    <>
      <div className='container mx-auto '>
        <div className='grid grid-cols-12 gap-3'>
          <div className='col-span-8'>
            <div className='p-3 bg-white rounded-sm'>
              <p className='text-neutral-600 font-semibold mb-2'>Danh sách sản phẩm</p>
              {orderDetails?.metadata?.products.map((product) => {
                return (
                  <div
                    className='flex items-center gap-4 p-2 my-1 border-[1px] border-neutral-300 rounded-md hover:bg-secondary-purple hover:cursor-pointer transition'
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
                        className='w-16 h-16 object-cover'
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
                    <div className='flex gap-3 ml-auto'>
                      <div className='w-36 ml-auto'>
                        <p className='text-base font-semibold text-primary-red text-left'>
                          {accounting.formatNumber(product.variationId.price)}₫
                        </p>
                      </div>
                      <div className='flex gap-2 items-center'>
                        <div className='h-9 px-1 flex items-center text-sm justify-center border-neutral-300 border-[1px]'>
                          Số lượng: {product.quantity}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
            <div className='p-3 bg-white mt-3 rounded-sm'>
              <OrderStatusHistory order={orderDetails?.metadata} />
            </div>
          </div>
          <div className='col-span-4'>
            <div className='bg-white px-3 py-1 rounded-md'>
              <div>
                <div className='flex w-full justify-center'></div>
                <h4 className='font-semibold text-neutral-600'>Địa điểm</h4>
                <div className='flex gap-4'>
                  <MapPinIcon className='w-6 h-6 bg-white' />
                  <div>
                    <p>{orderDetails?.metadata?.shipping?.address}</p>
                  </div>
                </div>
                <div className='h-6 flex justify-between items-center text-sm'>
                  <p className='text-neutral-500 font-medium'>Người nhận</p>
                  <Link to={`/user/${orderDetails?.metadata?.userId?._id}`} className='text-neutral-500'>
                    {orderDetails?.metadata?.userId?.name}
                  </Link>
                </div>
                <div className='h-6 flex justify-between items-center text-sm'>
                  <p className='text-neutral-500 font-medium'>Số điện thoại</p>
                  <p className='text-neutral-500'>{orderDetails?.metadata?.userId?.phoneNumber}</p>
                </div>
                <div className='h-6 flex justify-between items-center text-sm'>
                  <p className='text-neutral-500 font-medium'>Email</p>
                  <p className='text-neutral-500'>{orderDetails?.metadata?.userId?.email}</p>
                </div>
                <Divider />

                <div>
                  <h4 className='text-neutral-700 font-semibold text-md'>Phương thức thanh toán</h4>
                  {orderDetails?.metadata?.payment?.method === 'COD' && (
                    <div className='p-4 flex gap-4 border-primary-green border-[1px] rounded-md hover:bg-neutral-200 transition'>
                      <CreditCardIcon className='w-6 h-6 text-secondary-green' />
                      <p className='text-sm text-neutral-500'>Thanh toán khi nhận hàng</p>
                    </div>
                  )}

                  <Divider />
                  <h4 className='text-neutral-700 font-semibold text-md'>Thông tin đơn hàng</h4>
                  <div className='h-9 flex justify-between items-center text-sm'>
                    <p className='text-neutral-500 font-medium'>Tạm tính</p>
                    <p className='text-neutral-500'>
                      ₫{accounting.formatNumber(orderDetails?.metadata?.checkout?.totalPrice)}
                    </p>
                  </div>
                  <div className='h-9 flex justify-between items-center text-sm'>
                    <p className='text-neutral-500 font-medium'>Phí vận chuyển</p>
                    <p className='text-neutral-500'>
                      ₫{accounting.formatNumber(orderDetails?.metadata?.checkout?.shipFee)}
                    </p>
                  </div>
                  <div className='h-9 flex justify-between items-center text-sm'>
                    <p className='text-neutral-500 font-medium'>Giảm giá voucher</p>
                    <p className='text-neutral-500'>- ₫{orderDetails?.metadata?.checkout?.discount || 0}</p>
                  </div>
                  <Divider />
                  <div className='h-9 flex justify-between items-center'>
                    <p className='text-neutral-500 font-medium'>Tổng cộng</p>
                    <p className='text-primary-red text-lg'>
                      ₫
                      {accounting.formatNumber(
                        orderDetails?.metadata?.checkout?.totalPrice +
                          orderDetails?.metadata?.checkout?.shipFee -
                          (orderDetails?.metadata?.checkout?.discount || 0)
                      )}
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

export default OrderDetail
