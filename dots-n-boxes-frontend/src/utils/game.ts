import {ICell, IPlayer} from '@types'
import {FREE_LINE, PLAYER_COLORS} from '@config'

export const getPlayerColor = (ownerId: string | null, players: IPlayer[]): string => {
  if (!ownerId) return FREE_LINE
  const idx = players.findIndex(p => p.id === ownerId)
  return PLAYER_COLORS[idx] ?? FREE_LINE
}

export const calculateScores = (cells: ICell[]): Record<string, number> => {
  const scores: Record<string, number> = {}

  for (const cell of cells) {
    if (cell.ownerId && cell.ownerId !== 'system') {
      scores[cell.ownerId] = (scores[cell.ownerId] ?? 0) + 1
    }
  }

  return scores
}
