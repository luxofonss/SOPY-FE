/* eslint-disable react-hooks/exhaustive-deps */
import AppButton from '@src/components/AppButton'
import AppDateInput from '@src/components/Form/AppDateInput'
import AppForm from '@src/components/Form/AppForm'
import AppInput from '@src/components/Form/AppInput'
import AppSelect from '@src/components/Form/AppSelect'
import { ORDER_FILTER, ORDER_STATUS_ARRAY } from '@src/configs'
import removeUndefinedObject from '@src/utils/removeUndefinedObject'
import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import * as Yup from 'yup'
import { adminApi } from '../../adminService'
import PopupAction from '../../../../../../components/PopupAction'
import OrderTable from '../../components/OrderTable'
import formatDate from '@src/utils/formatDate'

const filterValidation = Yup.object({
  trackingNumber: Yup.string(),
  customer: Yup.string(),
  productName: Yup.string(),
  startDate: Yup.date(),
  endDate: Yup.date()
})

function OrderAll() {
  const [filter, setFilter] = useState({
    filter: { trackingNumber: null, customer: null, productName: null },
    startDate: null,
    endDate: null,
    status: '',
    page: 1,
    sort: 'ctime',
    limit: 10
  })
  const [selectedOrders, setSelectedOrders] = useState([])
  const closeConfirmRef = useRef(null)
  const closeShippingRef = useRef(null)

  const [getOrderList, { data: orderList }] = adminApi.endpoints.getAndFilterOrder.useLazyQuery()
  const [confirmOrders, { isLoading: isConfirming }] = adminApi.endpoints.confirmOrders.useMutation()
  const [shippingOrders, { isLoading: isShipping }] = adminApi.endpoints.shippingOrders.useMutation()

  const navigate = useNavigate()
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)

  const now = new Date()
  const formattedDateNow = now.toISOString().slice(0, 10)

  const handleFilterStatus = (type) => {
    setFilter({ ...filter, status: type })
  }

  const refreshOrderList = async () => {
    await getOrderList(
      removeUndefinedObject({
        trackingNumber: searchParams.get('trackingNumber'),
        productName: searchParams.get('productName'),
        customer: searchParams.get('customer'),
        startDate: searchParams.get('startDate'),
        endDate: searchParams.get('endDate'),
        status: searchParams.get('status'),
        page: searchParams.get('page'),
        sort: searchParams.get('sort'),
        limit: searchParams.get('limit')
      }),
      false
    )
  }

  useEffect(() => {
    refreshOrderList()
  }, [location])

  useEffect(() => {
    const params = new URLSearchParams(
      removeUndefinedObject({
        ...filter.filter,
        startDate: filter.startDate,
        endDate: filter.endDate,
        status: filter.status,
        page: filter.page,
        sort: filter.sort,
        limit: filter.limit
      })
    )
    const queryString = params.toString()
    navigate(`/shop/order/all?${queryString}`)
  }, [filter])

  const onTableChange = (data) => {
    setFilter({ ...filter, pageSize: data.pageSize, page: data.current })
  }

  function onSubmit(data) {
    console.log('filter data: ', data)
    setFilter({
      ...filter,
      filter: { [data.type]: data.keyword },
      startDate: formatDate(data.startDate),
      endDate: formatDate(data.endDate)
    })
  }

  const onSelect = (selected) => {
    setSelectedOrders(selected)
  }

  console.log('filter:: ', filter)

  const handleConfirm = async () => {
    if (selectedOrders.length === 0) {
      toast.warn('Bạn chưa chọn đơn hàng')
      closeConfirmRef.current.closeModal()
    } else {
      const response = await confirmOrders({ orderIds: selectedOrders })
      if (response.error) {
        toast.error(response.error.data.message || 'Có lỗi xảy ra, vui lòng thực hiện lại')
      } else {
        toast.success('Cập nhật thành công')
        await refreshOrderList()
        closeConfirmRef.current.closeModal()
      }
    }
  }
  const handleShipping = async () => {
    if (selectedOrders.length === 0) {
      toast.warn('Bạn chưa chọn đơn hàng')
      closeShippingRef.current.closeModal()
    } else {
      const response = await shippingOrders({ orderIds: selectedOrders })
      if (response.error) {
        toast.error(response.error.data.message || 'Có lỗi xảy ra, vui lòng thực hiện lại')
      } else {
        toast.success('Cập nhật thành công')
        await refreshOrderList()
        closeShippingRef.current.closeModal()
      }
    }
  }

  return (
    <div className=''>
      <div className='bg-neutral-100 px-8 py-2 rounded-lg'>
        <AppForm onSubmit={onSubmit} resolver={filterValidation}>
          <div className='grid grid-cols-12 gap-x-4'>
            <div className='col-span-3'>
              <AppSelect id='type' name='type' options={ORDER_FILTER} label='Tìm kiếm theo' required />
            </div>
            <div className='col-span-4'>
              <AppInput className='col-span-3' id='keyword' name='keyword' label='Từ khóa' />
            </div>
            <div className='col-span-2'>
              <AppDateInput defaultValue='2000-01-01' id='startDate' name='startDate' label='Đặt hàng từ' />
            </div>
            <div className='col-span-2'>
              <AppDateInput defaultValue={formattedDateNow} id='endDate' name='endDate' label='Đến ngày' />
            </div>
            <div className='col-span-1 flex items-end justify-end py-2'>
              <AppButton type='submit'>Lọc</AppButton>
            </div>
          </div>
        </AppForm>
      </div>

      <div className='bg-neutral-100 p-8 rounded-lg mt-6'>
        <div className='flex justify-between '>
          <div className='flex gap-6 '>
            <div className='w-4 h-7 bg-secondary-purple rounded-sm'></div>
            <div className='text-neutral-500 font-semibold text-xl '>Danh sách đơn hàng</div>
          </div>
          <nav className='flex gap-3'>
            <div
              onClick={() => handleFilterStatus('')}
              className={`${
                filter.status === '' ? 'bg-secondary-green text-neutral-50' : 'text-neutral-500'
              } h-7 px-1 py-1 text-sm rounded-lg font-medium hover:opacity-90 transition hover:text-neutral-700 hover:bg-neutral-300 cursor-pointer`}
            >
              Tất cả
            </div>
            {ORDER_STATUS_ARRAY.map((status) => (
              <div
                key={status.value}
                onClick={() => handleFilterStatus(status.value)}
                className={`${
                  filter.status === status.value ? 'bg-primary-green text-neutral-50' : 'text-neutral-500'
                } h-7 px-1 py-1 text-sm rounded-lg font-medium hover:opacity-90 transition hover:text-neutral-700 hover:bg-neutral-300 cursor-pointer`}
              >
                {status.name}
              </div>
            ))}
          </nav>
        </div>
        <div className='flex gap-2 justify-end mt-2'>
          <PopupAction
            closeConfirmRef={closeShippingRef}
            isConfirming={isShipping}
            handleConfirm={handleShipping}
            triggerName='Giao hàng'
            heading='Giao hàng các đơn hàng hợp lệ được chọn'
          />
          <PopupAction
            closeConfirmRef={closeConfirmRef}
            isConfirming={isConfirming}
            handleConfirm={handleConfirm}
            triggerName='Xác nhận'
            heading='Xác nhận các đơn hàng hợp lệ được chọn'
          />
          <PopupAction
            closeConfirmRef={closeConfirmRef}
            isConfirming={isConfirming}
            handleConfirm={handleConfirm}
            triggerName='Xuất hóa đơn PDF'
            heading='Xuất hóa đơn các đơn hàng hợp lệ được chọn'
          />
          <PopupAction
            closeConfirmRef={closeConfirmRef}
            isConfirming={isConfirming}
            handleConfirm={handleConfirm}
            triggerName='Xuất hóa đơn excel'
            heading='Xuất hóa đơn các đơn hàng hợp lệ được chọn'
          />
        </div>
        <div className='mt-6'>
          <OrderTable
            onTableChange={onTableChange}
            refreshData={refreshOrderList}
            onSelect={onSelect}
            data={orderList?.metadata}
          />
        </div>
      </div>
    </div>
  )
}

export default OrderAll
