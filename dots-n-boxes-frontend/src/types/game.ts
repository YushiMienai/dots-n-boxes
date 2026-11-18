import {IPlayer} from './players'

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

export interface IGameState {
  roomId: string
  roomName: string
  players: IPlayer[]
  activePlayerIndex: number
  cells: ICell[]
  horizontalLines: ILine[]
  verticalLines: ILine[]
}

export type MoveResponse =
  | {success: true}
  | {success: false, error: string}
