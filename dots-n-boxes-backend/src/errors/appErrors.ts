export class AppError extends Error {
  public statusCode: number
  public code: string

  constructor(
    message: string,
    statusCode: number = 500,
    code: string = 'INTERNAL_ERROR',
  ) {
    super(message)
    this.statusCode = statusCode
    this.code = code
    this.name = this.constructor.name

    // Для правильного stack trace
    Error.captureStackTrace(this, this.constructor)
  }
}