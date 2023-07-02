/* eslint-disable react-hooks/exhaustive-deps */
import AppButton from '@src/components/AppButton'
import AppForm from '@src/components/Form/AppForm'
import AppInput from '@src/components/Form/AppInput'
import ProductTable from '../../components/ProductTable'
import { useGetAllProductQuery } from '../../adminService'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import ChooseCategory from '../../components/ChooseCategory'
import removeUndefinedObject from '@src/utils/removeUndefinedObject'
import * as Yup from 'yup'
import { useTitle } from '@src/hooks/useTitle'

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

function ProductAll() {
  const [filter, setFilter] = useState({
    name: 'all',
    page: 1,
    pageSize: 10,
    filter: {}
  })
  const [categoryId, setCategoryId] = useState()
  const { data: productList } = useGetAllProductQuery(filter)
  const navigate = useNavigate()
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)

  useTitle('Tất cả sản phẩm')

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
    navigate(`/shop/product/all?${queryString}`)
  }, [filter])

  const onTableChange = (data) => {
    setFilter({ ...filter, pageSize: data.pageSize, page: data.current })
  }

  function handleChooseCategory(id) {
    setCategoryId(id)
  }

  function onSubmit(data) {
    console.log('typeId: ', categoryId)
    console.log('filter data: ', removeUndefinedObject(data), categoryId)
    setFilter({
      ...filter,
      filter: {
        ...filter.filter,
        typeId: categoryId,
        stock: data.stock,
        sold: data.sale,
        name: data.name,
        sku: data.sku
      }
    })
  }

  console.log('filter:: ', filter)

  return (
    <div className=''>
      <div className='bg-neutral-100 p-8 rounded-lg'>
        <AppForm onSubmit={onSubmit} resolver={filterValidation}>
          <div className='grid grid-cols-12 gap-x-4'>
            <div className='col-span-5'>
              <ChooseCategory
                required={false}
                handleChooseCategory={handleChooseCategory}
                handleCategoryResponse={() => {}}
              />
            </div>
            <div className='col-span-5'>
              <AppInput className='col-span-3' id='keyword' name='keyword' label='Từ khóa' />
            </div>
            <div className='col-span-1'></div>
            <div className='col-span-2'>
              <AppInput id='minStock' name='stock.min' label='Kho hàng tôi thiểu' type='number' />
            </div>
            <div className='col-span-2'>
              <AppInput id='maxStock' name='stock.max' label='  Kho hàng tôi đa' type='number' />
            </div>
            <div className='col-span-2'>
              <AppInput id='minSale' name='sale.min' label='Doanh số tôi thiểu' type='number' />
            </div>
            <div className='col-span-2'>
              <AppInput id='maxSale' name='sale.max' label='  Doanh số tôi đa' type='number' />
            </div>
            <div className='col-span-2'>
              <AppInput id='sku' name='sku' label='SKU' />
            </div>
            <div className='flex items-end justify-end py-2'>
              <AppButton type='submit'>Lọc</AppButton>
            </div>
          </div>
        </AppForm>
      </div>

      <div className='bg-neutral-100 p-8 rounded-lg mt-6'>
        <div className='flex justify-between '>
          <div className='flex gap-6 '>
            <div className='w-4 h-7 bg-secondary-purple rounded-sm'></div>
            <div className='text-neutral-500 font-semibold text-xl '>Danh sách sản phẩm</div>
          </div>
          <nav className='flex gap-3'>
            <div
              onClick={() => handleFilterStatus('all')}
              className={`${
                filter.name === 'all' ? 'bg-secondary-green text-neutral-50' : 'text-neutral-400'
              }h-10 px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition hover:text-neutral-500 cursor-pointer`}
            >
              Tất cả
            </div>
            <div
              onClick={() => handleFilterStatus('active')}
              className={`${
                filter.name === 'active' ? 'bg-secondary-green text-neutral-50' : 'text-neutral-400'
              }h-10 px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition hover:text-neutral-500 cursor-pointer`}
            >
              Đang hoạt động
            </div>
            <div
              onClick={() => handleFilterStatus('oot')}
              className={`${
                filter.name === 'oot' ? 'bg-secondary-green text-neutral-50' : 'text-neutral-400'
              }h-10 px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition hover:text-neutral-500 cursor-pointer`}
            >
              Hết hàng
            </div>
            <div
              onClick={() => handleFilterStatus('inactive')}
              className={`${
                filter.name === 'inactive' ? 'bg-secondary-green text-neutral-50' : 'text-neutral-400'
              }h-10 px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition hover:text-neutral-500 cursor-pointer`}
            >
              Đã ẩn
            </div>
          </nav>
        </div>
        <div className='mt-6'>
          {productList ? <ProductTable onTableChange={onTableChange} data={productList.metadata} /> : null}
        </div>
      </div>
    </div>
  )
}

export default ProductAll
