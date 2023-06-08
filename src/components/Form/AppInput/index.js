import { useEffect } from 'react'
import { useFormContext } from 'react-hook-form'

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

  useEffect(() => {
    setValue(name, defaultValue)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValue])

  return (
    <div className='relative my-2 w-full flex-col' style={wrapperStyle}>
      <label
        className={`mb-1.5 block font-semibold w-full ${
          !errors[name]?.type ? 'text-neutral-500' : 'text-secondary-orange'
        }`}
        htmlFor={id}
      >
        {label}
      </label>
      <input
        id={id}
        type={props.type || 'text'}
        className={`${className} ${
          errors[name]?.type ? 'border-secondary-orange focus:border-secondary-orange' : 'border-neutral-300'
        } h-9 bg-neutral-200 box-border w-full rounded-md border-2  py-1.5 px-4 text-neutral-500 text-sm outline-none transition duration-500 focus:border-secondary-purple ${className}`}
        placeholder={props.placeholder || ''}
        autoComplete='off'
        {...register(name, {
          ...(required ? { required: 'Trường này không được để trống' } : {}),
          ...validate
          // onChange: (e) => handleInputChange(e.target.value)
        })}
        {...props}
        defaultValue={defaultValue}
        disabled={disabled}
      />
      {unit ? (
        <div className='absolute flex items-center right-1 top-9 h-6 px-2 border-l-neutral-300 border-l-[2px] text-neutral-400 text-sm'>
          {unit}
        </div>
      ) : null}
      {showIcon && <div className='absolute right-3 top-9 cursor-pointer'>{Icon}</div>}
      {errors && <div className='text-secondary-orange '>{errors[name]?.message}</div>}
    </div>
  )
}

export default AppInput
