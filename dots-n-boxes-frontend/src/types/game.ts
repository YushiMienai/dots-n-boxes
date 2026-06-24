import {IPlayer} from './players'

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
  owner: number | null
}

export interface IGameState {
  players: IPlayer[]
  activePlayerIndex: number
  cells: ICell[]
  horizontalLines: ILine[]
  verticalLines: ILine[]
}
