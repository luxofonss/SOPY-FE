import { get } from 'lodash'

function ProductAttribute({ data, attributes }) {
  console.log('attributes', attributes, data)
  return (
    <div className='w-full rounded-md mt-6 p-4 bg-neutral-0'>
      <div className='text-lg font-medium text-neutral-600 mb-4'>Thông tin chi tiết</div>
      <div className='grid grid-cols-2 gap-x-6'>
        <div className='flex min-h-10'>
          <p className='w-2/5 h-full px-3 py-1 bg-neutral-300 text-neutral-500'>Thương hiệu</p>
          <p className={`w-3/5 h-full px-3 py-1 bg-neutral-200`}>{data?.branch}</p>
        </div>
        {attributes.map((attribute, index) => {
          let isGray = index % 4 === 0 || index % 4 === 1 ? true : false
          if (attribute !== null)
            if (attribute.type !== 'select')
              return (
                <div className='flex min-h-10' key={attribute.path}>
                  <p className='w-2/5 h-full px-3 py-1 bg-neutral-300 text-neutral-500'>{attribute.name.vi}</p>
                  <p className={`w-3/5 h-full px-3 py-1 ${isGray ? 'bg-neutral-200' : 'bg-neutral-0'}`}>
                    {get(data.attributes, attribute.path)}
                  </p>
                </div>
              )
            else
              return (
                <div className='flex min-h-10' key={attribute.path}>
                  <p className='w-2/5 h-full px-3 py-1 bg-neutral-300 text-neutral-500'>{attribute.name.vi}</p>
                  <p className={`w-3/5 h-full px-3 py-1 ${isGray ? 'bg-neutral-200' : 'bg-neutral-0'}`}>
                    {get(data.attributes, attribute.path + '[0]')}
                  </p>
                </div>
              )
          return null
        })}
      </div>
      <div className='text-lg font-medium text-neutral-600 my-4'>Mô tả sản phẩm</div>
      <p className='text-sm p-3 font-medium text-neutral-600 mb-4'>{data?.description}</p>
    </div>
  )
}

export default ProductAttribute
