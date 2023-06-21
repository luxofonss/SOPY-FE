/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { get } from 'lodash'
import { useEffect, useRef, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { v4 as uuidv4 } from 'uuid'

const exampleOptions = [
  {
    name: 'Name 1',
    value: 1
  },
  {
    name: 'Name 2',
    value: 2
  },
  {
    name: 'Name 3',
    value: 3
  }
]

function AppSelect({
  className,
  name,
  label,
  validate,
  options = exampleOptions,
  defaultValue,
  required = false,
  Icon,
  showIcon
}) {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState(options[0] || {})
  const {
    register,
    setValue,
    getValues,
    formState: { errors }
  } = useFormContext()

  const inputRef = useRef()

  console.log(getValues(name), defaultValue)

  useEffect(() => {
    setValue(name, selected.value)
  }, [])

  const handleSelect = (option) => {
    console.log(option)
    setSelected({ ...option })
    setValue(name, option.value)
  }

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
        } relative z-[10] h-9 bg-neutral-200 box-border w-full rounded-md border-2  py-1.5 px-4 text-neutral-500 text-sm outline-none transition duration-500 focus:border-secondary-purple ${className}`}
      >
        {selected.name}
        {open ? (
          <ul className='absolute top-10 left-0 right-0 z-100 rounded-md border-neutral-300  bg-neutral-200 p-4 transition'>
            {options.map((option) => {
              return (
                <li
                  onClick={() => {
                    handleSelect(option)
                  }}
                  className='h-8 mb-1 px-2 hover:bg-neutral-300 font-medium text-sm text-neutral-500 flex items-center rounded-md transition-all cursor-pointer'
                  key={uuidv4(option.value)}
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

export default AppSelect
