import { UploadIcon } from '@src/assets/svgs'
import { useState } from 'react'
import { useFormContext } from 'react-hook-form'

function AppFileInput({
  id,
  name,
  label,
  wrapperStyle = {},
  className,
  required = false,
  disabled = false,
  validate,
  multiple = false,
  ...props
}) {
  const [fileName, setFileName] = useState('')
  const {
    register,
    formState: { errors }
  } = useFormContext()

  const changeHandler = (e) => {
    if (e.target.files.length > 0) {
      let filename = e.target.files[0].name
      setFileName(filename)
    }
  }

  return (
    <div className='relative my-2 w-full flex-col' style={wrapperStyle}>
      <div
        className={`mb-1.5 font-semibold block w-full ${
          !errors[name]?.type ? 'text-neutral-500' : 'text-secondary-orange'
        }`}
      >
        {label}
      </div>
      <label
        htmlFor={id}
        className={`${className} ${
          errors[name]?.type ? 'border-secondary-orange focus:border-secondary-orange' : 'border-neutral-300'
        } h-9 block bg-neutral-200 box-border w-full rounded-md border-2  py-1.5 px-4 text-neutral-700 outline-none transition duration-500 focus:secondary-purple ${className}`}
      >
        {fileName ? fileName : 'Choose a file'}
      </label>
      <input
        id={id}
        className='display-none text-sm'
        type='file'
        {...register(name, {
          ...(required ? { required: 'Trường này không được để trống' } : {}),
          ...validate,
          onChange: (e) => {
            changeHandler(e)
          }
        })}
        {...props}
        disabled={disabled}
        multiple={multiple}
      />
      <div className='absolute pointer-events-none right-3 p-1 top-9 cursor-pointer hover:bg-slate-50'>
        <UploadIcon />
      </div>
      {errors && errors[name]?.type === 'required' && (
        <div className='text-secondary-orange '>{errors[name].message}</div>
      )}
      {errors && errors[name]?.type === 'pattern' && (
        <div className='text-secondary-orange'>{errors[name].message}</div>
      )}
    </div>
  )
}

export default AppFileInput
