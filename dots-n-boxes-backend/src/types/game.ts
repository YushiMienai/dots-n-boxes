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
  gameRoomId: string | null
}

export interface IGamePlayer extends IPlayer {
  socketId: string | null   // ← только для игры, не для БД
  color?: string            // ← цвет фишки, если нужен
}

export interface IGameState {
  roomId: string
  players: IGamePlayer[]
  maxPlayers: number
  activePlayerId: string | null
  winnerId: string | null
  cells: ICell[]
  horizontalLines: ILine[]
  verticalLines: ILine[]
  status: EGameStatus
}
