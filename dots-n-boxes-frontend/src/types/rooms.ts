import {EAccessLevel} from './enums'

export interface IRoomRequest {
  name: string,
  maxPlayers: number
  password?: string
  accessLevel: EAccessLevel
}

export interface IRoomResponse {
  id: string
  name: string
  playersCount: number
  maxPlayers: number
  accessLevel: EAccessLevel
}
