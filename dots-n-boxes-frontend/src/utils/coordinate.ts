import {ICoordinate} from '@types'

export const calculateGridDimensions = (
  cellSize: number,
  lineOffset: number,
  gridSize: number = 9
) => {
  const dotCount = gridSize + 1 // Количество точек = размер сетки + 1
  const totalWidth = cellSize * gridSize + lineOffset * 2
  const totalHeight = cellSize * gridSize + lineOffset * 2

  return {
    totalWidth,
    totalHeight,
    dotCount,
    gridSize
  }
}

export const getBorderCoordinates = (
  cellSize: number,
  lineOffset: number,
  gridSize: number = 9
) => {
  const {totalWidth, totalHeight} = calculateGridDimensions(cellSize, lineOffset, gridSize)

  return {
    top: lineOffset,
    bottom: totalHeight - lineOffset,
    left: lineOffset,
    right: totalWidth - lineOffset
  }
}

export const createGridPoints = (
  cellSize: number,
  lineOffset: number,
  gridSize: number = 9
): ICoordinate[] => {
  const points: ICoordinate[] = []
  const dotCount = gridSize + 1

  for (let row = 0; row < dotCount; row++) {
    for (let col = 0; col < dotCount; col++) {
      points.push({
        x: col * cellSize + lineOffset,
        y: row * cellSize + lineOffset
      })
    }
  }

  return points
}
