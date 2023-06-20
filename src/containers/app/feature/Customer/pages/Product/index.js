/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable react-hooks/exhaustive-deps */
import { MinusIcon, PlusIcon } from '@heroicons/react/20/solid'
import AppButton from '@src/components/AppButton'
import { Carousel } from 'antd'
import { Rating } from 'flowbite-react'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import customerApi from '../../customer.service'
import appApi from '@src/redux/service'
import getVariation from '@src/utils/getVariationId'
import { isEmptyValue } from '@src/helpers/check'
import { toast } from 'react-toastify'
import { setCart } from '../../customer.slice'
import { useDispatch } from 'react-redux'

function getVariation2ByVariation1(variation1, variation) {
  let res = []
  variation?.forEach((item) => {
    if (item.subVariation) if (item.keyVariationValue === variation1) res.push(item.subVariationValue)
  })
  return res
}

function getVariation1ByVariation2(variation2, variation) {
  let res = []
  variation?.forEach((item) => {
    if (item.subVariationValue === variation2) res.push(item.keyVariationValue)
  })
  return res
}

function Product() {
  const [quantity, setQuantity] = useState(1)
  const [allVariation, setAllVariation] = useState({ variation1: [], variation2: [] })
  const [activeVariation, setActiveVariation] = useState({ variation1: [], variation2: [] })
  const [chosenVariation, setChosenVariation] = useState({ variation1: null, variation2: null })
  const [productMainThumb, setProductMainThumb] = useState()
  const [variation, setVariation] = useState({ id: null, stock: null })

  const { id } = useParams()
  const [queryProduct, { data: product }] = customerApi.endpoints.getProductById.useLazyQuery()
  const [getShopInfo, { data: shopInfo }] = appApi.endpoints.getShopById.useLazyQuery()
  const [addToCart, { isLoading: isAddingToCart }] = customerApi.endpoints.addToCart.useMutation()
  const [getCart] = customerApi.endpoints.getCart.useLazyQuery({ cache: false })

  const dispatch = useDispatch()

  const increaseQuantity = () => {
    console.log(quantity, variation.quantity, product?.metadata?.quantity)
    if (quantity >= variation?.quantity || quantity >= product?.metadata?.quantity)
      toast.warn('Số lượng vượt quá kho hàng')
    else setQuantity(quantity + 1)
  }

  const decreaseQuantity = () => {
    if (quantity > 2) setQuantity(quantity - 1)
  }
  useEffect(() => {
    queryProduct(id, false)
  }, [])

  useEffect(() => {
    //set thumb for product (first image in thumb attribute)
    if (product?.metadata?.thumb[0]) {
      setProductMainThumb(product.metadata.thumb[0])
    }

    // get shop info
    if (product?.metadata?.shop) {
      getShopInfo(product.metadata.shop)
    }

    // set variation 1
    let variation1List = []
    product?.metadata?.variations?.forEach((variation) => {
      if (!variation1List.includes(variation.keyVariationValue)) {
        variation1List.push(variation.keyVariationValue)
      }
      setAllVariation((prevState) => ({
        variation2: prevState.variation2,
        variation1: variation1List
      }))
      setActiveVariation((prevState) => ({
        variation2: prevState.variation2,
        variation1: variation1List
      }))
    })

    //set variation2
    if (product?.metadata?.variations[0]?.subVariation) {
      let variation2List = []
      product?.metadata?.variations.forEach((variation) => {
        if (!variation2List.includes(variation.subVariationValue)) {
          variation2List.push(variation.subVariationValue)
        }
        setAllVariation((prevState) => ({
          variation1: prevState.variation1,
          variation2: variation2List
        }))
        setActiveVariation((prevState) => ({
          variation1: prevState.variation1,
          variation2: variation2List
        }))
      })
    }
  }, [product])

  useEffect(() => {
    setVariation(getVariation(chosenVariation, product))
  }, [chosenVariation])

  console.log('chosenVariation:: ', chosenVariation)

  const handleClickVariation1 = (variation1) => {
    if (chosenVariation.variation1 === variation1) {
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
    if (chosenVariation.variation2 === variation2) {
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

  const handleAddToCart = async () => {
    console.log('variation', variation)
    if (isEmptyValue(variation)) toast.warn('Hãy chọn phân loại sản phẩm')
    else if (quantity <= 0) toast.warn('Số lượng bé nhất bằng 1')
    else if (quantity > variation?.quantity) toast.warn('Số lượng vượt quá kho hàng')
    else {
      const response = await addToCart({
        productId: product.metadata._id,
        shopId: shopInfo.metadata._id,
        variationId: variation.id,
        quantity: quantity
      })

      if (response?.data?.status === 200) {
        toast.success('Thêm sản phẩm thành công!')
        const responseCart = await getCart(null, false)
        if (!responseCart.error) {
          dispatch(setCart(responseCart.data))
        }
      } else {
        toast.error('Có lỗi xảy ra, vui lòng kiểm tra lại!')
      }
    }
  }

  const handleBuy = () => {
    console.log('id: ', id)
    console.log('chosenVariation: ', chosenVariation)
    console.log('quantity: ', quantity)
    console.log('variation:: ', variation)
  }

  return (
    <div className='container mx-auto'>
      <div className='grid grid-cols-12 bg-white p-4 rounded-md'>
        <div className='col-span-4'>
          <div className='flex flex-col items-center gap-4'>
            <img className='w-full h-96 object-cover' src={productMainThumb} alt='img' />
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
        <div className='col-span-1'></div>
        <div className='col-span-7 flex flex-col'>
          <h4 className='text-xl font-medium line-clamp-2'>{product?.metadata?.name}</h4>
          <div className='flex gap-6 mt-3'>
            <Rating>
              <Rating.Star />
              <p className='ml-2 text-sm font-bold text-gray-900 dark:text-white'>4.95</p>
              <span className='mx-1.5 h-1 w-1 rounded-full bg-gray-500 dark:bg-gray-400' />
            </Rating>
            <div className='text-sm font-medium text-gray-900 hover:no-underline dark:text-white' href='#'>
              <p>73 reviews</p>
            </div>
            <p>{product?.metadata?.sold} đã bán</p>
          </div>
          <div className='flex items-center gap-6 w-full px-2 py-4 bg-neutral-300 rounded-lg mt-3'>
            <div className='line-through text-neutral-400 text-lg'>₫{product?.metadata?.minPrice}</div>
            <div className='text-xl text-secondary-orange font-semibold'>
              ₫
              {product?.metadata?.discount
                ? product?.metadata?.minPrice - product?.metadata?.discount
                : product?.metadata?.minPrice}
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
                        key={variation}
                        onClick={() => handleClickVariation1(variation)}
                        className={`${
                          variation === chosenVariation?.variation1
                            ? 'bg-primary-green'
                            : activeVariation.variation1.includes(variation)
                            ? 'bg-neutral-300'
                            : 'bg-neutral-400 pointer-events-none'
                        } px-2 py-1 border-neutral-400 rounded-sm flex items-center justify-center hover-opacity-90`}
                      >
                        {variation}
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
                        key={variation}
                        onClick={() => {
                          handleClickVariation2(variation)
                        }}
                        className={`${
                          variation === chosenVariation?.variation2
                            ? 'bg-primary-green'
                            : activeVariation.variation2.includes(variation)
                            ? 'bg-neutral-300'
                            : 'bg-neutral-400 pointer-events-none'
                        } px-2 py-1 border-neutral-400 rounded-sm flex items-center justify-center hover-opacity-90`}
                      >
                        {variation}
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
              <div className='flex gap-2'>
                <button className='w-6 h-6 ' onClick={decreaseQuantity}>
                  <MinusIcon
                    color='white'
                    className='bg-white text-neutral-700 rounded-full transition hover:bg-secondary-orange'
                  />
                </button>
                <div className='w-6 h-6 flex items-center justify-center border-neutral-300 border-[1px]'>
                  {quantity}
                </div>
                <button className='w-6 h-6 ' onClick={increaseQuantity}>
                  <PlusIcon className='bg-white text-neutral-700 rounded-full transition hover:bg-secondary-green' />
                </button>
              </div>
              <p>{variation?.stock ? variation.stock : product?.metadata?.quantity} sản phẩm có sẵn</p>
            </div>
          </div>

          {/*Actions*/}
          <div className='flex gap-6 mt-auto ml-auto'>
            <AppButton isLoading={isAddingToCart} onClick={handleAddToCart}>
              Thêm vào giỏ hàng
            </AppButton>
            <AppButton onClick={handleBuy}>Mua ngay</AppButton>
          </div>
        </div>
      </div>

      {/**Shop information */}
      {shopInfo?.metadata ? (
        <div className='w-full rounded-md mt-6 p-4 bg-neutral-300 flex justify-between'>
          <div className='flex gap-6'>
            <img
              className='w-24 h-2w-24 rounded-2xl'
              src='https://down-vn.img.susercontent.com/file/1fc4e634d68efb2cac27d1904970dc3d_tn'
              alt='avatar'
            />

            <div className='flex flex-col gap-1'>
              <p className='text-md font-medium'>{shopInfo?.metadata?.name}</p>
              <p className='text-sm'>{shopInfo?.metadata?.shopInfo?.address}</p>
              <div className='flex gap-4 mt-auto'>
                <AppButton>Chat</AppButton>
                <AppButton>Xem</AppButton>
              </div>
            </div>
          </div>
          <div></div>
        </div>
      ) : null}
    </div>
  )
}

export default Product
