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

  useEffect(() => {
    const typeId = searchParams.get('typeId')
    if (!isEmpty(typeId)) {
      getCategory({ id: typeId })
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
        <div className='col-span-2 bg-neutral-0 p-3 rounded-md shadow-lg'>
          <h4 className='text-lg font-semibold text-neutral-500 mb-3'>Bộ lọc tìm kiếm</h4>
          <div className='mb-2'>
            <div className='text-neutral-700 font-medium mb-2'>Khoảng giá</div>
            <AppForm onSubmit={handleFilterPrice}>
              <AppInput type='number' name='minPrice' placeholder='Từ' />
              <AppInput type='number' name='maxPrice' placeholder='Đến' />
              <AppButton type='submit' className='w-full h-9 bg-orange-4 text-neutral-0 hover:bg-orange-3'>
                Áp dụng
              </AppButton>
            </AppForm>
          </div>
          {filters.map((filter) => {
            return (
              <div className='mb-4' key={filter.name}>
                <div className='text-neutral-700 font-medium mb-2'>{filter.name}</div>
                {filter.value.map((item) => {
                  return (
                    <div
                      className='flex px-3 rounded-sm gap-4 h-8 items-center my-1 hover:bg-neutral-300 transition cursor-pointer'
                      key={item.name}
                    >
                      <input
                        className='w-3 h-3 cursor-pointer'
                        id={item.value}
                        type='checkbox'
                        value={item.value}
                        name={item.name}
                      />
                      <label className='text-sm text-neutral-500 cursor-pointer' htmlFor={item.value}>
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
          <div className='flex gap-3 bg-neutral-200 rounded-md p-4 mt-4'>
            <div className='px-3 h-9 flex items-center text-sm '>Sắp xếp theo</div>
            <div className='px-3 h-9 flex items-center text-sm bg-neutral-0 rounded-sm hover:bg-neutral-100'>
              Mới nhất
            </div>
            <div className='px-3 h-9 flex items-center text-sm bg-neutral-0 rounded-sm hover:bg-neutral-100'>
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
          <div className='mt-4 p-4 rounded-lg bg-neutral-0'>
            <div className='grid grid-cols-5 gap-4'>
              {isGettingProduct ? (
                <div className='flex justify-center items-center'>
                  <BeatLoader size={12} color='#ff4d00' />
                </div>
              ) : !isEmpty(products?.metadata?.products) ? (
                products?.metadata?.products?.map((product) => (
                  <div key={product.name}>
                    <ProductCard product={product} />
                  </div>
                ))
              ) : (
                <div className='w-full lex justify-center items-center'>Không tìm thấy sản phẩm</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductSearch
