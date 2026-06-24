import { useRef, useEffect } from 'react'
import { Stage, Layer, Line } from 'react-konva'
import Konva from 'konva'
import {IGameState, IPlayer} from '@types'

interface IGameCanvasProps {
  gameState: IGameState
  currentPlayer: IPlayer
  onLineClick: (lineId: string) => void
  isMobile: boolean
}

// Размеры
const CELL_SIZE = 40
const BOARD_SIZE = 10
const CANVAS_SIZE = CELL_SIZE * BOARD_SIZE
const LINE_WIDTH = 2

export const GameCanvas = () => {
  const stageRef = useRef<Konva.Stage>(null)

  const onLineClick = (lineId) => console.log(lineId)

  // Генерация горизонтальных линий
  const renderHorizontalLines = () => {
    const lines = []
    for (let row = 0; row <= BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        const lineId = `h-${row}-${col}`
        lines.push(
          <Line
            key={lineId}
            id={lineId}
            points={[col * CELL_SIZE, row * CELL_SIZE, (col + 1) * CELL_SIZE, row * CELL_SIZE]}
            stroke="#94A3B8"
            strokeWidth={LINE_WIDTH}
            hitStrokeWidth={20} // увеличенная зона клика
            perfectDrawEnabled={false}
            onClick={() => onLineClick(lineId)}
            onTap={() => onLineClick(lineId)} // для touch устройств
            onMouseEnter={(e) => {
              const stage = e.target.getStage()
              if (stage) stage.container().style.cursor = 'pointer'
            }}
            onMouseLeave={(e) => {
              const stage = e.target.getStage()
              if (stage) stage.container().style.cursor = 'default'
            }}
          />
        )
      }
    }
    return lines
  }

  // Генерация вертикальных линий
  const renderVerticalLines = () => {
    const lines = []
    for (let col = 0; col <= BOARD_SIZE; col++) {
      for (let row = 0; row < BOARD_SIZE; row++) {
        const lineId = `v-${col}-${row}`
        lines.push(
          <Line
            key={lineId}
            id={lineId}
            points={[col * CELL_SIZE, row * CELL_SIZE, col * CELL_SIZE, (row + 1) * CELL_SIZE]}
            stroke="#94A3B8"
            strokeWidth={LINE_WIDTH}
            hitStrokeWidth={20}
            perfectDrawEnabled={false}
            onClick={() => onLineClick(lineId)}
            onTap={() => onLineClick(lineId)}
            onMouseEnter={(e) => {
              const stage = e.target.getStage()
              if (stage) stage.container().style.cursor = 'pointer'
            }}
            onMouseLeave={(e) => {
              const stage = e.target.getStage()
              if (stage) stage.container().style.cursor = 'default'
            }}
          />
        )
      }
    }
    return lines
  }

  return (
    <Stage
      width={CANVAS_SIZE}
      height={CANVAS_SIZE}
      ref={stageRef}
    >
      <Layer>
        {/* Фон клеток */}
        {Array.from({ length: BOARD_SIZE * BOARD_SIZE }).map((_, i) => {
          const row = Math.floor(i / BOARD_SIZE)
          const col = i % BOARD_SIZE
          return (
            <Line
              key={`bg-${i}`}
              points={[
                col * CELL_SIZE + 2, row * CELL_SIZE + 2,
                (col + 1) * CELL_SIZE - 2, row * CELL_SIZE + 2,
                (col + 1) * CELL_SIZE - 2, (row + 1) * CELL_SIZE - 2,
                col * CELL_SIZE + 2, (row + 1) * CELL_SIZE - 2,
                col * CELL_SIZE + 2, row * CELL_SIZE + 2
              ]}
              closed={true}
              fill="#F8FAFC"
              stroke="#E2E8F0"
              strokeWidth={1}
              listening={false} // фон не реагирует на клики
            />
          )
        })}

        {/* Линии сетки */}
        {/*renderHorizontalLines()*/}
        {/*renderVerticalLines()*/}
      </Layer>
    </Stage>
  )
}
