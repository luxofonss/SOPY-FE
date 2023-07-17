/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import ProductCard from '../../components/ProductCard'
import Slider from '../../components/Slider'
import customerApi from '../../customer.service'
import { ADS_HOME } from '@src/configs'
import { useTitle } from '@src/hooks/useTitle'

const slider1 = [
  { image: 'https://cf.shopee.vn/file/vn-50009109-2c7ad65a82c2fd4f64190eb8027865bb_xxhdpi', link: '/' },
  { image: 'https://cf.shopee.vn/file/vn-50009109-cf97b1bddf7b3b478a553efd517e3e2f_xxhdpi', link: '/' },
  {
    image: 'https://cf.shopee.vn/file/vn-50009109-cd6d0b48f29b09ff87c193297c342caf_xxhdpi',
    link: '/'
  },
  {
    image: 'https://cf.shopee.vn/file/vn-50009109-2c7ad65a82c2fd4f64190eb8027865bb_xxhdpi',
    link: '/'
  },
  {
    image: 'https://cf.shopee.vn/file/vn-50009109-287072dca37021a7973c5c2c59efd0d0_xxhdpi',
    link: '/'
  },
  { image: 'https://cf.shopee.vn/file/vn-50009109-cf97b1bddf7b3b478a553efd517e3e2f_xxhdpi', link: '/' }
]

function Home() {
  const { data: categories } = customerApi.endpoints.getAllCategories.useQuery()
  const [getProducts, { data: products }] = customerApi.endpoints.getAllProducts.useLazyQuery()

  useTitle('Sopy - Có gì bán hết')

  useEffect(() => {
    getProducts(null, false)
  }, [])
  return (
    <div className='container mx-auto'>
      <div className='mt-4 flex h-[215px] gap-2'>
        <div className='h-full w-3/5'>
          <Slider data={slider1} />
        </div>
        <div className='grid h-full w-2/5 grid-cols-5 gap-2  rounded-md bg-neutral-0 p-2'>
          {ADS_HOME.map((item) => {
            return (
              <div
                key={item.image}
                className='my-1 flex w-full flex-col items-center justify-center gap-3 rounded-md bg-neutral-200 p-1 transition hover:scale-105 hover:cursor-pointer'
              >
                <img className='h-10 w-10 rounded-md object-cover' src={item.image} alt='banner' />
                <p className='text-center text-xs text-neutral-400 line-clamp-2'>{item.name}</p>
              </div>
            )
          })}
        </div>
      </div>
      {/*category selections*/}
      <div className='mt-4 rounded-lg bg-neutral-0 p-4'>
        <h4 className='mb-3 text-lg font-medium text-neutral-400'>DANH MỤC</h4>
        <div className='grid grid-cols-10 gap-2'>
          {categories?.metadata?.map((category) => (
            <Link
              key={category?.name}
              to={`/search?typeId=${category._id}`}
              className='flex h-32 w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-md bg-neutral-100 transition hover:scale-105 hover:bg-neutral-200'
            >
              <img className='h-16 w-16 rounded-md' src={category?.thumb} alt='bg' />
              <p className='text-center text-sm font-medium text-neutral-500 line-clamp-2'>{category.name}</p>
            </Link>
          ))}
        </div>
      </div>

      <div className='mt-4 rounded-lg bg-neutral-0 p-4'>
        <div className='flex justify-between'>
          <h4 className='font-meidum mb-3 text-lg text-neutral-400'>DÀNH CHO BẠN</h4>
          <Link to='/search' className='text-sm font-medium text-neutral-400'>
            Xem tất cả
          </Link>
        </div>
        <div className='grid grid-cols-6 gap-3'>
          {products?.metadata?.map((product) => (
            <div key={product.name}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Home
