/* eslint-disable react-hooks/exhaustive-deps */
import AppButton from '@src/components/AppButton'
import AppDateInput from '@src/components/Form/AppDateInput'
import AppForm from '@src/components/Form/AppForm'
import AppInput from '@src/components/Form/AppInput'
import AppSelect from '@src/components/Form/AppSelect'
import { ORDER_STATUS_ARRAY } from '@src/configs'
import removeUndefinedObject from '@src/utils/removeUndefinedObject'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import * as Yup from 'yup'
import { adminApi } from '../../adminService'
import OrderTable from '../../components/OrderTable'

const filterValidation = Yup.object({
  type: Yup.string(),
  name: Yup.string(),
  stock: Yup.object({
    min: Yup.number()
      .transform((value, originalValue) => (originalValue === '' ? null : value))
      .min(0, 'Minimum stock must be greater than or equal to 0')
      .test('minLessThanMax', 'Minimum stock must be less than maximum stock', function (value) {
        const { max } = this.parent
        if (!max) return true
        else return value < max
        // console.log('value:: ', max, value)
        // return value === null || value === undefined || max === null || max === undefined || value < max
      })
      .nullable(),
    max: Yup.number()
      .transform((value, originalValue) => (originalValue === '' ? null : value))
      .min(0, 'Maximum stock must be greater than or equal to 0')
      .test('maxGreaterThanMin', 'Maximum stock must be greater than minimum stock', function (value) {
        const { min } = this.parent
        if (!min) return true
        else return value > min
        // return value === null || value === undefined || min === null || min === undefined || value > min
      })
      .nullable()
  }),
  sale: Yup.object({
    min: Yup.number()
      .transform((value, originalValue) => (originalValue === '' ? null : value))
      .min(0, 'Minimum stock must be greater than or equal to 0')
      .test('minLessThanMax', 'Minimum stock must be less than maximum stock', function (value) {
        const { max } = this.parent
        return value === null || value === undefined || max === null || max === undefined || value < max
      })
      .nullable(),
    max: Yup.number()
      .transform((value, originalValue) => (originalValue === '' ? null : value))
      .min(0, 'Maximum stock must be greater than or equal to 0')
      .test('maxGreaterThanMin', 'Maximum stock must be greater than minimum stock', function (value) {
        const { min } = this.parent
        return value === null || value === undefined || min === null || min === undefined || value > min
      })
      .nullable()
  })
})

function OrderAll() {
  const [filter, setFilter] = useState({
    name: 'all',
    page: 1,
    pageSize: 10,
    filter: {}
  })

  const [getOrderList, { data: orderList }] = adminApi.endpoints.getOrderByShop.useLazyQuery()

  const navigate = useNavigate()
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)

  console.log('orderList:: ', orderList)

  const handleFilterStatus = (type) => {
    switch (type) {
      case 'all': {
        setFilter({ ...filter, name: 'all', filter: {} })
        break
      }
      case 'active': {
        setFilter({ ...filter, name: 'active', filter: { isDraft: false } })
        break
      }
      case 'inactive': {
        setFilter({ ...filter, name: 'inactive', filter: { isDraft: true } })
        break
      }
      case 'oot': {
        setFilter({ ...filter, name: 'oot', filter: { stock: 0 } })
        break
      }
      default: {
        setFilter({ ...filter, name: 'all', filter: {} })
      }
    }
  }

  useEffect(() => {
    getOrderList()
  }, [])

  useEffect(() => {
    const searchFilter = searchParams.get('filter')
    const originalFilter = searchFilter ? JSON.parse(searchFilter) : {}
    const filter = {
      isDraft: originalFilter.isDraft,
      stock: originalFilter.stock
    }
    console.log('filter:: ', filter)
    if (filter?.isDraft === true) {
      setFilter({
        name: 'inactive',
        page: searchParams.get('page') || 1,
        filter: filter,
        pageSize: searchParams.get('pageSize')
      })
    } else if (filter?.isDraft === false) {
      setFilter({
        name: 'active',
        page: searchParams.get('page') || 1,
        filter: filter,
        pageSize: searchParams.get('pageSize')
      })
    } else if (filter?.stock === 0) {
      setFilter({
        name: 'oot',
        page: searchParams.get('page') || 1,
        filter: filter,
        pageSize: searchParams.get('pageSize')
      })
    } else
      setFilter({
        name: 'all',
        page: searchParams.get('page') || 1,
        filter: filter,
        pageSize: searchParams.get('pageSize')
      })
  }, [])

  useEffect(() => {
    const params = new URLSearchParams({
      page: filter.page,
      pageSize: filter.pageSize,
      filter: JSON.stringify(filter.filter)
    })
    const queryString = params.toString()
    navigate(`/shop/order/all?${queryString}`)
  }, [filter])

  // const onTableChange = (data) => {
  //   setFilter({ ...filter, pageSize: data.pageSize, page: data.current })
  // }

  function onSubmit(data) {
    console.log('filter data: ', removeUndefinedObject(data))
    setFilter({
      ...filter,
      filter: {
        ...filter.filter,
        stock: data.stock,
        sold: data.sale,
        name: data.name,
        sku: data.sku
      }
    })
  }

  console.log('ORDER_STATUS_ARRAY:: ', ORDER_STATUS_ARRAY)

  return (
    <div className=''>
      <div className='bg-neutral-100 px-8 py-2 rounded-lg'>
        <AppForm onSubmit={onSubmit} resolver={filterValidation}>
          <div className='grid grid-cols-12 gap-x-4'>
            <div className='col-span-3'>
              <AppSelect id='type' name='type' label='Tìm kiếm theo' required />
            </div>
            <div className='col-span-4'>
              <AppInput className='col-span-3' id='keyword' name='keyword' label='Từ khóa' />
            </div>
            <div className='col-span-2'>
              <AppDateInput id='fromDay' name='from' required label='Đặt hàng từ' />
            </div>
            <div className='col-span-2'>
              <AppDateInput id='toDay' name='to' required label='Đến ngày' />
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
            {ORDER_STATUS_ARRAY.map((status) => (
              <div
                key={status.value}
                onClick={() => handleFilterStatus(status.value)}
                className={`${
                  filter.name === status.value ? 'bg-secondary-green text-neutral-50' : 'text-neutral-500'
                } h-7 px-1 py-1 text-sm rounded-lg font-medium hover:opacity-90 transition hover:text-neutral-700 hover:bg-neutral-300 cursor-pointer`}
              >
                {status.name}
              </div>
            ))}
          </nav>
        </div>
        <div className='flex gap-2 justify-end mt-2'>
          <AppButton className='h-8 px-2 py-1 text-sm font-medium'>Xác nhận</AppButton>
          <AppButton className='h-8 px-2 py-1 text-sm font-medium'>Từ chối</AppButton>
          <AppButton className='h-8 px-2 py-1 text-sm font-medium'>Giao hàng</AppButton>
        </div>
        <div className='mt-6'>
          <OrderTable data={orderList?.metadata} />
        </div>
      </div>
    </div>
  )
}

export default OrderAll
