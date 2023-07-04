import { BeatLoader } from 'react-spinners'
import { twMerge } from 'tailwind-merge'

const AppButton = ({
  className,
  loaderColor = '#fff',
  type,
  isLoading = false,
  children,
  showIcon,
  Icon,
  ...props
}) => {
  const classes =
    twMerge(`flex gap-3 h-10 items-center justify-center rounded-lg  bg-orange-4 px-3 font-medium text-white transition duration-300 hover:bg-orange-3 ${
      className ?? ''
    }
  `)
  return (
    <button type={type} className={classes} {...props}>
      {isLoading ? <BeatLoader size={12} color={loaderColor} /> : children}
      {showIcon && <div>{Icon}</div>}
    </button>
  )
}

export default AppButton
