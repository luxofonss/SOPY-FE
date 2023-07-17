import { useFormContext } from 'react-hook-form'
import { v4 as uuidv4 } from 'uuid'

const initOptions = [
  { name: 'Yes', value: 1 },
  { name: 'No', value: 0 }
]

function AppCheckbox({
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
      <div className={`mb-1.5 block w-full font-semibold ${!errors[name]?.type ? 'text-neutral-400' : 'text-danger'}`}>
        {label}
      </div>

      <div className='ml-8 flex items-center gap-6'>
        {options.map((option) => {
          return (
            <div className='flex items-center gap-2' key={uuidv4(option.value)}>
              <input
                id={option.value}
                type='checkbox'
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
              <label className='cursor-pointer' htmlFor={option.value}>
                {option.name}
              </label>
            </div>
          )
        })}
      </div>
      {errors[name] && <div className='text-danger '>{errors[name].message}</div>}
    </div>
  )
}

export default AppCheckbox
