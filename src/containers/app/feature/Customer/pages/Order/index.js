/* eslint-disable react-hooks/exhaustive-deps */
import { BuildingStorefrontIcon } from '@heroicons/react/20/solid'
import AppButton from '@src/components/AppButton'
import AppForm from '@src/components/Form/AppForm'
import AppInput from '@src/components/Form/AppInput'
import AppModal from '@src/components/Modal'
import ProductInOrder from '@src/components/ProductInOrder'
import { ORDER_STATUS, ORDER_STATUS_ARRAY } from '@src/configs'
import { Divider } from 'antd'
import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import customerApi from '../../customer.service'
import AppSelect from '@src/components/Form/AppSelect'
import removeUndefinedObject from '@src/utils/removeUndefinedObject'
import { toast } from 'react-toastify'
import accounting from 'accounting'
import { useTitle } from '@src/hooks/useTitle'

function Order() {
  const [selectId, setSelectId] = useState(null)
  const [selectStatus, setSelectStatus] = useState('')
  const closeConfirmRef = useRef()
  const openRef = useRef()
  const navigate = useNavigate()
  const [getOrders, { data: orderList, isLoading: isGettingOrders }] =
    customerApi.endpoints.getUserOrders.useLazyQuery()
  const [cancelOrder, { isLoading: isCancellingOrder }] = customerApi.endpoints.cancelOrder.useMutation()

  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)

  useTitle('Đơn hàng của tôi - Sopy')

  useEffect(() => {
    console.log('useEffect works')
    getOrders(removeUndefinedObject({ status: searchParams.get('status') }), false).catch((error) =>
      console.log('error', error)
    )
  }, [location])

  useEffect(() => {
    const params = new URLSearchParams({ status: selectStatus })
    navigate(`/me/orders?${params.toString()}`)
  }, [selectStatus])

  const handleConfirm = async (data) => {
    console.log('selectId:: ', selectId)
    console.log(isGettingOrders)
    const response = await cancelOrder({ orderId: selectId, reason: data.reason })
    if (response.error) {
      toast.error(response.error.data.message)
    } else {
      closeConfirmRef.current.closeModal()
      toast.success('Hủy đơn hàng thành công')
      getOrders(removeUndefinedObject({ status: searchParams.get('status') }), false).catch((error) =>
        console.log('error', error)
      )
    }
  }

  const handleFilterDate = (data) => {
    console.log(data)
  }

  return (
    <div className='w-full px-4 bg-neutral-200 rounded-md'>
      <div className='w-full'>
        <div className='text-neutral-500 font-semibold text-xl '>Danh sách đơn hàng</div>
        <div className='w-full grid grid-cols-12 gap-3 px-2 bg-white rounded-2xl '>
          <nav className='col-span-10 grid grid-cols-4 gap-3 p-3 mt-3'>
            <div
              onClick={() => setSelectStatus('')}
              className={`${
                selectStatus === '' ? 'bg-secondary-green text-neutral-50' : 'text-neutral-500'
              } w-4/5 flex justify-center h-7 px-1 py-1 text-sm rounded-lg font-medium hover:opacity-90 transition hover:text-neutral-700 hover:bg-neutral-300 cursor-pointer`}
            >
              Tất cả
            </div>
            {ORDER_STATUS_ARRAY.map((status) => (
              <div
                key={status.value}
                onClick={() => setSelectStatus(status.value)}
                className={`${
                  selectStatus === status.value ? 'bg-primary-green text-neutral-50' : 'text-neutral-500'
                } w-4/5 flex justify-center h-7 px-1 py-1 text-sm rounded-lg font-medium hover:opacity-90 transition hover:text-neutral-700 hover:bg-neutral-300 cursor-pointer`}
              >
                {status.name}
              </div>
            ))}
          </nav>
          <div className='col-span-2'>
            <AppForm onSubmit={handleFilterDate}>
              <AppSelect
                className='w-36'
                id='type'
                name='type'
                options={[
                  { name: 'Toàn thời gian', value: 0 },
                  { name: '3 tháng', value: 1 },
                  { name: '6 tháng', value: 2 },
                  { name: '1 năm', value: 3 }
                ]}
                required
              />
            </AppForm>
          </div>
        </div>
        <div className='w-full rounded-2xl mt-3'>
          <AppModal closeRef={closeConfirmRef} openRef={openRef}>
            <div className='w-[450px] bg-neutral-200 rounded-lg p-4'>
              <h4 className='text-base text-neutral-600 font-medium'>Hủy đơn hàng</h4>
              <AppForm onSubmit={handleConfirm}>
                <AppInput placeholder='Lý do hủy' name='reason' id='reason' />
                <div className='flex justify-center gap-4 items-center mt-6'>
                  <AppButton
                    type='button'
                    onClick={() => {
                      closeConfirmRef.current.closeModal()
                    }}
                  >
                    Hủy
                  </AppButton>
                  <AppButton isLoading={isCancellingOrder} type='submit'>
                    Xác nhận
                  </AppButton>
                </div>
              </AppForm>
            </div>
          </AppModal>
          {orderList
            ? orderList.metadata.orders.map((order) => {
                return (
                  <div className='bg-neutral-0 p-4 mb-4 rounded-md' key={order._id}>
                    <div className='flex justify-between'>
                      <div className='flex items-center gap-2'>
                        <p>{order.shop?.name}</p>
                        <Link
                          to={`/shop/${order.shop._id}`}
                          className='flex px-2 py-1 items-center gap-2 border-[1px] border-neutral-300 rounded-sm hover:bg-orange-1 transition'
                        >
                          <p className='text-sm'>Xem shop</p>
                          <BuildingStorefrontIcon className='w-4 h-4' />
                        </Link>
                        <Link
                          to={`/me/orders/${order._id}`}
                          className='flex px-2 py-1 items-center gap-2 border-[1px] border-neutral-300 rounded-sm'
                        >
                          <p className='text-sm'>Chi tiết</p>
                        </Link>
                      </div>

                      <div className='flex items-center gap-3'>
                        <p>{ORDER_STATUS[order.status].name}</p>
                        {ORDER_STATUS[order.status].value === ORDER_STATUS.PENDING.value ? (
                          <AppButton
                            onClick={() => {
                              setSelectId(order._id)
                              openRef.current.openModal()
                            }}
                            className='h-8 px-2 py-1 text-sm font-medium'
                          >
                            Hủy đơn hàng
                          </AppButton>
                        ) : null}
                      </div>
                    </div>
                    <Divider />
                    {order.products.map((product) => {
                      return <ProductInOrder key={product.variation._id + product.quantity} product={product} />
                    })}
                    <Divider />
                    <div className='mt-4'>
                      <div className=' flex gap-3 justify-end'>
                        <p>Phí ship:</p>
                        <p>{accounting.formatNumber(order.checkout.shipFee)}₫</p>
                      </div>
                      <div className=' flex gap-3 justify-end'>
                        <p>Tổng giá:</p>
                        <p className='text-orange-4'>
                          {accounting.formatNumber(order.checkout.totalPrice + order.checkout.shipFee)}₫
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })
            : null}
          {orderList && orderList.metadata.orders.length === 0 ? (
            <div className='flex items-center justify-center p-4 rounded-lg bg-neutral-0 text-neutral-500 font-medium'>
              Bạn không có đơn hàng trong mục này
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default Order
