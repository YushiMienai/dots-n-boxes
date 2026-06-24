import {ILine, ICoordinate} from '@types'

const createCoordinate = (x: number, y: number): ICoordinate => ({x, y})

const createHorizontalLine = (x: number, y: number, isMobile: boolean = false): ILine => {
  const verticalTolerance = isMobile ? 10 : 4
  const horizontalPadding = isMobile ? 1 : 2

  return {
    start: createCoordinate(x, y),
    end: createCoordinate(x + 36, y),
    clickableStart: createCoordinate(x + horizontalPadding, y - verticalTolerance),
    clickableEnd: createCoordinate(x + 36 - horizontalPadding, y + verticalTolerance),
    isSelected: y === 2 || y === 326, // Граничные линии
    isHorizontal: true
  }
}

const createVerticalLine = (x: number, y: number, isMobile: boolean = false): ILine => {
  const horizontalTolerance = isMobile ? 10 : 4
  const verticalPadding = isMobile ? 1 : 2

  return {
    start: createCoordinate(x, y),
    end: createCoordinate(x, y + 36),
    clickableStart: createCoordinate(x - horizontalTolerance, y + verticalPadding),
    clickableEnd: createCoordinate(x + horizontalTolerance, y + 36 - verticalPadding),
    isSelected: x === 2 || x === 326, // Граничные линии
    isHorizontal: false
  }
}

export const createHorizontalLines = (isMobile: boolean = false): ILine[] => {
  const lines: ILine[] = []
  for (let row = 0; row < 10; row++) {
    for (let col = 0; col < 9; col++) {
      lines.push(createHorizontalLine(col * 36 + 2, row * 36 + 2, isMobile))
    }
  }
  return lines
}

export const createVerticalLines = (isMobile: boolean = false): ILine[] => {
  const lines: ILine[] = []
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 10; col++) {
      lines.push(createVerticalLine(col * 36 + 2, row * 36 + 2, isMobile))
    }
  }
  return lines
}

export const findClickedLine = (x: number, y: number, lines: ILine[]): ILine | null => {
  return lines.find(line =>
    x >= line.clickableStart.x && x <= line.clickableEnd.x &&
    y >= line.clickableStart.y && y <= line.clickableEnd.y
  ) || null
}

export const findClickedLineWithTolerance = (x: number, y: number, lines: ILine[], tolerance: number = 8): ILine | null => {
  let closestLine: ILine | null = null
  let minDistance = tolerance

  for (const line of lines) {
    if (line.isSelected) continue

    let distance: number
    if (line.isHorizontal) {
      distance = Math.abs(y - line.start.y)
      const withinXBounds = x >= line.start.x - tolerance && x <= line.end.x + tolerance
      if (withinXBounds && distance < minDistance) {
        minDistance = distance
        closestLine = line
      }
    } else {
      distance = Math.abs(x - line.start.x)
      const withinYBounds = y >= line.start.y - tolerance && y <= line.end.y + tolerance
      if (withinYBounds && distance < minDistance) {
        minDistance = distance
        closestLine = line
      }
    }
  }

  return closestLine
}
