import { UploadIcon } from '@src/assets/svgs'
import { useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { twMerge } from 'tailwind-merge'

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

  const classes = twMerge(
    `${className} ${
      errors[name]?.type ? 'border-danger focus:border-danger' : 'border-neutral-300'
    } focus:secondary-purple box-border block h-10 w-full rounded-md border-2  bg-neutral-200 py-1.5 px-4 text-sm text-neutral-500 outline-none transition duration-500`
  )

  const changeHandler = (e) => {
    if (e.target.files.length > 0) {
      let filename = e.target.files[0].name
      setFileName(filename)
    }
  }

  return (
    <div className='relative my-2 w-full flex-col' style={wrapperStyle}>
      <div className={`mb-1.5 block w-full font-semibold ${!errors[name]?.type ? 'text-neutral-400' : 'text-danger'}`}>
        {label}
      </div>
      <label htmlFor={id} className={classes}>
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
      <div className='pointer-events-none absolute right-3 top-9 cursor-pointer p-1 hover:bg-slate-50'>
        <UploadIcon />
      </div>
      {errors[name] && <div className='text-danger '>{errors[name].message}</div>}
    </div>
  )
}

export default AppFileInput
