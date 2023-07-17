/* eslint-disable react-hooks/exhaustive-deps */
import AppButton from '@src/components/AppButton'
import Divider from '@src/components/Divider'
import AppForm from '@src/components/Form/AppForm'
import AppInput from '@src/components/Form/AppInput'
import AppSelect from '@src/components/Form/AppSelect'
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router'
import ProductCard from '../../components/ProductCard'
import customerApi from '../../customer.service'
import { BeatLoader } from 'react-spinners'
import { isEmpty } from 'lodash'
import appApi from '@src/redux/service'
import { useTitle } from '@src/hooks/useTitle'
import no_product from '@src/assets/images/no_product.png'

let filters = [
  {
    name: 'Nơi bán',
    value: [
      { name: 'Hà Nội', value: 'test' },
      { name: 'Hà Tĩnh', value: 'test' },
      { name: 'Thành phố Hồ Chí Minh', value: 'test' },
      { name: 'Đà Năng', value: 'test' },
      { name: 'Vinh', value: 'test' }
    ]
  },
  {
    name: 'Tình trạng',
    value: [
      { name: 'Mới', value: '1' },
      { name: 'Cũ', value: '0' }
    ]
  }
]

function ProductSearch() {
  // const [getProducts, { data: products }] = customerApi.endpoints.getAllProducts.useLazyQuery()
  const [filterSet, setFilterSet] = useState({ minPrice: null, maxPrice: null })
  const [filterProduct, { data: products, isFetching: isGettingProduct }] =
    customerApi.endpoints.filterProduct.useLazyQuery()
  const [getCategory, { data: categories }] = appApi.endpoints.getCategory.useLazyQuery()
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const searchText = searchParams.get('keyword')

  useTitle('Khám phá - Sopy')

  useEffect(() => {
    const typeId = searchParams.get('typeId')
    if (!isEmpty(typeId)) {
      getCategory({ id: typeId }, false)
    }

    const filter = {
      name: searchParams.get('keyword') || '',
      typeId: typeId || ''
    }

    if (!isEmpty(filterSet.minPrice)) {
      filter.minPrice = filterSet.minPrice
    }

    if (!isEmpty(filterSet.maxPrice)) {
      filter.maxPrice = filterSet.maxPrice
    }

    filterProduct(filter, false)
  }, [location, filterSet])

  useEffect(() => {
    let categoryList = []
    if (!isEmpty(categories)) {
      categories.metadata.subTypes.forEach((type) => {
        categoryList.push({
          name: type.name,
          value: type._id
        })
      })

      filters.unshift({
        name: 'Danh mục',
        value: categoryList
      })
    }
  }, [categories])

  const handleFilterPrice = (data) => {
    console.log('data:: ', data)
    setFilterSet({
      ...filterSet,
      minPrice: data.minPrice,
      maxPrice: data.maxPrice
    })
  }

  console.log('pcategories: ', categories)
  return (
    <div className='container mx-auto'>
      <div className='grid grid-cols-12 gap-3'>
        <div className='col-span-2 rounded-md bg-neutral-0 p-3 shadow-lg'>
          <h4 className='mb-3 text-lg font-semibold text-neutral-500'>Bộ lọc tìm kiếm</h4>
          <div className='mb-2'>
            <div className='mb-2 font-medium text-neutral-700'>Khoảng giá</div>
            <AppForm onSubmit={handleFilterPrice}>
              <AppInput type='number' name='minPrice' placeholder='Từ' />
              <AppInput type='number' name='maxPrice' placeholder='Đến' />
              <AppButton type='submit' className='h-9 w-full bg-orange-4 text-neutral-0 hover:bg-orange-3'>
                Áp dụng
              </AppButton>
            </AppForm>
          </div>
          {filters.map((filter) => {
            return (
              <div className='mb-4' key={filter.name}>
                <div className='mb-2 font-medium text-neutral-700'>{filter.name}</div>
                {filter.value.map((item) => {
                  return (
                    <div
                      className='my-1 flex h-8 cursor-pointer items-center gap-4 rounded-sm px-3 transition hover:bg-neutral-300'
                      key={item.name}
                    >
                      <input
                        className='h-3 w-3 cursor-pointer'
                        id={item.value}
                        type='checkbox'
                        value={item.value}
                        name={item.name}
                      />
                      <label className='cursor-pointer text-sm text-neutral-500' htmlFor={item.value}>
                        {item.name}
                      </label>
                    </div>
                  )
                })}
                <Divider />
              </div>
            )
          })}
        </div>

        <div className='col-span-10'>
          {searchText ? <div>Kết quả tìm kiếm cho từ khóa &apos;{searchText}&apos;</div> : null}
          <div className='mt-4 flex gap-3 rounded-md bg-neutral-200 p-4'>
            <div className='flex h-9 items-center px-3 text-sm '>Sắp xếp theo</div>
            <div className='flex h-9 items-center rounded-sm bg-neutral-0 px-3 text-sm hover:bg-neutral-100'>
              Mới nhất
            </div>
            <div className='flex h-9 items-center rounded-sm bg-neutral-0 px-3 text-sm hover:bg-neutral-100'>
              Bán chạy
            </div>

            <AppForm>
              <AppSelect
                placeholder='Giá'
                options={[
                  {
                    name: 'Giá thấp đến cao',
                    value: 1
                  },
                  {
                    name: 'Giá cao đến thấp',
                    value: 0
                  }
                ]}
                name='price'
              />
            </AppForm>
          </div>
          <div className='mt-4 rounded-lg bg-neutral-0 p-4'>
            {isGettingProduct ? (
              <div className='flex items-center justify-center'>
                <BeatLoader size={12} color='#ff4d00' />
              </div>
            ) : !isEmpty(products?.metadata?.products) ? (
              <div className='grid grid-cols-5 gap-4'>
                {products?.metadata?.products?.map((product) => (
                  <div key={product.name}>
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            ) : (
              <div className='flex w-full items-center justify-center'>
                <div>
                  <img src={no_product} alt='no-product' />
                  <p className='text-center text-neutral-600'>Không tìm thấy sản phẩm!</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductSearch
