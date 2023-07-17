/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import AppButton from '@src/components/AppButton'
import appApi from '@src/redux/service'
import { useRef, useState } from 'react'
import { toast } from 'react-toastify'
import { useGetAllCategoryQuery } from '../../adminService'
const { default: AppInput } = require('@src/components/Form/AppInput')
const { default: AppModal } = require('@src/components/Modal')

function ChooseCategory({ handleCategoryResponse, handleChooseCategory, required = true }) {
  const closeRef = useRef()
  const [productCategory, setProductCategory] = useState({ parent: null, child: null })
  const { data: categoryList } = useGetAllCategoryQuery()
  const [getProductAttributes] = appApi.endpoints.getProductAttributes.useLazyQuery()
  const [categoryError, setCategoryError] = useState(null)

  console.log(typeof handleCategoryResponse)

  async function handleChooseProductCategory() {
    if (productCategory.children !== null) {
      const response = await getProductAttributes({ typeId: productCategory.children._id })
      if (response.isSuccess) handleCategoryResponse(response.data.metadata)
      else toast.warn('Something went wrong, please try again!')
      closeRef.current.closeModal()
    } else {
      setCategoryError(true)
    }
  }

  return (
    <AppModal
      closeRef={closeRef}
      Trigger={
        <AppInput
          id='type'
          name='type'
          required={required}
          label='Chọn ngành hàng'
          disabled
          defaultValue={
            productCategory.children ? `${productCategory?.parent?.name} > ${productCategory?.children?.name}` : ''
          }
        />
      }
    >
      <div className='w-[550px] rounded-lg bg-neutral-200 p-10'>
        <h4 className='text-lg font-semibold text-neutral-400'>Chọn ngành hàng</h4>
        <div className='mt-4 grid grid-cols-2 gap-x-6 bg-neutral-0'>
          <div className='border-r-2 border-r-neutral-300 py-4 px-6'>
            <ul>
              {categoryList
                ? categoryList.metadata.map((category) => (
                    <li
                      key={category._id}
                      onClick={() => {
                        setProductCategory({ parent: category, children: null })
                      }}
                      className={`${
                        productCategory?.parent?._id === category._id ? 'bg-secondary-green' : ''
                      } h-6 cursor-pointer rounded-sm pl-3 text-start text-sm font-medium text-neutral-400 hover:bg-neutral-200`}
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
                          handleChooseCategory(type._id)
                        }}
                        key={type._id}
                        className={`${
                          productCategory?.children?._id === type._id ? 'bg-secondary-purple' : ''
                        } my-[2px] cursor-pointer rounded-sm pl-3 text-start text-sm font-medium text-neutral-400 hover:bg-neutral-200`}
                      >
                        {type.name}
                      </li>
                    )
                  })
                : null}
            </ul>
          </div>
        </div>
        <div className='mt-6 flex items-center justify-end'>
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
          <span className='mt-2 ml-auto text-sm text-secondary-orange'>Bạn chưa chọn ngành hàng </span>
        ) : null}
      </div>
    </AppModal>
  )
}

export default ChooseCategory
