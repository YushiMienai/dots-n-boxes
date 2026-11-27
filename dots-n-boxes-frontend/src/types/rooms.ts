import {EAccessLevel} from './enums'

export interface IRoomRequest {
  name: string,
  maxPlayers: number
  boardSize: number
  password?: string
  accessLevel: EAccessLevel
}

export interface IRoomResponse {
  id: string
  name: string
  playersCount: number
  maxPlayers: number
  boardSize: number
  currentPlayersCount: number
  accessLevel: EAccessLevel
}
