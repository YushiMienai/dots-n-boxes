import {useState, useEffect} from 'react'
import {RESPONSIVE_SETTINGS} from '@config'

export interface IDeviceInfo {
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  orientation: 'portrait' | 'landscape'
  screenWidth: number
  screenHeight: number
}

export const useDevice = (): IDeviceInfo => {
  const [deviceInfo, setDeviceInfo] = useState<IDeviceInfo>({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    orientation: 'portrait',
    screenWidth: window.innerWidth,
    screenHeight: window.innerHeight
  })

  useEffect(() => {
    const updateDeviceInfo = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      const isPortrait = height > width

      setDeviceInfo({
        isMobile: width < RESPONSIVE_SETTINGS.BREAKPOINTS.MOBILE,
        isTablet: width >= RESPONSIVE_SETTINGS.BREAKPOINTS.MOBILE &&
          width < RESPONSIVE_SETTINGS.BREAKPOINTS.TABLET,
        isDesktop: width >= RESPONSIVE_SETTINGS.BREAKPOINTS.TABLET,
        orientation: isPortrait ? 'portrait' : 'landscape',
        screenWidth: width,
        screenHeight: height
      })
    }

    // Первоначальное определение
    updateDeviceInfo()

    // Слушаем изменения размера окна и ориентации
    window.addEventListener('resize', updateDeviceInfo)
    window.addEventListener('orientationchange', updateDeviceInfo)

    return () => {
      window.removeEventListener('resize', updateDeviceInfo)
      window.removeEventListener('orientationchange', updateDeviceInfo)
    }
  }, [])

  return deviceInfo
}
