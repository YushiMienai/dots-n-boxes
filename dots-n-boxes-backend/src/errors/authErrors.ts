import {AppError} from './appErrors'


class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication required', code: string = 'AUTHENTICATION_ERROR') {
    super(message, 401, 'AUTHENTICATION_ERROR')
  }
}

export class InvalidCredentialsError extends AuthenticationError {
  constructor() {
    super('Ошибка авторизации. Неверный логин или пароль.')
  }
}

export class TokenExpiredError extends AuthenticationError {
  constructor() {
    super('Token expired')
  }
}

export class InvalidTokenError extends AuthenticationError {
  constructor() {
    super('Invalid token')
  }
}

/*class AuthorizationError extends AppError {
  constructor(message: string = 'Access denied', code: string = 'AUTHORIZATION_ERROR') {
    super(message, 403, code)
  }
}

class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found') {
    super(message, 404, 'NOT_FOUND_ERROR')
  }
}*/
