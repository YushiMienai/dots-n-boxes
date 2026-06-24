import {AppError} from 'errors/appErrors'

class ConflictError extends AppError {
  constructor(message: string = 'Resource conflict', code: string = 'CONFLICT_ERROR') {
    super(message, 409, code)
  }
}

export class UserExistsError extends ConflictError {
  constructor(playerName: string) {
    super(`Player name "${playerName}" already exists`, 'USER_EXISTS_ERROR')
  }
}
