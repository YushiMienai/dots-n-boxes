import {ReactNode, createContext} from 'react'
import {Path, RegisterOptions, useForm, FieldValues, useFormContext, FormProvider} from 'react-hook-form'
import {Loader} from './loader'

const FormContext = createContext<FieldValues | null>(null)

interface IFormProps<T> {
  children: ReactNode
  title: string | ReactNode
  onSubmit: (data: T) => void
}

interface IFormInput<T extends FieldValues> {
  name: Path<T>
  title?: string
  rules?: RegisterOptions<T, Path<T>>
  type?: string
  placeholder: string
}

interface IFormSubmit {
  isPending: boolean
  title: string
}

export const Form = <T extends FieldValues>({children, title, onSubmit}: IFormProps<T>) => {
  const methods = useForm<T>();

  if (methods.formState.isSubmitting) {
    return (
      <Loader />
    )
  }

  return (
    <FormProvider {...methods}>
      <div className='formContainer'>
        <h2 className='title'>{title}</h2>
      </div>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className='form'
      >
        {children}
      </form>
    </FormProvider>
  )
}

const FormInput = <T extends FieldValues>({name, title, rules, placeholder, type = 'text'}: IFormInput<T>) => {
  const {register, formState: {errors}} = useFormContext<T>()

  return (
    <div>
      {title && (
        <label htmlFor={name as string} className='label'>
          {title}:
        </label>
      )}
      <input
        id={name as string}
        type={type}
        {...register(name, rules)}
        placeholder={placeholder}
        className='input'
      />
      {errors[name] && (
        <p className='error'>{String(errors[name]?.message)}</p>
      )}
    </div>
  )
}

const FormPassword = <T extends FieldValues>() => {
  return (
    <FormInput<T>
      name={'password' as Path<T>}
      type='password'
      placeholder='Введите пароль'
      rules={{
        required: 'Пароль обязателен',
        minLength: {value: 6, message: 'Минимум 6 символов'}
      }}
    />
  )
}

const FormSubmit = ({isPending, title}: IFormSubmit) => {
  return (
    <button
      type='submit'
      disabled={isPending}
      className='button'
    >
      {title}
    </button>
  )
}

Form.Input = FormInput
Form.Password = FormPassword
Form.Submit = FormSubmit
