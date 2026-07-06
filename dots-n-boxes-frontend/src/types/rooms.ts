export interface IRoomRequest {
  name: string,
  maxPlayers: number
  password: string
}

export interface IRoomResponse {
  id: string
  name: string
  playersCount: number
  maxPlayers: number
}
