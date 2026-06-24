import {useCallback, useRef} from 'react'
import {useGameStore} from '@stores'
import {useDevice} from './useDevice'

export const useGame = () => {
  const deviceInfo = useDevice()
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const {
    gameState,
    detectionMethod,
    setDetectionMethod,
    handleCanvasInteraction,
    resetGame
  } = useGameStore()

  // Получаем canvas из ref
  const getCanvas = useCallback(() => {
    return canvasRef.current
  }, [])

  const handleMouseClick = useCallback((event: MouseEvent) => {
    const canvas = getCanvas()
    if (!canvas) return
    handleCanvasInteraction(event.clientX, event.clientY, canvas, deviceInfo.isMobile)
  }, [handleCanvasInteraction, getCanvas, deviceInfo.isMobile])

  const handleTouchStart = useCallback((event: TouchEvent) => {
    event.preventDefault()
    const canvas = getCanvas()
    if (!canvas) return
    const touch = event.touches[0]
    handleCanvasInteraction(touch.clientX, touch.clientY, canvas, deviceInfo.isMobile)
  }, [handleCanvasInteraction, getCanvas, deviceInfo.isMobile])

  const handleReset = useCallback(() => {
    resetGame()
  }, [resetGame])

  return {
    gameState,
    detectionMethod,
    setDetectionMethod,
    canvasRef,
    handleMouseClick,
    handleTouchStart,
    handleReset,
    deviceInfo
  }
}