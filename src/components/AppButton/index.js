const AppButton = ({ className, type, children, showIcon, Icon, ...props }) => {
  return (
    <button
      type={type}
      className={` w-full  rounded-lg  bg-purple-500 py-2 px-3 font-medium text-white transition duration-300 hover:bg-purple-600 ${className}`}
      {...props}
    >
      {children}
      {showIcon && <div>{Icon}</div>}
    </button>
  )
}

export default AppButton
