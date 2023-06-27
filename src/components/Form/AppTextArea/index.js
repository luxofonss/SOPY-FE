import { get } from 'lodash'
import { useFormContext } from 'react-hook-form'

function AppTextArea({
  id,
  name,
  label,
  rows,
  wrapperStyle = {},
  className,
  required = false,
  disabled = false,
  validate,
  showIcon,
  Icon,
  ...props
}) {
  const {
    register,
    formState: { errors }
  } = useFormContext()

  return (
    <div className='relative my-2 w-full flex-col' style={wrapperStyle}>
      <label
        className={`mb-1.5 font-medium block w-full text-sm ${
          !errors[name]?.type ? 'text-neutral-500' : 'text-secondary-orange'
        }`}
        htmlFor={id}
      >
        {label}
      </label>
      <textarea
        id={id}
        type={props.type || 'text'}
        className={`${className} ${
          errors[name]?.type ? 'border-secondary-orange focus:border-secondary-orange' : 'border-neutral-300'
        }  bg-neutral-200 box-border w-full rounded-md border-2  py-1.5 px-4 text-neutral-500 text-sm outline-none transition duration-500 focus:border-secondary-purple ${className}`}
        placeholder={props.placeholder || ''}
        autoComplete='off'
        {...register(name, {
          ...(required ? { required: 'Trường này không được để trống' } : {}),
          ...validate
          // onChange: (e) => handleInputChange(e.target.value)
        })}
        rows={rows}
        {...props}
        disabled={disabled}
      ></textarea>
      {showIcon && <div className='absolute right-3 top-9 cursor-pointer'>{Icon}</div>}
      {errors && <div className='text-secondary-orange '>{get(errors, name)?.message}</div>}
    </div>
  )
}

export default AppTextArea
