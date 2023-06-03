import { useFormContext } from 'react-hook-form'
import { v4 as uuidv4 } from 'uuid'

const initOptions = [
  { name: 'Yes', value: 1 },
  { name: 'No', value: 0 }
]

function AppRadio({
  name,
  label,
  wrapperStyle = {},
  required = false,
  disabled = false,
  validate,
  options = initOptions,
  ...props
}) {
  const {
    register,
    formState: { errors }
  } = useFormContext()

  return (
    <div className='relative my-2 w-full flex-col' style={wrapperStyle}>
      <div
        className={`mb-1.5 font-semibold block w-full ${
          !errors[name]?.type ? 'text-neutral-500' : 'text-secondary-orange'
        }`}
      >
        {label}
      </div>

      <div className='flex items-center gap-6 ml-8'>
        {options.map((option) => {
          return (
            <div className='flex gap-2 ' key={uuidv4(option.value)}>
              <label className='cursor-pointer' htmlFor={option.value}>
                {option.name}
              </label>
              <input
                id={option.value}
                type='radio'
                {...register(name, {
                  ...validate,
                  ...(required ? { required: 'Bạn phải chọn 1 giá trị' } : {})
                  // onChange: (e) => handleInputChange(e.target.value)
                })}
                name={name}
                value={option.value}
                {...props}
                disabled={disabled}
              />
            </div>
          )
        })}
      </div>
      {errors && errors[name]?.type === 'required' && (
        <div className='text-secondary-orange '>{errors[name].message}</div>
      )}
    </div>
  )
}

export default AppRadio
