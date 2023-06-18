/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { get } from 'lodash'
import { useEffect, useRef, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { v4 as uuidv4 } from 'uuid'
import axios from 'axios'
import { searchString } from '@src/helpers/search'

function AddressSelect({ className, name, label, validate, required = false, Icon, showIcon }) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [provinces, setProvinces] = useState()
  const {
    register,
    setValue,
    formState: { errors }
  } = useFormContext()

  const inputRef = useRef()
  const inputTypeRef = useRef()

  useEffect(() => {
    async function fetchProvinces() {
      try {
        const response = await axios.get('https://provinces.open-api.vn/api/p/')
        const provinces = response.data
        setProvinces(response.data)
        setValue(name, provinces[0].code)
      } catch (error) {
        console.log(error)
      }
    }
    fetchProvinces()
  }, [])

  const handleSelect = (option) => {
    console.log('options:: ', option)
    setValue(name, option)
    inputTypeRef.current.value = option.name
  }

  const handleSearch = (e) => {
    setSearch(e.target.value)
  }

  const filteredOptions = provinces?.filter((option) => searchString(search, option.name))

  return (
    <div className='relative my-2 w-full flex-col'>
      <label
        onClick={() => {
          setOpen(!open)
        }}
        className={`mb-1.5 font-semibold block w-full ${
          !errors[name]?.type ? 'text-neutral-400' : 'text-secondary-orange'
        }`}
        htmlFor={name}
      >
        {label}
      </label>
      <div
        onClick={() => {
          setOpen(!open)
        }}
        className={`${className} ${
          errors[name]?.type ? 'border-secondary-orange focus:border-secondary-orange' : 'border-neutral-300'
        } relative z-[1000] h-9 bg-neutral-200 box-border w-full rounded-md border-2  py-1.5 px-4 text-neutral-500 text-sm outline-none transition duration-500 focus:border-secondary-purple ${className}`}
      >
        <input
          ref={inputTypeRef}
          type='text'
          placeholder='Search...'
          className='w-full outline-none absolute -top-[2px] -left-[2px] -right-[2px] h-9 rounded-md text-neutral-500 text-sm border-none focus:outline-none'
          onChange={handleSearch}
        />
        {open ? (
          <ul className='absolute max-h-80 overflow-y-scroll top-10 left-0 right-0 z-100 rounded-md border-neutral-300  bg-neutral-200 p-4 transition'>
            {filteredOptions.map((option) => {
              return (
                <li
                  onClick={() => {
                    handleSelect(option)
                  }}
                  className='h-8 mb-1 px-2 hover:bg-neutral-300 font-medium text-sm text-neutral-500 flex items-center rounded-md transition-all cursor-pointer'
                  key={uuidv4(option.code)}
                >
                  {option.name}
                </li>
              )
            })}
          </ul>
        ) : null}
      </div>

      {showIcon && <div className='absolute right-3 top-9 cursor-pointer'>{Icon}</div>}
      {errors && <div className='text-secondary-orange '>{get(errors, name)?.message}</div>}

      <input
        className='hidden'
        ref={inputRef}
        id={name}
        {...register(name, {
          ...(required ? { required: 'Trường này không được để trống' } : { required: false }),
          ...validate
        })}
      />
    </div>
  )
}

export default AddressSelect
