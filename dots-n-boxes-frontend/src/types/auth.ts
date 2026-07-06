export interface IAuthResponse {
  name: string
  accessToken: string
  refreshToken: string
}

export interface ILoginRequest {
  name: string
  password: string
}

export interface IRegisterRequest extends ILoginRequest {
  confirmPassword: string
}
