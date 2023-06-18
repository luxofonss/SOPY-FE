import { Link } from 'react-router-dom'

const noImage = process.env.NO_IMG

function ProductCard({ product }) {
  return (
    <Link
      to={`/product/${product._id}`}
      className='w-full flex flex-col gap-2 p-2 cursor-pointer bg-neutral-200 rounded-md hover:bg-secondary-purple hover:scale-105 transition'
    >
      <img
        className='rounded-md h-40 object-cover'
        src={product?.thumb[0] ? product?.thumb[0] : noImage}
        alt='product'
      />
      <p className='line-clamp-2 text-sm mt-1'>{product?.name}</p>
      <div className='flex justify-between items-end flex-1'>
        <p className='text-lg font-medium text-secondary-orange'>₫60.000</p>
        <p className='text-sm font-normal text-neutral-500'>Đã bán 209</p>
      </div>
    </Link>
  )
}

export default ProductCard
