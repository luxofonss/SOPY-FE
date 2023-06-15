/* eslint-disable react-hooks/exhaustive-deps */
import { AddCircleIcon, TrashIcon, UploadIcon } from '@src/assets/svgs'
// import AppForm from '@src/components/Form/AppForm'
import AppInput from '@src/components/Form/AppInput'
import { isEmptyValue } from '@src/helpers/check'
import { memo, useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { v4 as uuidv4 } from 'uuid'

function SellInformation({ defaultValue = [] }) {
  const [indexes1, setIndexes1] = useState([0])
  const [counter1, setCounter1] = useState(1)

  const [indexes2, setIndexes2] = useState([0])
  const [counter2, setCounter2] = useState(1)

  const [thumbList, setThumbList] = useState([])
  const [thumbListObject, setThumbListObject] = useState([])

  const [variation1, setVariation1] = useState({ name: '', children: [] })
  const [variation2, setVariation2] = useState({ name: '', children: [] })

  const { getValues, register, setValue } = useFormContext()

  useEffect(() => {
    if (!isEmptyValue(defaultValue)) {
      if (defaultValue[0]?.subVariation) {
        //case there are two variants
        console.log('defaultValue:: ', defaultValue)

        defaultValue?.forEach((variation) => {
          if (!variation1?.name?.includes(variation.keyVariation)) {
            setValue('variation1.name', variation.keyVariation)
          }
          if (!variation2?.name?.includes(variation.subVariation)) {
            setValue('variation2.name', variation.subVariation)
          }
          setVariation1({ ...variation1, children: [...variation1.children, variation.keyVariation] })
          setVariation2({ ...variation2, children: [...variation2.children, variation.subVariationValue] })
          setIndexes1((prevIndexes) => [...prevIndexes, counter1])
          setCounter1((prevCounter) => prevCounter + 1)
          if (variation?.thumb) setThumbList([...thumbList, variation.thumb])
          setIndexes2((prevIndexes) => [...prevIndexes, counter1])
          setCounter2((prevCounter) => prevCounter + 1)
        })
      } else {
        //case there is only one variant
        defaultValue?.forEach((variation) => {
          if (!variation1?.name?.includes(variation.keyVariation)) {
            setValue('variation1.name', variation.keyVariation)
          }
          setVariation1({ ...variation1, children: [...variation1.children, variation.keyVariation] })
          setIndexes1((prevIndexes) => [...prevIndexes, counter1])
          setCounter1((prevCounter) => prevCounter + 1)
          if (variation?.thumb) setThumbList([...thumbList, variation.thumb])
        })
      }
    }
  }, [])

  console.log('variation1: ' + JSON.stringify(variation1))
  console.log('variation2: ' + JSON.stringify(variation2))

  function applyVariation() {
    const value1 = getValues('variation1')
    const value2 = getValues('variation2')
    console.log(value1, value2)
    setVariation1(value1)
    setVariation2(value2)
  }

  const addVariation1 = () => {
    const prevValue = getValues(`variation1.children[${counter1 - 1}]`)
    if (prevValue) {
      setIndexes1((prevIndexes) => [...prevIndexes, counter1])
      setCounter1((prevCounter) => prevCounter + 1)
    }
  }

  const removeVariation1 = (removeIndex) => () => {
    setIndexes1((prevIndexes) => [...prevIndexes.filter((item) => item !== removeIndex)])
    setCounter1((prevCounter) => prevCounter - 1)
    let newVariation = variation1
    newVariation.children.splice(removeIndex, 1)
    setVariation1(newVariation)
  }

  const addVariation2 = () => {
    const prevValue = getValues(`variation2.children[${counter2 - 1}]`)
    if (prevValue) {
      setIndexes2((prevIndexes) => [...prevIndexes, counter2])
      setCounter2((prevCounter) => prevCounter + 1)
    }
  }

  const removeVariation2 = (removeIndex) => () => {
    setIndexes2((prevIndexes) => [...prevIndexes.filter((item) => item !== removeIndex)])
    setCounter2((prevCounter) => prevCounter - 1)
    let newVariation = variation2
    newVariation.children.splice(removeIndex, 1)
    setVariation2(newVariation)
  }

  function uploadImages(e, index) {
    if (thumbList[index]) {
      let newLst = thumbList
      let newLstObject = thumbListObject
      newLst[index] = URL.createObjectURL(e.target.files[0])
      newLstObject[index] = e.target.files[0]
      setThumbList([...newLst])
      setThumbListObject([...newLstObject])
    } else {
      setThumbList([...thumbList, URL.createObjectURL(e.target.files[0])])
      setThumbListObject([...thumbListObject, e.target.files[0]])
    }
  }

  return (
    <div>
      <div>
        <h4 className='text-md font-semibold text-neutral-400 mb-4'>Phân loại hàng</h4>
        <div>
          {/* <AppForm onSubmit={() => {}}> */}
          <div className='p-4 rounded-md bg-secondary-blue mb-4'>
            <div className='gap-6 grid grid-cols-12'>
              <div className='col-span-2 text-sm font-medium text-neutral-400'>Nhóm phân loại 1</div>
              <div className='col-span-5'>
                <AppInput id='variation1' name='variation1.name' required placeholder='ví dụ: màu sắc vv' />
              </div>
            </div>
            <div className='gap-6 grid grid-cols-12'>
              <div className='col-span-2 text-sm font-medium text-neutral-400'>Phân loại hàng</div>
              <div className='col-span-10 grid grid-cols-2 gap-x-8'>
                {indexes1.map((index) => {
                  const fieldName = `variation1.children[${index}]`
                  return (
                    <fieldset className='relative' name={fieldName} key={fieldName}>
                      <AppInput
                        className='pr-6'
                        id={fieldName}
                        name={fieldName}
                        required
                        defaultValue={variation1?.children[index]}
                        placeholder='ví dụ: Trăng, đỏ vv'
                      />
                      <button className='absolute right-4 top-4' type='button' onClick={removeVariation1(index)}>
                        <TrashIcon small />
                      </button>
                    </fieldset>
                  )
                })}
              </div>
            </div>
            <div className='ml-auto flex justify-end'>
              <div
                type='button'
                onClick={addVariation1}
                className='p-1 rounded-full hover:bg-secondary-green transition cursor-pointer'
              >
                <AddCircleIcon />
              </div>
            </div>
          </div>

          <div className='p-4 rounded-md bg-secondary-blue mb-4'>
            <div className='gap-6 grid grid-cols-12'>
              <div className='col-span-2 text-sm font-medium text-neutral-400'>Nhóm phân loại 2</div>
              <div className='col-span-5'>
                <AppInput
                  id='variation2'
                  name='variation2.name'
                  required
                  placeholder='ví dụ: màu sắc vv'
                  defaultValue={variation2?.name}
                />
              </div>
            </div>
            <div className='gap-6 grid grid-cols-12'>
              <div className='col-span-2 text-sm font-medium text-neutral-400'>Phân loại hàng</div>
              <div className='col-span-10 grid grid-cols-2 gap-x-8'>
                {indexes2.map((index) => {
                  const fieldName = `variation2.children[${index}]`
                  return (
                    <fieldset className='relative' name={fieldName} key={fieldName}>
                      <AppInput
                        className='pr-6'
                        id={fieldName}
                        name={fieldName}
                        required
                        defaultValue={variation2?.children[index]}
                        placeholder='ví dụ: Trăng, đỏ vv'
                      />
                      <button className='absolute right-4 top-4' type='button' onClick={removeVariation2(index)}>
                        <TrashIcon small />
                      </button>
                    </fieldset>
                  )
                })}
              </div>
            </div>
            <div type='button' className='ml-auto flex justify-end  ' onClick={addVariation2}>
              <div className='p-1 rounded-full hover:bg-secondary-green transition cursor-pointer'>
                <AddCircleIcon />
              </div>
            </div>
          </div>
          {/* </AppForm> */}
        </div>
      </div>
      <button
        className='px-2 py-1 bg-secondary-purple text-neutral-200 rounded-lg hover:opacity-80 hover:translate-y-1 transition'
        type='button'
        onClick={() => {
          applyVariation()
        }}
      >
        Áp dụng
      </button>
      <div className='mt-4'>
        <h4 className='text-lg font-semibold text-neutral-400'>Danh sách phân loại hàng</h4>
        <div className='mt-4'>
          <table className='w-full text-sm text-left text-gray-500 dark:text-gray-400'>
            <thead className='text-xs text-gray-700 uppercase bg-gray-50 '>
              <tr>
                <th>Nhóm phân loại</th>
                <th></th>
                <th>Giá</th>
                <th>Kho hàng</th>
                <th>SKU phân loại</th>
              </tr>
            </thead>
            <tbody>
              {variation1?.children?.map((variation, index) => {
                return (
                  <tr key={uuidv4(variation)} className='bg-white border-b '>
                    <td className='pr-4'>
                      <span>{variation}</span>
                      <label
                        className='relative w-24 h-24 mt-1 cursor-pointer border-dashed border-2 rounded-lg border-secondary-blue flex justify-center items-center'
                        htmlFor={`variations[${index}].thumb`}
                      >
                        {thumbList[index] ? (
                          <img className='w-full h-full rounded-md object-contain' src={thumbList[index]} alt='thumb' />
                        ) : (
                          <div className='absolute -translate-x-1/2 top-1/2 -translate-y-1/2 left-1/2'>
                            <UploadIcon />
                          </div>
                        )}
                      </label>
                      <input
                        {...register(`variations[${index}].thumb`, {
                          onChange: (e) => {
                            uploadImages(e, index)
                          }
                        })}
                        id={`variations[${index}].thumb`}
                        type='file'
                        multiple
                        className='hidden'
                      />
                      <AppInput
                        id={`variations[${index}].name`}
                        type='number'
                        name={`variations[${index}].name`}
                        defaultValue={variation1.name}
                        wrapperStyle={{ display: 'none' }}
                      />
                      <AppInput
                        id={`variations[${index}].value`}
                        type='number'
                        name={`variations[${index}].value`}
                        defaultValue={variation}
                        wrapperStyle={{ display: 'none' }}
                      />
                    </td>

                    {variation2 ? (
                      <td colSpan={4}>
                        <table className='w-full'>
                          <tbody>
                            {variation2?.children?.map((varia2, index2) => {
                              return (
                                <tr key={varia2}>
                                  <td className='pr-4'>
                                    <span>{varia2}</span>
                                  </td>
                                  <AppInput
                                    id={`variations[${index}].children[${index2}].name`}
                                    name={`variations[${index}].children[${index2}].name`}
                                    defaultValue={variation2.name}
                                    wrapperStyle={{ display: 'none' }}
                                  />
                                  <AppInput
                                    id={`variations[${index}].children[${index2}].value`}
                                    name={`variations[${index}].children[${index2}].value`}
                                    defaultValue={varia2}
                                    wrapperStyle={{ display: 'none' }}
                                  />
                                  <td className='pr-4'>
                                    <AppInput
                                      id={`variations[${index}].children[${index2}].price`}
                                      type='number'
                                      name={`variations[${index}].children[${index2}].price`}
                                      required
                                      placeholder='Giá'
                                    />
                                  </td>
                                  <td className='pr-4'>
                                    <AppInput
                                      id={`variations[${index}].children[${index2}].stock`}
                                      type='number'
                                      name={`variations[${index}].children[${index2}].stock`}
                                      required
                                      placeholder='Kho hàng'
                                    />
                                  </td>
                                  <td className='pr-4'>
                                    <AppInput
                                      id={`variations[${index}].children[${index2}].sku`}
                                      type='number'
                                      name={`variations[${index}].children[${index2}].sku`}
                                      required
                                      placeholder='SKU'
                                    />
                                  </td>
                                </tr>
                              )
                            })}
                          </tbody>
                        </table>
                      </td>
                    ) : (
                      <>
                        <td className='pr-4'>
                          <AppInput
                            id={`variations[${index}].price`}
                            type='number'
                            name={`variations[${index}].price`}
                            required
                            placeholder='Giá'
                          />
                        </td>
                        <td className='pr-4'>
                          <AppInput
                            id={`variations[${index}].stock`}
                            type='number'
                            name={`variations[${index}].stock`}
                            required
                            placeholder='Kho hàng'
                          />
                        </td>
                        <td className='pr-4'>
                          <AppInput
                            id={`variations[${index}].sku`}
                            type='number'
                            name={`variations[${index}].sku`}
                            required
                            placeholder='SKU'
                          />
                        </td>
                      </>
                    )}
                  </tr>
                )
              })}
            </tbody>
          </table>
          {/* </AppForm> */}
        </div>
      </div>
    </div>
  )
}

export default memo(SellInformation)
