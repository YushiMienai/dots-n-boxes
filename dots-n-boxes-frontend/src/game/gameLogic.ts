import {DetectionMethod, IGameState} from '@types'
import {
  checkForCompletedCells,
  createCells,
  createHorizontalLines,
  createVerticalLines,
  findClickedLine,
  findClickedLineWithTolerance
} from '@utils'
import {COLOR_PALETTE, DETECTION_SETTINGS} from '@config'

export const createInitialGameState = (isMobile: boolean = false): IGameState => {
  const horizontalLines = createHorizontalLines(isMobile)
  const verticalLines = createVerticalLines(isMobile)

  return {
    players: [
      {id: 1, color: COLOR_PALETTE.PLAYERS.PLAYER1, score: 0},
      {id: 2, color: COLOR_PALETTE.PLAYERS.PLAYER2, score: 0}
    ],
    activePlayerIndex: 0,
    cells: createCells(horizontalLines, verticalLines),
    horizontalLines,
    verticalLines
  }
}

export const handleCanvasClick = (
  gameState: IGameState,
  x: number,
  y: number,
  detectionMethod: DetectionMethod = DETECTION_SETTINGS.DEFAULT_METHOD
): IGameState => {
  const allLines = [...gameState.horizontalLines, ...gameState.verticalLines]
  let clickedLine: ReturnType<typeof findClickedLine>

  console.log('handleCanvasClick - gameLogic')

  switch (detectionMethod) {
    case 'precise':
      clickedLine = findClickedLineWithTolerance(x, y, allLines)
      break
    case 'extended':
    case 'max-area':
    default:
      clickedLine = findClickedLine(x, y, allLines)
      break
  }

  if (!clickedLine || clickedLine.isSelected) {
    return gameState
  }

  // Обновляем линию
  clickedLine.isSelected = true

  // Проверяем завершенные клетки
  const cellCompleted = checkForCompletedCells(
    gameState.cells,
    gameState.players,
    gameState.activePlayerIndex
  )

  // Обновляем активного игрока, если клетка не завершена
  const newActivePlayerIndex = cellCompleted
    ? gameState.activePlayerIndex
    : (gameState.activePlayerIndex + 1) % gameState.players.length

  return {
    ...gameState,
    activePlayerIndex: newActivePlayerIndex
  }
}

export const resetGame = (gameState: IGameState, isMobile: boolean = false): IGameState => {
  const newGameState = createInitialGameState(isMobile)

  // Сохраняем игроков (если нужно сохранить историю)
  return {
    ...newGameState,
    players: gameState.players.map(player => ({...player, score: 0}))
  }
}
