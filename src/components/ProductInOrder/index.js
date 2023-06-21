import accounting from 'accounting'
import { Link } from 'react-router-dom'

function ProductInOrder({ product }) {
  return (
    <div
      className='flex items-center gap-4 p-2 my-1 rounded-md hover:bg-secondary-purple hover:cursor-pointer transition'
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
          className='w-16 h-16 object-cover'
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
      <div className='flex gap-3 ml-auto'>
        <div className='w-36 ml-auto'>
          <p className='text-base font-semibold text-primary-red text-left'>
            {accounting.formatNumber(product.variation.price)}₫
          </p>
        </div>
        <div className='flex gap-2 items-center'>
          <div className='h-9 flex items-center text-sm justify-center border-neutral-300 border-[1px]'>
            Số lượng: {product.quantity}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductInOrder
