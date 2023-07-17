import { NO_IMG } from '@src/configs'
import accounting from 'accounting'
import { Link } from 'react-router-dom'

const noImage = NO_IMG

function ProductCard({ product }) {
  return (
    <Link
      to={`/product/${product._id}`}
      className='flex w-full cursor-pointer flex-col gap-2 rounded-md border-[1px] border-neutral-300 bg-neutral-0 p-2 shadow-md transition hover:scale-105 hover:shadow-xl'
    >
      <img
        className='h-40 rounded-md object-cover'
        src={product?.thumb[0] ? product?.thumb[0] : noImage}
        alt='product'
      />
      <p className='mt-1 text-xs font-medium line-clamp-2'>{product?.name}</p>
      <div className='flex flex-1 items-end justify-between'>
        <p className='text-sm font-medium text-orange-4'>₫{accounting.formatNumber(product?.minPrice)}</p>
        <p className='text-xs font-normal text-neutral-400'>Đã bán {product.sold}</p>
      </div>
    </Link>
  )
}

export default ProductCard
