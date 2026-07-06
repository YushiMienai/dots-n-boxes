import {ICell, ILine, IPlayer} from '@types'

export const createCells = (horizontalLines: ILine[], verticalLines: ILine[]): ICell[] => {
  const cells: ICell[] = []
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      cells.push({
        top: horizontalLines[row * 9 + col],
        bottom: horizontalLines[(row + 1) * 9 + col],
        left: verticalLines[row * 10 + col],
        right: verticalLines[row * 10 + col + 1],
        owner: null
      })
    }
  }
  return cells
}

export const checkForCompletedCells = (cells: ICell[], players: IPlayer[], activePlayerIndex: number): boolean => {
  const activePlayer = players[activePlayerIndex]
  let cellCompleted = false

  for (const cell of cells) {
    if (cell.owner === null &&
      cell.top.isSelected && cell.bottom.isSelected &&
      cell.left.isSelected && cell.right.isSelected) {
      cell.owner = activePlayer.id
      activePlayer.score++
      cellCompleted = true
    }
  }

  return cellCompleted
}
