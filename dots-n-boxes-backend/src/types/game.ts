import {EGameStatus} from './enum'

export interface ILine {
  lineId: string
  ownerId: string | null
}

export interface ICell {
  top: ILine
  bottom: ILine
  left: ILine
  right: ILine
  ownerId: string | null
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
  roomName: string
  players: IGamePlayer[]
  maxPlayers: number
  activePlayerIndex: number
  winnerId: string | null
  cells: ICell[]
  horizontalLines: ILine[]
  verticalLines: ILine[]
  status: EGameStatus
  resetVoteYes: number
}
