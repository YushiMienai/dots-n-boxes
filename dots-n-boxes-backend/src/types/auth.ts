export interface IAuthRequest {
  name: string
  password: string
}

export interface IRegisterRequest extends IAuthRequest{
  confirmPassword: string
}

export interface IAuthResponse {
  token: string
  name: string
}

export interface IRefreshToken {
  id: string
  playerId: string
  tokenHash: string
  userAgent: string
  ipAddress: string
  isRevoked: boolean
}