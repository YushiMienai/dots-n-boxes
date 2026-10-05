export const FRONTEND_URL = 'http://localhost:5173'

const jwtSecret = process.env.JWT_SECRET || 'default-secret'
export const JWT_SECRET_BYTES = new TextEncoder().encode(jwtSecret)