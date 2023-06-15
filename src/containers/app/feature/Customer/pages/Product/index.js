/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable react-hooks/exhaustive-deps */
import AppButton from '@src/components/AppButton'
import { Carousel } from 'antd'
import { Rating } from 'flowbite-react'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import customerApi from '../../customer.service'
import { some } from 'lodash'

function getVariation2ByVariation1(variation1, variation) {
  let res = []
  variation?.forEach((item) => {
    if (item.subVariation)
      if (item.keyVariationValue === variation1.value) res.push({ _id: item._id, value: item.subVariationValue })
  })
  return res
}

function getVariation1ByVariation2(variation2, variation) {
  let res = []
  variation?.forEach((item) => {
    if (item.subVariationValue === variation2.value) res.push({ _id: item._id, value: item.keyVariationValue })
  })
  return res
}

function Product() {
  const [quantity, setQuantity] = useState(1)
  const [allVariation, setAllVariation] = useState({ variation1: [], variation2: [] })
  const [activeVariation, setActiveVariation] = useState({ variation1: [], variation2: [] })
  const [chosenVariation, setChosenVariation] = useState({ variation1: {}, variation2: {} })
  const [productMainThumb, setProductMainThumb] = useState()

  const increaseQuantity = () => {
    setQuantity(quantity + 1)
  }

  const decreaseQuantity = () => {
    if (quantity > 2) setQuantity(quantity - 1)
  }

  const { id } = useParams()
  const [queryProduct, { data: product }] = customerApi.endpoints.getProductById.useLazyQuery()

  useEffect(() => {
    queryProduct(id, false)
  }, [])

  useEffect(() => {
    product?.metadata?.variations?.forEach((variation) => {
      if (!some(allVariation.variation1, { _id: variation._id, value: variation.keyVariationValue })) {
        setAllVariation((prevState) => ({
          variation2: prevState.variation2,
          variation1: [...prevState.variation1, { _id: variation._id, value: variation.keyVariationValue }]
        }))
        setActiveVariation((prevState) => ({
          variation2: prevState.variation2,
          variation1: [...prevState.variation1, { _id: variation._id, value: variation.keyVariationValue }]
        }))
      }
    })

    if (product?.metadata?.variations[0]?.subVariation) {
      product?.metadata?.variations.forEach((variation) => {
        if (!some(allVariation.variation2, { _id: variation._id, value: variation.subVariationValue })) {
          setAllVariation((prevState) => ({
            variation1: prevState.variation1,
            variation2: [...prevState.variation2, { _id: variation._id, value: variation.subVariationValue }]
          }))
          setActiveVariation((prevState) => ({
            variation1: prevState.variation1,
            variation2: [...prevState.variation2, { _id: variation._id, value: variation.subVariationValue }]
          }))
        }
      })
      if (product?.metadata?.thumb[0]) {
        setProductMainThumb(product.metadata.thumb[0])
      }
    }
  }, [product])

  const handleClickVariation1 = (variation1) => {
    if (chosenVariation.variation1?.value === variation1.value) {
      setChosenVariation({ ...chosenVariation, variation1: null })
      setActiveVariation({ ...activeVariation, variation2: allVariation.variation2 })
    } else {
      setChosenVariation({ ...chosenVariation, variation1: variation1 })
      if (!chosenVariation.variation2) {
        const ableVariation2 = getVariation2ByVariation1(variation1, product?.metadata?.variations)
        setActiveVariation({ ...activeVariation, variation2: ableVariation2 })
      }
    }
  }

  const handleClickVariation2 = (variation2) => {
    if (chosenVariation.variation2?.value === variation2.value) {
      setChosenVariation({ ...chosenVariation, variation2: null })
      setActiveVariation({ ...activeVariation, variation1: allVariation.variation1 })
    } else {
      setChosenVariation({ ...chosenVariation, variation2: variation2 })
      if (!chosenVariation.variation1) {
        const ableVariation1 = getVariation1ByVariation2(variation2, product?.metadata?.variations)
        setActiveVariation({ ...activeVariation, variation1: ableVariation1 })
      }
    }
  }

  console.log('chosenVariation:: ', chosenVariation)

  return (
    <div className='container mx-auto'>
      <div className='grid grid-cols-12 bg-neutral-0 gap-28'>
        <div className='col-span-4'>
          <div className='flex flex-col items-center p-6 gap-4'>
            <img className='w-full h-80 object-cover' src={productMainThumb} alt='img' />
            <div className='w-full h-24'>
              <Carousel autoplay slidesToShow={4} infinite={false}>
                {product?.metadata?.thumb.map((thumb) => (
                  <img
                    onClick={() => {
                      setProductMainThumb(thumb)
                    }}
                    className='h-24 w-full object-cover'
                    key={thumb}
                    alt='mini-thumb'
                    src={thumb}
                  />
                ))}
              </Carousel>
            </div>
          </div>
        </div>
        <div className='col-span-8 p-6'>
          <h4 className='text-xl font-medium line-clamp-2'>{product?.metadata?.name}</h4>
          <div className='flex gap-6 mt-3'>
            <Rating>
              <Rating.Star />
              <p className='ml-2 text-sm font-bold text-gray-900 dark:text-white'>4.95</p>
              <span className='mx-1.5 h-1 w-1 rounded-full bg-gray-500 dark:bg-gray-400' />
            </Rating>
            <Link
              to='/'
              className='text-sm font-medium text-gray-900 underline hover:no-underline dark:text-white'
              href='#'
            >
              <p>73 reviews</p>
            </Link>
            <p>{product?.metadata?.sold}</p>
          </div>
          <div className='flex items-center gap-6 w-full px-2 py-4 bg-neutral-300 rounded-lg mt-3'>
            <div className='line-through text-neutral-400 text-lg'>{product?.metadata?.minPrice}</div>
            <div className='text-xl text-secondary-orange font-semibold'>
              {product?.metadata?.minPrice - product?.metadata?.discount}
            </div>
            <div className='py-1 px-2 text-neutral-200 bg-secondary-green rounded-md'>50% discount</div>
          </div>

          {/* Shipping */}
          <div className='grid grid-cols-12 mt-6'>
            <h4 className='col-span-2'>Vận chuyển</h4>
            <div className='col-span-10 flex gap-3'>
              <p>Vận chuyển tới: </p>
              <p>Đại học Bách Khoa Hà Nội</p>
            </div>
          </div>
          {/*/ Variations*/}

          {product?.metadata?.variations && (
            <div>
              <div className='grid grid-cols-12 mt-6'>
                <h4 className='col-span-2'>{product?.metadata?.variations[0]?.keyVariation}</h4>
                <div className='col-span-10 grid grid-cols-6 gap-2'>
                  {allVariation.variation1?.map((variation) => {
                    return (
                      <div
                        key={variation.value}
                        onClick={() => handleClickVariation1(variation)}
                        className={`${
                          variation.value === chosenVariation?.variation1?.value
                            ? 'bg-primary-green'
                            : some(activeVariation.variation1, {
                                _id: variation._id,
                                value: variation.value
                              })
                            ? 'bg-neutral-300'
                            : 'bg-neutral-400 pointer-events-none'
                        } px-2 py-1 border-neutral-400 rounded-sm flex items-center justify-center hover-opacity-90`}
                      >
                        {variation.value}
                      </div>
                    )
                  })}
                </div>
              </div>
              {product?.metadata?.variations[0]?.subVariation ? (
                <div className='grid grid-cols-12 mt-6'>
                  <h4 className='col-span-2'>{product?.metadata?.variations[0]?.subVariation}</h4>
                  <div className='col-span-10 grid grid-cols-6 gap-2'>
                    {allVariation?.variation2?.map((variation) => (
                      <div
                        key={variation.value}
                        onClick={() => {
                          handleClickVariation2(variation)
                        }}
                        className={`${
                          variation.value === chosenVariation?.variation2?.value
                            ? 'bg-primary-green'
                            : some(activeVariation.variation2, {
                                _id: variation._id,
                                value: variation.value
                              })
                            ? 'bg-neutral-300'
                            : 'bg-neutral-400 pointer-events-none'
                        } px-2 py-1 border-neutral-400 rounded-sm flex items-center justify-center hover-opacity-90`}
                      >
                        {variation.value}
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          )}

          {/**Quantity */}
          <div className='grid grid-cols-12 mt-6'>
            <h4 className='col-span-2'>Số lượng</h4>
            <div className='col-span-10 flex gap-4'>
              <div className='flex'>
                <button className='w-6 h-6 bg-neutral-orange' onClick={decreaseQuantity}>
                  -
                </button>
                <div className='w-6-h-6 flex items-center justify-center'>{quantity}</div>
                <button className='w-6 h-6 bg-neutral-green' onClick={increaseQuantity}>
                  +
                </button>
              </div>
              <p>100 san pham co san</p>
            </div>
          </div>

          {/*Actions*/}
          <div className='flex gap-6 mt-6'>
            <AppButton>Them vao gio hang</AppButton>
            <AppButton>Mua ngay</AppButton>
          </div>
        </div>
      </div>

      {/**Shop information */}
      <div className='w-full rounded-md mt-6 p-4 bg-neutral-300 flex justify-between'>
        <div className='flex gap-6'>
          <img
            className='w-24 h-2w-24 rounded-2xl'
            src='https://down-vn.img.susercontent.com/file/1fc4e634d68efb2cac27d1904970dc3d_tn'
            alt='avatar'
          />
          <div className='flex flex-col gap-1'>
            <p className='text-md font-medium'>Shop name</p>
            <p className='text-sm'>Shop address</p>
            <div className='flex gap-4 mt-auto'>
              <AppButton>Chat</AppButton>
              <AppButton>Xem</AppButton>
            </div>
          </div>
        </div>
        <div></div>
      </div>
    </div>
  )
}

export default Product
