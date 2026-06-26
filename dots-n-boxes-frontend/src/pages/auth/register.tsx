import {Link} from 'react-router-dom'
import {useRegister} from '@hooks'
import {IRegisterRequest} from '@types'
import {AuthLayout, Form} from '@components'
import {getErrorMessage} from '@utils'

export const Register = () => {
  const regMutation = useRegister()

  const onSubmit = (data: IRegisterRequest) => {
    regMutation.mutate(data)
  }

  return (
    <AuthLayout
      links={
        <>
          <p className='linkText'>Есть аккаунт? </p>
          <Link
            to='/login'
            className='linkPrimary'
          >
            Войдите
          </Link>
        </>
      }
    >
      <h2 className='title'>
        Регистрация
      </h2>
      <Form<IRegisterRequest> onSubmit={onSubmit}>
        <Form.Input
          name='name'
          placeholder='Введите имя пользователя'
          rules={{
            required: 'Имя пользователя обязательно',
            minLength: {
              value: 3,
              message: 'Минимум 3 символа'
            },
            maxLength: {
              value: 20,
              message: 'Максимум 20 символов'
            }
          }}
        />
        <Form.Password />
        {regMutation.isError && (
          <div className='errorBlock'>
            <p className='errorText'>{getErrorMessage(regMutation.error)}</p>
          </div>
        )}
        <Form.Submit
          isPending={regMutation.isPending}
          title='Зарегистрироваться'
        />
      </Form>
    </AuthLayout>
  )
}
