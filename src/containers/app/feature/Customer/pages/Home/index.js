/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import ProductCard from '../../components/ProductCard'
import Slider from '../../components/Slider'
import customerApi from '../../customer.service'
import { ADS_HOME } from '@src/configs'

const slider1 = [
  { image: 'https://down-vn.img.susercontent.com/file/vn-50009109-a711fcb9172f374209ccd7e2de7b1a25', link: '/' },
  { image: 'https://down-vn.img.susercontent.com/file/vn-50009109-be25ed3e90ccb3825de42451433ac0a4', link: '/' },
  {
    image:
      'https://1.bp.blogspot.com/-mlAFjoCyf_k/XPcza9jD0ZI/AAAAAAAABO8/e3Zbs6Hj4GAroDnHgRrKvijyU3-AaKw2ACLcBGAs/w1200-h630-p-k-no-nu/shopee-sarah-geronimo.png',
    link: '/'
  },
  {
    image:
      'https://www.jtexpress.sg/hs-fs/hubfs/Banner_9_success_shopee_FA.jpg?width=1200&name=Banner_9_success_shopee_FA.jpg',
    link: '/'
  },
  {
    image: 'https://www.crevantage.sg/wp-content/uploads/2021/02/saupload_shopee-11-11-header-2-1000x600-1.jpeg',
    link: '/'
  },
  { image: 'https://shopee.ph/blog/wp-content/uploads/2022/06/Shopee-Sale-Schedule_Banner-1280x720.jpg', link: '/' }
]

function Home() {
  const { data: categories } = customerApi.endpoints.getAllCategories.useQuery()
  const [getProducts, { data: products }] = customerApi.endpoints.getAllProducts.useLazyQuery()

  useEffect(() => {
    getProducts(null, false)
  }, [])
  return (
    <div className='container mx-auto'>
      <div className='h-64 flex gap-2 mt-4'>
        <div className='h-64 w-3/5'>
          <Slider data={slider1} />
        </div>
        <div className='h-64 w-2/5 grid grid-cols-5 gap-2  p-2 bg-neutral-0 rounded-md'>
          {ADS_HOME.map((item) => {
            return (
              <div
                key={item.image}
                className='w-full my-1 flex flex-col items-center justify-center gap-3 bg-neutral-200 rounded-md hover:scale-105 hover:cursor-pointer transition'
              >
                <img className='w-10 h-10 object-cover rounded-md' src={item.image} alt='banner' />
                <p className='text-neutral-500 text-xs text-center line-clamp-2'>{item.name}</p>
              </div>
            )
          })}
        </div>
      </div>
      {/*category selections*/}
      <div className='mt-4 p-4 rounded-lg bg-neutral-200'>
        <h4 className='text-xl font-semibold text-neutral-400 mb-3'>Danh mục</h4>
        <div className='grid grid-cols-10 gap-2'>
          {categories?.metadata?.map((category) => (
            <Link
              key={category?.name}
              to={`/search?typeId=${category._id}`}
              className='w-full h-32 bg-neutral-200 rounded-md flex flex-col justify-center items-center gap-2 cursor-pointer hover:bg-neutral-100 hover:scale-105 transition'
            >
              <img className='w-16 h-16 rounded-md' src={category?.thumb} alt='bg' />
              <p className='font-medium text-neutral-500 text-sm text-center line-clamp-2'>{category.name}</p>
            </Link>
          ))}
        </div>
      </div>

      <div className='mt-4 p-4 rounded-lg bg-neutral-200'>
        <div className='flex justify-between'>
          <h4 className='text-xl font-semibold text-neutral-400 mb-3'>Dành cho bạn</h4>
          <Link className='font-medium text-sm text-neutral-500' to='/'>
            Xem tất cả
          </Link>
        </div>
        <div className='grid grid-cols-6 gap-8'>
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
