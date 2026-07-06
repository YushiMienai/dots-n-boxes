import {useEffect, RefObject} from 'react'

interface ICanvasEventsProps {
  canvasRef: RefObject<HTMLCanvasElement>
  onMouseClick: (event: MouseEvent) => void
  onTouchStart: (event: TouchEvent) => void
}

export const useCanvasEvents = ({
  canvasRef,
  onMouseClick,
  onTouchStart
}: ICanvasEventsProps): void => {
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    canvas.addEventListener('click', onMouseClick)
    canvas.addEventListener('touchstart', onTouchStart, {passive: false})

    return () => {
      canvas.removeEventListener('click', onMouseClick)
      canvas.removeEventListener('touchstart', onTouchStart)
    }
  }, [canvasRef, onMouseClick, onTouchStart])
}
