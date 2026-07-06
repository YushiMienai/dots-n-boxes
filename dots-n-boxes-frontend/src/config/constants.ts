import {DetectionMethod, EPlayerColor} from '@types'

export const GAME_CONSTANTS = {
  CANVAS_WIDTH: 330,
  CANVAS_HEIGHT: 330,
  GRID_SIZE: 9, // 9x9 клеток
  DOT_COUNT: 10, // 10 точек в ряду
  CELL_SIZE: 36,
  LINE_OFFSET: 2,

  // Размеры области захвата клика
  CLICK_TOLERANCE: {
    HORIZONTAL: {
      VERTICAL_TOLERANCE: 4, // ±4px по вертикали для горизонтальных линий
      HORIZONTAL_PADDING: 2  // Отступ по горизонтали
    },
    VERTICAL: {
      HORIZONTAL_TOLERANCE: 4, // ±4px по горизонтали для вертикальных линий
      VERTICAL_PADDING: 2      // Отступ по вертикали
    },
    MAX_AREA: {
      HORIZONTAL_VERTICAL_TOLERANCE: 8, // ±8px для горизонтальных линий
      VERTICAL_HORIZONTAL_TOLERANCE: 8, // ±8px для вертикальных линий
      LINE_EXTENSION: 4 // Расширение вдоль линии
    },
    PRECISE_TOLERANCE: 8 // Допуск для точного метода
  }
} as const

// Цвета игры
export const COLOR_PALETTE = {
  // Цвета игроков
  PLAYERS: {
    PLAYER1: EPlayerColor.SKY_BLUE,
    PLAYER2: EPlayerColor.PLUM,
    PLAYER3: EPlayerColor.BURLY_WOOD,
    PLAYER4: EPlayerColor.LIGHT_SEA_GREEN
  },

  // Цвета линий
  LINES: {
    DEFAULT: '#E8E8E8',    // Светлый серый для невыбранных линий
    SELECTED: '#7A8B8B',   // Приглушенный серый для выбранных линий
    HOVER: '#A8BABA'       // Цвет при наведении
  },

  // Фоновые цвета
  BACKGROUND: {
    CANVAS: '#FFFFFF',     // Белый фон канваса
    APP: '#FAFAFA',        // Светлый фон приложения
    PANEL: '#FFFFFF'       // Белый фон панелей
  },

  // Текст
  TEXT: {
    PRIMARY: '#2C3E50',    // Темно-синий для основного текста
    SECONDARY: '#7F8C8D',  // Серый для второстепенного текста
    ACCENT: '#3498DB'      // Синий для акцентов
  },

  // Кнопки
  BUTTONS: {
    PRIMARY: '#3498DB',
    PRIMARY_HOVER: '#2980B9',
    SECONDARY: '#95A5A6',
    SECONDARY_HOVER: '#7F8C8D'
  }
} as const

// Настройки отрисовки
export const RENDER_SETTINGS = {
  LINE_WIDTH: {
    DEFAULT: 2,
    SELECTED: 2.5,
    HOVER: 2.2
  },
  CELL_FILL_OPACITY: 0.8,
  ANIMATION_DURATION: 300
} as const

// Настройки обнаружения кликов
export const DETECTION_SETTINGS = {
  DEFAULT_METHOD: DetectionMethod.MAX_AREA as const,
  METHODS: {
    [DetectionMethod.MAX_AREA]: 'Maximum Area (±8px)',
    [DetectionMethod.EXTENDED]: 'Extended Area (±4px)',
    [DetectionMethod.PRECISE]: 'Precise (±8px tolerance)'
  }
} as const

// Адаптивные настройки
export const RESPONSIVE_SETTINGS = {
  BREAKPOINTS: {
    MOBILE: 768,
    TABLET: 1024,
    DESKTOP: 1200
  },
  CANVAS: {
    MOBILE: {
      MAX_WIDTH: '95vw',
      MAX_HEIGHT: '95vw', // Квадратный канвас
      MARGIN: 10 // Отступ от краев
    },
    DESKTOP: {
      WIDTH: 330,
      HEIGHT: 330
    }
  },
  GAME: {
    MOBILE_CELL_SIZE: 30, // Уменьшаем для лучшего fit
    DESKTOP_CELL_SIZE: 36,
    MOBILE_LINE_OFFSET: 7, // Увеличиваем отступ для мобильных
    DESKTOP_LINE_OFFSET: 2
  }
} as const

export const DEFAULT_COLORS = [
  EPlayerColor.SKY_BLUE,
  EPlayerColor.LIGHT_PINK,
  EPlayerColor.PALE_GREEN,
  EPlayerColor.PLUM,
  EPlayerColor.GOLD,
  EPlayerColor.LIGHT_SALMON,
  EPlayerColor.LIGHT_SEA_GREEN,
  EPlayerColor.BURLY_WOOD
]
