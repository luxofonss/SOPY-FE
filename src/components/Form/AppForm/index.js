import { yupResolver } from '@hookform/resolvers/yup'
import { forwardRef, useImperativeHandle } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

const AppForm = (
  {
    encType = 'application/x-www-form-urlencoded',
    resolver = null,
    className,
    children,
    onSubmit,

    ...props
  },
  ref
) => {
  const methods = useForm(resolver !== null ? { resolver: yupResolver(resolver) } : {})
  console.log('ref:: ', ref)
  useImperativeHandle(ref, () => ({
    resetFormValues() {
      methods.reset()
    }
  }))
  return (
    <FormProvider {...methods}>
      <form
        encType={encType}
        className={className}
        id={props.id}
        onSubmit={methods.handleSubmit((data, e) => {
          e.preventDefault()
          e.stopPropagation()
          onSubmit(data)
        })}
      >
        {children}
      </form>
    </FormProvider>
  )
}

export default forwardRef(AppForm)
