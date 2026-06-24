import Fastify, {FastifyInstance} from 'fastify'
import cors from '@fastify/cors'
import fastifyJwt from '@fastify/jwt'
import fastifyCookie from '@fastify/cookie'
import {AppDataSource, initializeDatabase} from '@database'
import {config} from 'config'
import {authRoutes, roomRoutes} from '@routes'
import {PlayerEntity, RefreshTokenEntity} from '@entities'
import {AuthService, JwtService, PlayerService} from '@services'
import {TokenService} from 'services/auth/tokenService'
import {playerRoutes} from 'routes/playerRoutes'
import {FRONTEND_URL} from '@constants'
import {setupSocket} from 'socket'

const fastify = Fastify({
  logger: true,
  trustProxy: true
})

export const createApp = async () => {
  await fastify.register(fastifyJwt, {
    secret: process.env.JWT_SECRET!,
    sign: {
      expiresIn: process.env.JWT_EXPIRES_IN || '15m'
    }
  })

  await fastify.register(fastifyCookie, {secret: process.env.COOKIE_SECRET})

  await fastify.register(cors, {
    origin: FRONTEND_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  })

  const jwtService = new JwtService(fastify.jwt)
  fastify.decorate('jwtService', jwtService)

  const tokenRepo = AppDataSource.getRepository(RefreshTokenEntity)
  const tokenService = new TokenService(jwtService, tokenRepo)
  const playerRepo = AppDataSource.getRepository(PlayerEntity)
  const authService = new AuthService(playerRepo)
  const playerService = new PlayerService()
  fastify.decorate('authService', authService)
  fastify.decorate('tokenService', tokenService)
  fastify.decorate('playerService', playerService)

  await fastify.register(authRoutes)
  await fastify.register(roomRoutes)
  await fastify.register(playerRoutes)

  fastify.get('/health', async () => {
    return {status: 'ok', timestamp: new Date().toISOString()}
  })

  const io = setupSocket(fastify as FastifyInstance)
  fastify.decorate('io', io)

  return fastify
}

export const startServer = async () => {
  try {
    await initializeDatabase()
    const app = await createApp()

    await app.listen({
      port: config.server.port,
      host: config.server.host
    })

    console.log(`Сервер запущен по адресу http://localhost:${config.server.port}`)
  } catch (error) {
    console.error('Ошибка запуска сервера:', error)
    process.exit(1)
  }
}