/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable react-hooks/exhaustive-deps */
import { ChatBubbleLeftIcon, MinusIcon, PlusIcon, ShoppingCartIcon, TruckIcon } from '@heroicons/react/20/solid'
import { CheapTag, FacebookLogo } from '@src/assets/svgs'
import AppButton from '@src/components/AppButton'
import { isEmptyValue } from '@src/helpers/check'
import useNewConversation from '@src/hooks/useNewConversation'
import appApi from '@src/redux/service'
import getVariation from '@src/utils/getVariationId'
import accounting from 'accounting'
import { Carousel } from 'antd'
import { Rating } from 'flowbite-react'
import { isEmpty } from 'lodash'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import ProductAttribute from '../../components/ProductAttribute'
import ProductCard from '../../components/ProductCard'
import customerApi from '../../customer.service'
import { setCart } from '../../customer.slice'
import { useTitle } from '@src/hooks/useTitle'

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
  const userInfo = useSelector((state) => state.auth.user)

  const { id } = useParams()
  const [queryProduct, { data: product }] = customerApi.endpoints.getProductById.useLazyQuery()
  const [getSameProducts, { data: sameProduct }] = customerApi.endpoints.getProductByCategoryId.useLazyQuery()
  const [getShopInfo, { data: shopInfo }] = appApi.endpoints.getShopById.useLazyQuery()
  const [addToCart, { isLoading: isAddingToCart }] = customerApi.endpoints.addToCart.useMutation()
  const [getCart] = customerApi.endpoints.getCart.useLazyQuery({ cache: false })
  const [getProductAttributes, { data: productAttributes }] = appApi.endpoints.getProductAttributes.useLazyQuery()

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  useTitle(product?.metadata?.name || 'Sopy - Có gì bán hết')

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
  }, [id])

  useEffect(() => {
    // eslint-disable-next-line no-undef
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
  }, [location])

  useEffect(() => {
    //get product attributes
    if (product?.metadata?.typeId) {
      getProductAttributes({ typeId: product.metadata.typeId })
      getSameProducts({ id: product.metadata.typeId })
    }
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
    const currVariation = getVariation(chosenVariation, product)
    setVariation(currVariation)
    console.log('currVariation:: ', currVariation)

    if (currVariation?.thumb) {
      setProductMainThumb(currVariation.thumb)
    } else {
      if (!isEmptyValue(product?.metadata?.thumb)) setProductMainThumb(product?.metadata?.thumb[0])
    }
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
    if (isEmpty(userInfo)) {
      navigate('/login')
    } else {
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
          console.log('responseCart:: ', responseCart)
          if (!responseCart.error) {
            dispatch(setCart(responseCart.data))
          }
        } else {
          toast.error('Có lỗi xảy ra, vui lòng kiểm tra lại!')
        }
      }
    }
  }

  const handleBuy = () => {
    console.log('id: ', id)
    console.log('chosenVariation: ', chosenVariation)
    console.log('quantity: ', quantity)
    console.log('variation:: ', variation)
  }

  const handleNewConversation = useNewConversation()

  return (
    <div className='container mx-auto'>
      <div className='grid grid-cols-12 rounded-md bg-white p-4'>
        <div className='col-span-4'>
          <div className='flex flex-col items-center gap-4'>
            <img className='h-96 w-full object-cover' src={productMainThumb} alt='img' />
            <div className='h-24 w-full'>
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
          <div className='mt-4 flex gap-4'>
            <p>Chia sẻ</p>
            <FacebookLogo />
          </div>
        </div>
        <div className='col-span-1 flex justify-center'>
          <div className='h-full w-[1px] bg-neutral-300'></div>
        </div>
        <div className='col-span-7 flex flex-col'>
          <h4 className='text-xl font-medium line-clamp-2'>{product?.metadata?.name}</h4>
          <div className='mt-3 flex gap-6'>
            <Rating>
              <Rating.Star />
              <p className='ml-2 font-bold text-gray-900 dark:text-white'>4.95</p>
              <span className='mx-1.5 h-1 w-1 rounded-full bg-gray-500 dark:bg-gray-400' />
            </Rating>
            <div className='font-medium text-gray-900 hover:no-underline dark:text-white' href='#'>
              <p>73 reviews</p>
            </div>
            <p>{product?.metadata?.sold} đã bán</p>
          </div>
          <div className='mt-3 w-full rounded-lg bg-neutral-200 px-2 py-4'>
            <div className='flex w-full items-center gap-6 '>
              <div className='flex gap-3'>
                <div className='text-2xl font-semibold text-orange-4'>
                  ₫
                  {product?.metadata?.discount
                    ? accounting.formatNumber(product?.metadata?.minPrice - product?.metadata?.discount)
                    : accounting.formatNumber(product?.metadata?.minPrice)}
                </div>
                <div className='text-base font-semibold text-neutral-400 line-through'>
                  ₫{accounting.formatNumber(product?.metadata?.minPrice)}
                </div>
              </div>
              <div className='rounded-sm bg-orange-4 py-1 px-2 text-neutral-200 shadow-sm'>-50% GIẢM</div>
            </div>
            <div className='flex gap-3'>
              <CheapTag />
              <div>
                <div className='text-sm font-medium text-orange-3'>Gì cũng rẻ</div>
                <div className='text-xs'>Giá tốt nhất so với các sản phẩm cùng loại ở nơi khác!</div>
              </div>
            </div>
          </div>

          {/* Shipping */}
          <div className='mt-6 grid grid-cols-12'>
            <h4 className='col-span-2'>Vận chuyển</h4>
            <div className='col-span-10'>
              <div className='flex gap-3'>
                <TruckIcon className='h-4 w-4' />
                <p>Vận chuyển tới: </p>
                {!isEmpty(userInfo?.address) ? <p>{userInfo?.address[0]}</p> : null}
              </div>
              <div className='flex gap-3'>
                <p className='text-sm'>Phí vận chuyển</p>
                <p className='text-sm'>₫32.500 - ₫50.000</p>
              </div>
            </div>
          </div>
          {/*/ Variations*/}

          {product?.metadata?.variations && (
            <div>
              <div className='mt-6 grid grid-cols-12'>
                <h4 className='col-span-2'>{product?.metadata?.variations[0]?.keyVariation}</h4>
                <div className='col-span-10 grid grid-cols-6 gap-2'>
                  {allVariation.variation1?.map((variation) => {
                    return (
                      <div
                        key={variation}
                        onClick={() => handleClickVariation1(variation)}
                        className={`${
                          variation === chosenVariation?.variation1
                            ? 'border-orange-4'
                            : activeVariation.variation1.includes(variation)
                            ? 'bg-neutral-300'
                            : 'pointer-events-none bg-neutral-400'
                        } hover-opacity-90 flex cursor-pointer items-center justify-center rounded-sm border-[1px] border-neutral-300 px-2 py-1`}
                      >
                        {variation}
                      </div>
                    )
                  })}
                </div>
              </div>
              {product?.metadata?.variations[0]?.subVariation ? (
                <div className='mt-6 grid grid-cols-12'>
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
                            ? 'border-orange-4'
                            : activeVariation.variation2.includes(variation)
                            ? 'bg-neutral-300'
                            : 'pointer-events-none bg-neutral-400'
                        } hover-opacity-90 flex cursor-pointer items-center justify-center rounded-sm border-[1px] border-neutral-300 px-2 py-1`}
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
          <div className='mt-6 grid grid-cols-12'>
            <h4 className='col-span-2'>Số lượng</h4>
            <div className='col-span-10 flex gap-4'>
              <div className='flex gap-2'>
                <button className='h-6 w-6 ' onClick={decreaseQuantity}>
                  <MinusIcon
                    color='white'
                    className='rounded-full bg-white text-neutral-700 transition hover:bg-secondary-orange'
                  />
                </button>
                <div className='flex h-6 w-6 items-center justify-center border-[1px] border-neutral-300'>
                  {quantity}
                </div>
                <button className='h-6 w-6 ' onClick={increaseQuantity}>
                  <PlusIcon className='rounded-full bg-white text-neutral-700 transition hover:bg-secondary-green' />
                </button>
              </div>
              <p>{variation?.stock ? variation.stock : product?.metadata?.quantity} sản phẩm có sẵn</p>
            </div>
          </div>

          {/*Actions*/}
          <div className='mt-auto ml-auto flex gap-6'>
            <AppButton
              className='border-[1px] border-orange-4 bg-transparent text-orange-4 hover:bg-orange-1'
              isLoading={isAddingToCart}
              onClick={handleAddToCart}
              Icon={<ShoppingCartIcon className='h-5 w-5 text-orange-4' />}
              showIcon
            >
              Thêm vào giỏ hàng
            </AppButton>
            <AppButton className='bg-orange-4 text-neutral-0 hover:bg-orange-3' onClick={handleBuy}>
              Mua ngay
            </AppButton>
          </div>
        </div>
      </div>

      {/**Shop information */}
      {shopInfo?.metadata ? (
        <div className='mt-6 flex w-full justify-between rounded-md bg-neutral-0 p-4'>
          <div className='flex gap-6'>
            <img
              className='h-20 w-20 rounded-full'
              src={
                shopInfo?.metadata?.avatar ||
                'https://down-vn.img.susercontent.com/file/1fc4e634d68efb2cac27d1904970dc3d_tn'
              }
              alt='avatar'
            />

            <div className='flex flex-col'>
              <p className='text-md font-medium'>
                {shopInfo?.metadata?.shopInfo?.shopName || shopInfo?.metadata?.name}
              </p>
              <p className='text-sm'>{shopInfo?.metadata?.shopInfo?.address}</p>
              <div className='mt-auto flex gap-4'>
                <AppButton
                  Icon={<ChatBubbleLeftIcon className='h-5 w-5' />}
                  showIcon
                  onClick={() => {
                    handleNewConversation({
                      receiverId: shopInfo?.metadata?._id,
                      name: shopInfo?.metadata?.shopInfo?.shopName || shopInfo?.metadata?.name,
                      avatar: shopInfo?.metadata?.avatar
                    })
                  }}
                  className='h-9 border-[1px] border-orange-4 bg-transparent text-orange-4 hover:bg-orange-1'
                >
                  Chat
                </AppButton>

                <Link
                  to={`/shop/${shopInfo?.metadata?._id}`}
                  className='h-9 border-[1px] border-neutral-300 bg-transparent text-neutral-600 hover:bg-neutral-200'
                >
                  Xem shop
                </Link>
              </div>
            </div>
            <div className='mx-4 h-full w-[1px] bg-neutral-300'></div>
            <div className='flex flex-col justify-around'>
              <div className='flex justify-between gap-4'>
                <p className='font-medium text-neutral-400 '>Đánh Giá</p>
                <p className='text-orange-4 '>14.4k</p>
              </div>
              <div className='flex justify-between gap-4'>
                <p className='font-medium text-neutral-400 '>Sản phẩm</p>
                <p className='text-orange-4 '>14</p>
              </div>
            </div>
            <div className='mx-4 h-full w-[1px] bg-neutral-300'></div>
            <div className='flex flex-col justify-around'>
              <div className='flex justify-between gap-4'>
                <p className='font-medium text-neutral-400 '>Tham Gia</p>
                <p className='text-orange-4 '>31 tháng trước</p>
              </div>
              <div className='flex justify-between gap-4'>
                <p className='font-medium text-neutral-400 '>Người theo dõi</p>
                <p className='text-orange-4 '>31k</p>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/**Product attributes */}
      {product?.metadata?.attributes && productAttributes?.metadata ? (
        <ProductAttribute data={product.metadata} attributes={productAttributes.metadata} />
      ) : null}

      {/**same products */}
      <div className='mt-4 rounded-lg bg-neutral-200 p-4'>
        <div className='flex justify-between'>
          <h4 className='mb-3 text-xl font-semibold text-neutral-400'>Sản phẩm tương tự</h4>
          <Link className='text-sm font-medium text-neutral-500' to='/'>
            Xem tất cả
          </Link>
        </div>
        <div className='grid grid-cols-6 gap-3'>
          {sameProduct
            ? sameProduct?.metadata?.map((product) => (
                <div key={product.name}>
                  <ProductCard product={product} />
                </div>
              ))
            : null}
        </div>
      </div>
    </div>
  )
}

export default Product
