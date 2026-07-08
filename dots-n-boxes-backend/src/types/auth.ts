export interface IAuthRequest {
  name: string
  password: string
}

export interface IAuthResponse {
  accessToken: string
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
