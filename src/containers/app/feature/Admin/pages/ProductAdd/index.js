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
import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { useAddProductMutation } from '../../adminService'
import SellInformation from '../../components/SellInformation'
import AppSelect from '@src/components/Form/AppSelect'
import ChooseCategory from '../../components/ChooseCategory'
import { toast } from 'react-toastify'

function ProductAdd() {
  const [imageList, setImageList] = useState([])
  const [imageListObject, setImageListObject] = useState([])
  const [limitUpload, setLimitUpload] = useState(false)
  const [productAttributeList, setProductAttributeList] = useState()
  const [addProduct, { isLoading: isAddingProduct }] = useAddProductMutation()
  const [categoryId, setCategoryId] = useState()

  function handleChooseCategory(id) {
    setCategoryId(id)
  }

  function handleChangeProductAttribute(data) {
    setProductAttributeList(data)
  }

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
    console.log('product category: ', categoryId)

    const flatData = new FormData()

    flatData.append('typeId', categoryId)
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

    //append background images
    imageListObject.forEach((image) => {
      flatData.append('thumb', image)
    })

    //append image in each variation
    data.variations.map((variation, index) => {
      console.log(variation.thumb)
      if (variation.thumb) flatData.append(`variations[${index}].thumb`, variation.thumb[0])
    })

    const response = await addProduct(flatData)
    console.log('response:: ', response)
    if (response.error) {
      toast.error(response.error?.data?.message)
    } else {
      toast.success('Thêm sản phẩm thành công!')
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
            <ChooseCategory
              handleChooseCategory={handleChooseCategory}
              handleCategoryResponse={handleChangeProductAttribute}
            />
            <AppInput id='name' name='name' required label='Tên sản phẩm' />
            <AppTextArea id='description' name='description' required label='Mô tả' rows={5} />
            <div className='grid grid-cols-3 gap-x-6'>
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
                            key={attribute.path}
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
                            key={attribute.path}
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
                          <AppSelect
                            key={attribute.path}
                            id={`attributes.${attribute.path}`}
                            name={`attributes.${attribute.path}`}
                            label={attribute.name.vi}
                            options={attribute.selections}
                            required
                          />
                        )
                    }
                })
              : null}
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
          <AppButton isLoading={isAddingProduct} type='submit'>
            Tạo sản phẩm
          </AppButton>
        </div>
      </AppForm>
    </div>
  )
}

export default ProductAdd
