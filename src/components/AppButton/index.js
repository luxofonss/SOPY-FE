import Skeleton from 'react-loading-skeleton'
import { twMerge } from 'tailwind-merge'

const AppButton = ({ className, type, isLoading = false, children, showIcon, Icon, ...props }) => {
  const classes =
    twMerge(` rounded-lg  bg-purple-500 py-2 px-3 font-medium text-white transition duration-300 hover:bg-purple-600 ${
      className ?? ''
    }
  `)
  return (
    <button type={type} className={classes} {...props}>
      {isLoading ? <Skeleton /> : children}
      {showIcon && <div>{Icon}</div>}
    </button>
  )
}

export default AppButton
