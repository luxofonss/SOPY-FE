import { get } from 'lodash'
import { useFormContext } from 'react-hook-form'
import { twMerge } from 'tailwind-merge'

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

  const classes = twMerge(
    `${className} ${
      errors[name]?.type ? 'border-danger focus:border-danger' : 'border-neutral-300'
    }  box-border w-full rounded-md border-2 bg-neutral-200  py-1.5 px-4 text-sm text-neutral-500 outline-none transition duration-500 focus:border-secondary-purple`
  )

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
      <textarea
        id={id}
        type={props.type || 'text'}
        className={classes}
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
      {errors[name] && <div className='text-danger '>{get(errors, name)?.message}</div>}
    </div>
  )
}

export default AppTextArea
