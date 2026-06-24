import {EGameStatus} from './enum'

export interface ICoordinate {
  x: number
  y: number
}

export interface ILine {
  start: ICoordinate
  end: ICoordinate
  clickableStart: ICoordinate
  clickableEnd: ICoordinate
  isSelected: boolean
  isHorizontal: boolean
}

export interface ICell {
  top: ILine
  bottom: ILine
  left: ILine
  right: ILine
  owner: string | null
}

export interface IPlayer {
  id: string
  name: string
  isOnline: boolean
  gameRoomId: boolean
}

export interface IGameState {
  activePlayerId: string | null
  winnerId: string | null
  cells: ICell[]
  horizontalLines: ILine[]
  verticalLines: ILine[]
  status: EGameStatus
}

export interface IGameRoom {
  id: string
  name: string
  players: IPlayer[]
  gameState: IGameState
  maxPlayers: number
  isPrivate: boolean
  createdAt: Date
}

export interface IWSMessage {
  type: string
  payload: any
  roomId: string
  playerId?: string
}
