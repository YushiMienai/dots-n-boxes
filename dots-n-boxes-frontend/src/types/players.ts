import {EPlayerColor} from './enums'

export interface IPlayer {
  id: string
  name: string
  isOnline: boolean
  color: EPlayerColor
  score: string
}
