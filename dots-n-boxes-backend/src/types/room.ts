import {IPlayer} from './game'

export interface IRoomSearch {
  name: string
  isPrivate: boolean
}

export interface IRoomRequest {
  id: string
  password: string
}

export interface IRoomResponse {
  id: string
  name: string
  maxPlayers: number
  players: IPlayer[]
  isPrivate: boolean
  createdAt: Date
}
