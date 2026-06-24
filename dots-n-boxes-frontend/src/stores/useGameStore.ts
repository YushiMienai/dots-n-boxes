import {create} from 'zustand'
import {DetectionMethod, IGameState} from '@types'
import {createInitialGameState, handleCanvasClick, resetGame} from '@game'

interface UseGameStore {
  gameState: IGameState
  detectionMethod: DetectionMethod
  isProcessing: boolean
  setDetectionMethod: (method: DetectionMethod) => void
  handleCanvasInteraction: (clientX: number, clientY: number, canvas: HTMLCanvasElement, isMobile: boolean) => void
  resetGame: () => void
}

export const useGameStore = create<UseGameStore>((set, get) => ({
  gameState: createInitialGameState(),
  detectionMethod: DetectionMethod.MAX_AREA,
  isProcessing: false,

  setDetectionMethod: (method) => set({detectionMethod: method}),

  handleCanvasInteraction: (clientX, clientY, canvas, isMobile) => {
    const {detectionMethod, isProcessing, gameState} = get()

    if (isProcessing) return

    set({isProcessing: true})

    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height

    const x = (clientX - rect.left) * scaleX
    const y = (clientY - rect.top) * scaleY

    const newGameState = handleCanvasClick(gameState, x, y, detectionMethod)

    set({
      gameState: newGameState,
      isProcessing: false
    })
  },

  resetGame: () => {
    const {gameState} = get()
    set({
      gameState: resetGame(gameState),
      isProcessing: false
    })
  }
}))