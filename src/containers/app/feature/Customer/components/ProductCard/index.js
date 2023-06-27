import accounting from 'accounting'
import { Link } from 'react-router-dom'

const noImage = process.env.NO_IMG

function ProductCard({ product }) {
  return (
    <Link
      to={`/product/${product._id}`}
      className='w-full flex flex-col gap-2 p-2 cursor-pointer bg-neutral-200 rounded-md hover:bg-neutral-300 hover:scale-105 transition'
    >
      <img
        className='rounded-md h-40 object-cover'
        src={product?.thumb[0] ? product?.thumb[0] : noImage}
        alt='product'
      />
      <p className='line-clamp-2 text-sm mt-1'>{product?.name}</p>
      <div className='flex justify-between items-end flex-1'>
        <p className='text-sm font-medium text-orange-4'>₫{accounting.formatNumber(product?.minPrice)}</p>
        <p className='text-xs font-normal text-neutral-500'>Đã bán {product.sold}</p>
      </div>
    </Link>
  )
}

export default ProductCard
