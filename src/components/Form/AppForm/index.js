import { FormProvider, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

export default function AppForm({
  encType = 'application/x-www-form-urlencoded',
  resolver = null,
  className,
  children,
  onSubmit,
  ...props
}) {
  const methods = useForm(resolver !== null ? { resolver: yupResolver(resolver) } : {})
  return (
    <FormProvider {...methods}>
      <form encType={encType} className={className} id={props.id} onSubmit={methods.handleSubmit(onSubmit)}>
        {children}
      </form>
    </FormProvider>
  )
}
