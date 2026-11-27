export const FRONTEND_URL = ['http://localhost:5173', 'http://192.168.1.98:5173']

export const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me'
export const JWT_SECRET_BYTES = new TextEncoder().encode(process.env.JWT_SECRET)

/** Дефолтный размер поля (10×10), если комната не задала иное. */
export const BOARD_SIZE = 10

/** Допустимые размеры поля для комнаты. */
export const ALLOWED_BOARD_SIZES = [5, 10] as const

export type BoardSize = (typeof ALLOWED_BOARD_SIZES)[number]
