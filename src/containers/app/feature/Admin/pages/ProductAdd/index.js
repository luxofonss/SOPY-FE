/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable no-undef */
import AppButton from '@src/components/AppButton'
// import AppFileInput from '@src/components/Form/AppFileInput'
import { TrashIcon, UploadIcon } from '@src/assets/svgs'
import AppCheckbox from '@src/components/Form/AppCheckbox'
import AppDateInput from '@src/components/Form/AppDateInput'
import AppForm from '@src/components/Form/AppForm'
import AppInput from '@src/components/Form/AppInput'
import AppRadio from '@src/components/Form/AppRadio'
// import AppSelect from '@src/components/Form/AppSelect'
import AppTextArea from '@src/components/Form/AppTextArea'
import AppModal from '@src/components/Modal'
import { useRef, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { useAddProductMutation, useGetAllCategoryQuery, useLazyGetProductAttributesQuery } from '../../adminService'
import SellInformation from '../../components/SellInformation'

function ProductAdd() {
  const [imageList, setImageList] = useState([])
  const [imageListObject, setImageListObject] = useState([])
  const [limitUpload, setLimitUpload] = useState(false)
  const [productCategory, setProductCategory] = useState({ parent: null, child: null })
  const [categoryError, setCategoryError] = useState(null)
  const [productAttributeList, setProductAttributeList] = useState()
  const closeRef = useRef()

  const { data: categoryList } = useGetAllCategoryQuery()
  const [getProductAttributes] = useLazyGetProductAttributesQuery()
  const [addProduct] = useAddProductMutation()

  console.log('productCategory: ', productCategory)

  function uploadImages(e) {
    if (imageList.length < 10) {
      setImageList([...imageList, URL.createObjectURL(e.target.files[0])])
      setImageListObject([...imageListObject, e.target.files[0]])
    } else setLimitUpload(true)
  }

  function handleDeleteImage(image) {
    let newList = imageList
    let newListObject = imageListObject

    newListObject.splice(
      newListObject.findIndex((e) => {
        console.log('object: ', e)
        return URL.createObjectURL(e) === image
      })
    )
    newList.splice(
      newList.findIndex((e) => e === image),
      1
    )
    setImageList([...newList])
    setImageListObject([...newListObject])
  }

  async function onCreateNewProduct(data) {
    console.log(data)
    console.log('product category: ', productCategory)

    const flatData = new FormData()

    flatData.append('typeId', productCategory.children._id)
    flatData.append('name', data.name)
    flatData.append('description', data.description)
    flatData.append('condition', data.condition)
    flatData.append('preOrder', data.preOrder)
    flatData.append('manufacturerName', data.manufacturerName)
    flatData.append('manufacturerAddress', data.manufacturerAddress)
    flatData.append('manufacturerDate', data.manufacturerDate)
    flatData.append('brand', data.brand)
    flatData.append('attributes', JSON.stringify(data.attributes))
    flatData.append('variations', JSON.stringify(data.variations))
    flatData.append('shipping', JSON.stringify(data.shipping))
    imageListObject.forEach((image) => {
      flatData.append('thumb', image)
    })

    const response = await addProduct(flatData)
    console.log('response:: ', response)
  }

  async function handleChooseProductCategory() {
    if (productCategory.children !== null) {
      const response = await getProductAttributes({ typeId: productCategory.children._id })
      if (response.isSuccess) setProductAttributeList(response.data.metadata)
      else toast.warn('Something went wrong, please try again!')
      closeRef.current.closeModal()
    } else {
      setCategoryError(true)
    }
  }

  console.log('productAttributeList:: ', productAttributeList)

  return (
    <div className='py-8 px-32 bg-neutral-100 rounded-lg'>
      <div className='text-neutral-700 font-semibold text-2xl'>Thêm sản phẩm mới</div>
      <AppForm
        encType='multipart/form-data'
        onSubmit={(data) => {
          onCreateNewProduct(data)
        }}
      >
        <div className='mt-6'>
          <div className='flex gap-6 text-neutral-500 font-semibold text-xl '>
            <div className='w-4 h-7 bg-secondary-purple rounded-sm'></div>
            <div>Thông tin cơ bản</div>
          </div>
          <div className='mt-6 ml-6'>
            {/* <AppSelect name='type' label='Loại sản phẩm' required /> */}
            <AppModal
              closeRef={closeRef}
              Trigger={
                <AppInput
                  id='type'
                  name='type'
                  required
                  label='Chọn ngành hàng'
                  disabled
                  defaultValue={
                    productCategory.children
                      ? `${productCategory?.parent?.name} > ${productCategory?.children?.name}`
                      : ''
                  }
                />
              }
            >
              <div className='w-[550px] bg-neutral-200 rounded-lg p-10'>
                <h4 className='text-lg text-neutral-400 font-semibold'>Chọn ngành hàng</h4>
                <div className='grid grid-cols-2 gap-x-6 bg-neutral-0 mt-4'>
                  <div className='py-4 px-6 border-r-2 border-r-neutral-300'>
                    <ul>
                      {categoryList
                        ? categoryList.metadata.map((category) => (
                            <li
                              key={category._id}
                              onClick={() => {
                                setProductCategory({ parent: category, children: null })
                              }}
                              className='h-6 text-start font-medium rounded-sm hover:bg-neutral-200 cursor-pointer pl-3 text-sm text-neutral-400'
                            >
                              {category.name}
                            </li>
                          ))
                        : null}
                    </ul>
                  </div>
                  <div className=' py-4 px-6'>
                    <ul>
                      {productCategory
                        ? productCategory.parent?.subTypes?.map((type) => {
                            return (
                              <li
                                onClick={() => {
                                  if (categoryError) setCategoryError(false)
                                  setProductCategory({ ...productCategory, children: type })
                                }}
                                key={type._id}
                                className='h-6 text-start font-medium rounded-sm hover:bg-neutral-200 cursor-pointer pl-3 text-sm text-neutral-400'
                              >
                                {type.name}
                              </li>
                            )
                          })
                        : null}
                    </ul>
                  </div>
                </div>
                <div className='flex justify-end items-center mt-6'>
                  <div className='flex gap-4 '>
                    <AppButton type='button' onClick={() => closeRef.current.closeModal()}>
                      Close
                    </AppButton>
                    <AppButton type='button' onClick={handleChooseProductCategory}>
                      Ok
                    </AppButton>
                  </div>
                </div>
                {categoryError ? (
                  <span className='mt-2 text-sm text-secondary-orange ml-auto'>Bạn chưa chọn ngành hàng </span>
                ) : null}
              </div>
            </AppModal>
            <AppInput id='name' name='name' required label='Tên sản phẩm' />
            <AppTextArea id='description' name='description' required label='Mô tả' rows={5} />
            <div className='grid grid-cols-2 gap-x-8'>
              <AppInput id='brand' name='brand' required label='Thương hiệu' />
              <AppInput id='manufacturerName' name='manufacturerName' required label='Nhà sản xuất' />
              <AppInput id='manufacturerAddress' name='manufacturerAddress' required label='Nơi sản xuất' />
              <AppDateInput id='manufactureDate' name='manufactureDate' required label='Ngày sản xuất' />
              <AppInput id='condition' type='number' name='condition' required label='Tình trạng' unit='/100' />
              <AppInput id='sku' type='text' name='sku' label='SKU sản phẩm' />
            </div>
            <AppRadio name='preOrder' label='Hàng đặt trước' required />
            <div>
              <div className='mb-1.5 font-semibold w-full text-neutral-500'>Hình ảnh</div>
              <div className='flex gap-8'>
                <label
                  className='w-24 h-24 mt-1 cursor-pointer border-dashed border-2 rounded-lg border-secondary-blue flex justify-center items-center'
                  htmlFor='imageList'
                >
                  <UploadIcon />
                </label>
                <input onChange={(e) => uploadImages(e)} id='imageList' type='file' multiple className='hidden' />
                {imageList.map((image, index) => {
                  return (
                    <div className='relative' key={uuidv4(image)}>
                      <img
                        className='w-24 h-24 rounded-lg object-contain border-dashed border-2  border-secondary-green'
                        src={image}
                        alt='bg'
                      />
                      <div
                        onClick={() => handleDeleteImage(image)}
                        className='absolute -top-2 -right-2 p-[1px] bg-neutral-200 rounded-md hover:bg-secondary-orange transition cursor-pointer'
                      >
                        <TrashIcon />
                      </div>
                      {index === 0 ? (
                        <div className='absolute -bottom-2 left-4 text-xs p-[1px] bg-secondary-purple rounded-sm'>
                          Background
                        </div>
                      ) : null}
                    </div>
                  )
                })}
              </div>
              {limitUpload ? <p className='text-secondary-orange mt-2'>Upload tối đa 10 ảnh</p> : null}
            </div>
          </div>
        </div>
        <div className='mt-6'>
          <div className='flex gap-6 text-neutral-500 font-semibold text-xl '>
            <div className='w-4 h-7 bg-secondary-green rounded-sm'></div>
            <div>Thông tin chi tiết</div>
          </div>
          <div className='mt-6 ml-6 grid grid-cols-2 gap-x-16'>
            {productAttributeList
              ? productAttributeList.map((attribute) => {
                  if (attribute !== null)
                    switch (attribute.type) {
                      case 'text':
                        return (
                          <AppInput
                            id={`attributes.${attribute.path}`}
                            name={`attributes.${attribute.path}`}
                            required
                            label={attribute.name.vi}
                            unit={attribute.unit}
                            type='text'
                          />
                        )
                      case 'number':
                        return (
                          <AppInput
                            id={`attributes.${attribute.path}`}
                            name={`attributes.${attribute.path}`}
                            required
                            label={attribute.name.vi}
                            unit={attribute.unit}
                            type='number'
                          />
                        )
                      case 'select':
                        return (
                          <AppInput
                            id={`attributes.${attribute.path}`}
                            name={`attributes.${attribute.path}`}
                            required
                            label={attribute.name.vi}
                            unit={attribute.unit}
                            type='select'
                          />
                        )
                    }
                })
              : null}
            {/* <AppInput id='attribute.price1' name='attribute.price1' required label='TThương hiệu' unit='VND' />
            <AppInput id='attribute.price2' name='attribute.price2' required label='Hạn bảo hành' unit='VND' />
            <AppInput id='attribute.price3' name='attribute.price3' required label='Xuất xứ' unit='VND' />
            <AppInput
              id='attribute.price4'
              name='attribute.price4'
              required
              label='Tên tổ chức chịu trách nhiệm sản xuất'
              unit='VND'
            />
            <AppInput id='attribute.price' name='attribute.price' required label='Trọng lượng' unit='VND' />
            <AppInput
              id='attribute.price5'
              name='attribute.price5'
              required
              label='Địa chỉ tổ chức chịu trách nhiệm sản xuất'
              unit='VND'
            />
            <AppDateInput id='attributedate' name='attributedate' required label='Hạn bảo hành' /> */}
          </div>
        </div>
        <div className='mt-6'>
          <div className='flex gap-6 text-neutral-500 font-semibold text-xl '>
            <div className='w-4 h-7 bg-secondary-orange rounded-sm'></div>
            <div>Thông tin bán hàng</div>
          </div>
          <div className='mt-6 ml-6'>
            <SellInformation />
          </div>
        </div>
        <div className='mt-6'>
          <div className='flex gap-6 text-neutral-500 font-semibold text-xl '>
            <div className='w-4 h-7 bg-secondary-yellow rounded-sm'></div>
            <div>Vận chuyển</div>
          </div>
          <div className='mt-6 ml-6'>
            <AppInput id='weight' name='shipping.weight' required label='Cân nặng (sau khi đóng gói)' unit='gr' />
            <div className='grid grid-cols-3 gap-x-4'>
              <AppInput id='length' name='shipping.parcelSize.length' required label='Chiều dài' unit='mm' />
              <AppInput id='height' name='shipping.parcelSize.height' required label='Chiều cao' unit='mm' />
              <AppInput id='width' name='shipping.parcelSize.width' required label='Chiều rộng' unit='mm' />
            </div>
            <AppCheckbox name='shipping.shippingUnit' label='Đơn vị vận chuyển' required />
          </div>
        </div>
        <div className='mt-6 w-44 ml-auto'>
          <AppButton type='submit'>Tạo sản phẩm</AppButton>
        </div>
      </AppForm>
    </div>
  )
}

export default ProductAdd
