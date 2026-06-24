import {useMemo} from 'react'

interface ICanvasStyles {
  width: string
  height: string
  maxWidth?: string
  maxHeight?: string
  touchAction?: 'none'
}

export const useCanvasStyles = (isMobile: boolean): ICanvasStyles => {
  return useMemo(() => isMobile ? {
    width: '95vw',
    height: '95vw',
    maxWidth: '400px',
    maxHeight: '400px',
    touchAction: 'none' as const
  } : {
    width: '330px',
    height: '330px'
  }, [isMobile])
}