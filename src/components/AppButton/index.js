const AppButton = ({ className, children, showIcon, Icon, ...props }) => {
  return (
    <button
      className={` w-full  rounded-lg  bg-gradient-to-r from-purple-500 to-pink-500 py-2 px-3 font-medium text-white transition duration-300 hover:bg-gradient-to-b ${className}`}
      {...props}
    >
      {children}
      {showIcon && <div>{Icon}</div>}
    </button>
  )
}

export default AppButton
