import {Link} from 'react-router-dom'
import {useRegister} from '@hooks'
import {IRegisterRequest} from '@types'
import {Form} from '@components'
import {getErrorMessage} from '@utils'

export const RegisterForm = () => {
  const regMutation = useRegister()

  const onSubmit = (data: IRegisterRequest) => {
    regMutation.mutate(data)
  }

  return (
    <div className='container'>
      <div className='formContainer'>
        <h2 className='title'>
          Вход в игру
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
          <Form.Password />1
          {regMutation.isError && (
            <div className='bg-red-50 border border-red-200 rounded-lg p-3'>
              <p className='text-red-800 text-sm'>
                {getErrorMessage(regMutation.error)}
              </p>
            </div>
          )}
          <Form.Submit
            isPending={regMutation.isPending}
            title='Зарегистрироваться'
          />
        </Form>
        {/* Ссылка на регистрацию */}
        <div className="mt-4 text-center">
          <span className="text-gray-600">Есть аккаунт? </span>
          <Link
            to="/login"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Войдите
          </Link>
        </div>
      </div>
    </div>
  )
}
