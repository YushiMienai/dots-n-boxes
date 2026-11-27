import {useMemo} from 'react'
import {Stage, Layer, Line, Rect} from 'react-konva'
import {IGameState, ILine, IPlayer} from '@types'
import {BOARD_SIZE, CANVAS_PADDING, CELL_SIZE, EMPTY_CELL, FREE_LINE} from '@config'
import {getPlayerColor} from '@utils'

interface GameCanvasProps {
  gameState: IGameState
  currentPlayer: IPlayer
  onLineClick: (lineId: string) => void
  isMobile: boolean
}

export const GameCanvas = ({gameState, onLineClick}: GameCanvasProps) => {
  const boardSize = gameState.boardSize ?? BOARD_SIZE
  const canvasSize = CELL_SIZE * boardSize

  const renderCells = useMemo(() => gameState.cells.map((cell, idx) => {
    const row = Math.floor(idx / boardSize)
    const col = idx % boardSize
    const ownerColor = cell.ownerId ? getPlayerColor(cell.ownerId, gameState.players) : null

    return (
      <Rect
        key={`cell-${idx}`}
        x={col * CELL_SIZE}
        y={row * CELL_SIZE}
        width={CELL_SIZE}
        height={CELL_SIZE}
        fill={ownerColor ?? EMPTY_CELL}
        opacity={ownerColor ? 0.3 : 1}
        stroke='#E2E8F0'
        strokeWidth={1}
        listening={false}
      />
    )
  }), [gameState.cells, gameState.players, boardSize])

  const renderLines = (lines: ILine[], isHorizontal: boolean) => lines.map(({lineId, ownerId}) => {
    const [, a, b] = lineId.split('-')
    const row = isHorizontal ? +a : +b
    const col = isHorizontal ? +b : +a

    const isDrawn = ownerId !== null
    const color = isDrawn ? getPlayerColor(ownerId, gameState.players) : FREE_LINE
    const strokeWidth = (isDrawn) ? 4 : 2

    const points = isHorizontal
      ? [col * CELL_SIZE, row * CELL_SIZE, (col + 1) * CELL_SIZE, row * CELL_SIZE]
      : [col * CELL_SIZE, row * CELL_SIZE, col * CELL_SIZE, (row + 1) * CELL_SIZE]

    return (
      <Line
        key={lineId}
        points={points}
        stroke={color}
        strokeWidth={strokeWidth}
        hitStrokeWidth={20}
        perfectDrawEnabled={false}
        onClick={!isDrawn ? () => onLineClick(lineId) : undefined}
        onMouseEnter={(e) => {
          if (isDrawn) return
          const stage = e.target.getStage()
          if (stage) stage.container().style.cursor = 'pointer'
        }}
        onMouseLeave={(e) => {
          const stage = e.target.getStage()
          if (stage) stage.container().style.cursor = 'default'
        }}
      />
    )
  })

  return (
    <Stage width={canvasSize + CANVAS_PADDING * 2} height={canvasSize + CANVAS_PADDING * 2}>
      <Layer x={CANVAS_PADDING} y={CANVAS_PADDING}>
        {renderCells}
        {renderLines(gameState.horizontalLines, true)}
        {renderLines(gameState.verticalLines, false)}
      </Layer>
    </Stage>
  )
}
