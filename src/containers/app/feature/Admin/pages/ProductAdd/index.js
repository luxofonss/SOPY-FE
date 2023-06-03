import AppButton from '@src/components/AppButton'
// import AppFileInput from '@src/components/Form/AppFileInput'
import AppForm from '@src/components/Form/AppForm'
import AppInput from '@src/components/Form/AppInput'
import AppRadio from '@src/components/Form/AppRadio'
import AppSelect from '@src/components/Form/AppSelect'
import AppTextArea from '@src/components/Form/AppTextArea'
import AppModal from '@src/components/Modal'
import { useRef, useState } from 'react'
import SellInformation from '../../components/SellInformation'
import { TrashIcon, UploadIcon } from '@src/assets/svgs'
import { v4 as uuidv4 } from 'uuid'

function ProductAdd() {
  const [imageList, setImageList] = useState([])
  const [limitUpload, setLimitUpload] = useState(false)
  const closeRef = useRef()

  function uploadImages(e) {
    if (imageList.length < 10) setImageList([...imageList, URL.createObjectURL(e.target.files[0])])
    else setLimitUpload(true)
  }

  function handleDeleteImage(image) {
    console.log(image)
    let newList = imageList
    console.log(
      'newList.findIndex((e) => e === image):',
      newList,
      newList.findIndex((e) => e == image)
    )
    newList.splice(
      newList.findIndex((e) => e === image),
      1
    )
    setImageList([...newList])
  }

  console.log('imageList:: ', imageList)

  return (
    <div className='py-8 px-32 bg-neutral-100 rounded-lg'>
      <div className='text-neutral-700 font-semibold text-2xl'>Thêm sản phẩm mới</div>
      <AppForm
        onSubmit={(data) => {
          console.log('data:: ', data)
        }}
      >
        <div className='mt-6'>
          <div className='flex gap-6 text-neutral-500 font-semibold text-xl '>
            <div className='w-4 h-7 bg-secondary-purple rounded-sm'></div>
            <div>Thông tin cơ bản</div>
          </div>
          <div className='mt-6 ml-6'>
            <AppSelect name='type' label='Loại sản phẩm' required />
            <AppInput id='name' name='name' required label='Tên sản phẩm' />
            <AppTextArea id='description' name='description' required label='Mô tả' rows={5} />
            <div>
              <div className='mb-1.5 font-semibold w-full text-neutral-500'>Hình ảnh</div>
              <div className='flex gap-8'>
                <label
                  className='w-24 h-24 mt-1 cursor-pointer border-dashed border-2 rounded-lg border-secondary-blue flex justify-center items-center'
                  htmlFor='images'
                >
                  <UploadIcon />
                </label>
                <input onChange={(e) => uploadImages(e)} id='images' type='file' multiple className='hidden' />
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
            <AppInput id='price' name='price' required label='TThương hiệu' unit='VND' />
            <AppInput id='price' name='price' required label='Hạn bảo hành' unit='VND' />
            <AppInput id='price' name='price' required label='Xuất xứ' unit='VND' />
            <AppInput id='price' name='price' required label='Tên tổ chức chịu trách nhiệm sản xuất' unit='VND' />
            <AppInput id='price' name='price' required label='Trọng lượng' unit='VND' />
            <AppInput id='price' name='price' required label='Địa chỉ tổ chức chịu trách nhiệm sản xuất' unit='VND' />
            <AppRadio name='check' label='Check' required />
            <AppModal closeRef={closeRef} Trigger={<div>Trigger</div>}>
              <div className='bg-slate-300 p-10'>
                <div>Children</div>
                <div onClick={() => closeRef.current.closeModal()}>Close</div>
              </div>
            </AppModal>
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
        <AppButton type='submit'>Tạo sản phẩm</AppButton>
      </AppForm>
    </div>
  )
}

export default ProductAdd

{
  /* <AppRadio name='check' label='Check' required />
            <AppModal closeRef={closeRef} Trigger={<div>Trigger</div>}>
              <div className='bg-slate-300 p-10'>
                <div>Children</div>
                <div onClick={() => closeRef.current.closeModal()}>Close</div>
              </div>
            </AppModal>
            <AppFileInput id='image' name='image' required label='Hình ảnh' multiple />

 */
}
