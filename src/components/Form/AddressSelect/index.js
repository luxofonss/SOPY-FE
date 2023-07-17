/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { useEffect, useRef, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { get } from 'lodash'
import { v4 as uuidv4 } from 'uuid'
import { twMerge } from 'tailwind-merge'
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

  const classes = twMerge(
    `${className} ${
      errors[name]?.type ? 'border-danger focus:border-danger' : 'border-neutral-300'
    } relative z-[1000] box-border h-10 w-full rounded-md border-2 bg-neutral-200  py-1.5 px-4 text-sm text-neutral-500 outline-none transition duration-500 focus:border-secondary-purple`
  )

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
        className={`mb-1.5 block w-full text-sm font-medium ${
          !errors[name]?.type ? 'text-neutral-500' : 'text-danger'
        }`}
        htmlFor={name}
      >
        {label}
      </label>
      <div
        onClick={() => {
          setOpen(!open)
        }}
        className={classes}
      >
        <input
          ref={inputTypeRef}
          type='text'
          placeholder='Search...'
          className='absolute -top-[2px] -left-[2px] -right-[2px] h-9 w-full rounded-md border-none text-sm text-neutral-500 outline-none focus:outline-none'
          onChange={handleSearch}
        />
        {open ? (
          <ul className='z-100 absolute top-10 left-0 right-0 max-h-80 overflow-y-scroll rounded-md border-neutral-300  bg-neutral-200 p-4 transition'>
            {filteredOptions.map((option) => {
              return (
                <li
                  onClick={() => {
                    handleSelect(option)
                  }}
                  className='mb-1 flex h-8 cursor-pointer items-center rounded-md px-2 text-sm font-medium text-neutral-500 transition-all hover:bg-neutral-300'
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
      {errors[name] && <div className='text-danger '>{get(errors, name)?.message}</div>}

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
