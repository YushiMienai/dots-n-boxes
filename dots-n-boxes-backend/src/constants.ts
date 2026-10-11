export const FRONTEND_URL = 'http://localhost:5173'

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET is not set in .env')
}

export const JWT_SECRET_BYTES = new TextEncoder().encode(process.env.JWT_SECRET)
