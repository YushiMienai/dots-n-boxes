import {IGameState, ICell} from '@types'


export const findClosedCells = (
  lineId: string,
  game: IGameState,
): ICell[] => {
  console.log('findClosedCells', lineId)
  const closeCells = game.cells.filter(cell =>
    cell.left.lineId === lineId ||
    cell.top.lineId === lineId ||
    cell.right.lineId === lineId ||
    cell.bottom.lineId === lineId
  )
  console.log(closeCells)

  return closeCells.filter(cell => cell.left.ownerId && cell.top.ownerId && cell.right.ownerId && cell.bottom.ownerId)
}

export const isBorderLine = (lineId: string, boardSize: number): boolean => {
  const [type, a, b] = lineId.split('-')
  if (type === 'h') return a === '0' || a === String(boardSize)
  return b === '0' || b === String(boardSize)
}
