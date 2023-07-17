import accounting from 'accounting'
import { Link } from 'react-router-dom'

function ProductInOrder({ product }) {
  return (
    <div
      className='my-1 flex items-center gap-4 rounded-md p-2 transition hover:cursor-pointer hover:bg-secondary-purple'
      key={product.variation._id}
    >
      <Link
        className='flex items-center gap-4'
        to={`/product/${product.product._id}`}
        target='_blank'
        rel='noopener noreferrer'
      >
        <img
          src={product.variation?.thumb ? product.variation.thumb : product.product.thumb[0]}
          alt='thumb'
          className='h-16 w-16 object-cover'
        />
        <div>
          <p className='text-base font-medium text-neutral-700 line-clamp-2'>{product.product.name}</p>
          <p className='text-sm text-neutral-500 line-clamp-2'>
            {product.variation.keyVariation + ': ' + product.variation.keyVariationValue}{' '}
            {product.variation?.subVariation &&
              product.variation?.subVariation + ': ' + product.variation?.subVariationValue}
            {' Còn '}
            {product.variation.stock}
            {' sản phẩm'}
          </p>
        </div>
      </Link>
      <div className='ml-auto flex gap-3'>
        <div className='ml-auto w-36'>
          <p className='text-left text-base font-semibold text-primary-red'>
            {accounting.formatNumber(product.variation.price)}₫
          </p>
        </div>
        <div className='flex items-center gap-2'>
          <div className='flex h-9 items-center justify-center border-[1px] border-neutral-300 text-sm'>
            Số lượng: {product.quantity}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductInOrder
