import {Link} from 'react-router-dom'
import {useLogin} from '@hooks'
import {ILoginRequest} from '@types'
import {AuthLayout, Form} from '@components'

export const Login = () => {
  const loginMutation = useLogin()

  const onSubmit = (data: ILoginRequest) => {
    console.log(data)
    loginMutation.mutate(data)
  }

  return (
    <AuthLayout
      links={
        <>
          <p className='linkText'>
            Нет аккаунта?&nbsp;
            <Link to='/register' className='linkPrimary'>
              Зарегистрироваться
            </Link>
          </p>
          <Link to='/forgot-password' className='linkSecondary'>
            Забыли пароль?
          </Link>
        </>
      }
    >
      <Form<ILoginRequest>
        onSubmit={onSubmit}
        title={
          <div className='titleWithIcon'>
            <h2 className='mainTitle'>Вход в аккаунт</h2>
            <p className='subTitle'>Введите свои данные для входа</p>
          </div>
        }
      >
        <Form.Input<ILoginRequest>
          name='name'
          placeholder='Имя пользователя'
          rules={{required: 'Имя пользователя обязательно'}}
        />
        <Form.Password<ILoginRequest> />
        {loginMutation.isError && (
          <div className='errorBlock'>
            <p className='errorText'>{loginMutation.error?.message}</p>
          </div>
        )}
        <Form.Submit
          isPending={loginMutation.isPending}
          title={loginMutation.isPending ? 'Вход...' : 'Войти'}
        />
      </Form>
    </AuthLayout>
  )
}
