/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { get } from 'lodash'
import { useEffect, useRef, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { v4 as uuidv4 } from 'uuid'
import { twMerge } from 'tailwind-merge'

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

function AppSelect({ className, name, label, validate, options = exampleOptions, required = false, Icon, showIcon }) {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState(options[0] || {})
  const {
    register,
    setValue,
    formState: { errors }
  } = useFormContext()

  const inputRef = useRef()

  const classes = twMerge(
    `${className} ${
      errors[name]?.type ? 'border-danger focus:border-danger' : 'border-neutral-300'
    } h-10 relative z-[10] box-border w-full rounded-md border-2 bg-neutral-200  py-1.5 px-4 text-sm text-neutral-500 outline-none transition duration-500 focus:border-secondary-purple`
  )

  useEffect(() => {
    setValue(name, selected.value)
  }, [])

  const handleSelect = (option) => {
    console.log(option)
    setSelected({ ...option })
    setValue(name, option.value)
  }

  return (
    <div className={`${label ? 'my-2' : ''} relative  w-full flex-col`}>
      {label ? (
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
      ) : null}
      <div
        onClick={() => {
          setOpen(!open)
        }}
        className={classes}
      >
        {selected.name}
        {open ? (
          <ul className='z-100 absolute top-10 left-0 right-0 rounded-md border-neutral-300  bg-neutral-200 p-4 transition'>
            {options.map((option) => {
              return (
                <li
                  onClick={() => {
                    handleSelect(option)
                  }}
                  className='mb-1 flex h-8 cursor-pointer items-center rounded-md px-2 text-sm font-medium text-neutral-500 transition-all hover:bg-neutral-300'
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

export default AppSelect
