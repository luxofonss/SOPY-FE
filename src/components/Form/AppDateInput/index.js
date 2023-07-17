/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { twMerge } from 'tailwind-merge'

function AppDateInput({
  id,
  name,
  label,
  wrapperStyle = {},
  className,
  required = false,
  disabled = false,
  validate,
  showIcon,
  unit,
  defaultValue = null,
  Icon,
  ...props
}) {
  const {
    register,
    setValue,
    formState: { errors }
  } = useFormContext()

  const classes = twMerge(
    `${className} ${
      errors[name]?.type ? 'border-danger focus:border-danger' : 'border-neutral-300'
    } box-border h-10 w-full rounded-md border-2 bg-neutral-200  py-1.5 px-4 text-sm text-neutral-500 outline-none transition duration-500 focus:border-secondary-purple`
  )

  useEffect(() => {
    setValue(name, defaultValue)
  }, [])

  return (
    <div className='relative my-2 w-full flex-col' style={wrapperStyle}>
      <label
        className={`mb-1.5 block w-full text-sm font-medium ${
          !errors[name]?.type ? 'text-neutral-500' : 'text-danger'
        }`}
        htmlFor={id}
      >
        {label}
      </label>
      <input
        id={id}
        type='date'
        className={classes}
        placeholder={props.placeholder || ''}
        autoComplete='off'
        {...register(name, {
          ...(required ? { required: 'Trường này không được để trống' } : {}),
          ...validate
        })}
        defaultValue={defaultValue}
        {...props}
        disabled={disabled}
      />

      {unit ? (
        <div className='absolute right-1 top-9 flex h-6 items-center border-l-[2px] border-l-neutral-300 px-2 text-sm text-neutral-400'>
          {unit}
        </div>
      ) : null}
      {showIcon && <div className='absolute right-3 top-9 cursor-pointer'>{Icon}</div>}
      {errors[name] && <div className='text-danger '>{errors[name].message}</div>}
    </div>
  )
}

export default AppDateInput
