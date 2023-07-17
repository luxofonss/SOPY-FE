import { useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { get } from 'lodash'
import { twMerge } from 'tailwind-merge'

function AppInput({
  id,
  name,
  label,
  wrapperStyle = {},
  className,
  required = false,
  disabled = false,
  validate,
  showIcon,
  defaultValue = null,
  unit,
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
    } h-10 bg-neutral-200 box-border w-full rounded-md border-2  py-1.5 px-4 text-neutral-500 text-sm outline-none transition duration-500 focus:border-secondary-purple mb-1 focus:outline-none focus:ring-0`
  )

  useEffect(() => {
    setValue(name, defaultValue)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValue])

  return (
    <div className='relative my-2 w-full flex-col' style={wrapperStyle}>
      <label className={`mb-1.5 block w-full text-sm font-medium  text-neutral-500`} htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        type={props.type || 'text'}
        className={classes}
        placeholder={props.placeholder || ''}
        autoComplete='off'
        {...register(name, {
          ...(required ? { required: 'Trường này không được để trống' } : {}),
          ...validate
        })}
        {...props}
        defaultValue={defaultValue}
        disabled={disabled}
      />
      {unit ? (
        <div className='absolute right-1 top-9 flex h-6 items-center border-l-[2px] border-l-neutral-300 px-2 text-sm text-neutral-400'>
          {unit}
        </div>
      ) : null}
      {showIcon && <div className='absolute right-3 top-9 cursor-pointer'>{Icon}</div>}
      {errors[name] && <div className='text-xs text-danger'>{get(errors, name)?.message}</div>}
    </div>
  )
}

export default AppInput
