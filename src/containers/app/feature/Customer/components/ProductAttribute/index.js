import { get } from 'lodash'

function ProductAttribute({ data, attributes }) {
  console.log('attributes', attributes, data)
  return (
    <div className='mt-6 w-full rounded-md bg-neutral-0 p-4'>
      <div className='mb-4 text-lg font-medium text-neutral-600'>Thông tin chi tiết</div>
      <div className='grid grid-cols-2 gap-x-6'>
        <div className='min-h-10 flex'>
          <p className='h-full w-2/5 bg-neutral-300 px-3 py-1 text-neutral-500'>Thương hiệu</p>
          <p className={`h-full w-3/5 bg-neutral-200 px-3 py-1`}>{data?.branch}</p>
        </div>
        {attributes.map((attribute, index) => {
          let isGray = index % 4 === 0 || index % 4 === 1 ? true : false
          if (attribute !== null)
            if (attribute.type !== 'select')
              return (
                <div className='min-h-10 flex' key={attribute.path}>
                  <p className='h-full w-2/5 bg-neutral-300 px-3 py-1 text-neutral-500'>{attribute.name.vi}</p>
                  <p className={`h-full w-3/5 px-3 py-1 ${isGray ? 'bg-neutral-200' : 'bg-neutral-0'}`}>
                    {get(data.attributes, attribute.path)}
                  </p>
                </div>
              )
            else
              return (
                <div className='min-h-10 flex' key={attribute.path}>
                  <p className='h-full w-2/5 bg-neutral-300 px-3 py-1 text-neutral-500'>{attribute.name.vi}</p>
                  <p className={`h-full w-3/5 px-3 py-1 ${isGray ? 'bg-neutral-200' : 'bg-neutral-0'}`}>
                    {get(data.attributes, attribute.path + '[0]')}
                  </p>
                </div>
              )
          return null
        })}
      </div>
      <div className='my-4 text-lg font-medium text-neutral-600'>Mô tả sản phẩm</div>
      <p className='mb-4 p-3 text-sm font-medium text-neutral-600'>{data?.description}</p>
    </div>
  )
}

export default ProductAttribute
