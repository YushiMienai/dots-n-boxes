import Fastify, {FastifyError, FastifyInstance} from 'fastify'
import cors from '@fastify/cors'
import fastifyCookie from '@fastify/cookie'
import {initializeDatabase} from '@database'
import {authPlugin, gamePlugin, jwtPlugin, playerPlugin, routesPlugin, socketPlugin, tokenPlugin} from '@plugins'
import {FRONTEND_URL} from '@constants'
import {config} from './config'
import {AppError} from '@errors'

export const createApp = async () => {
  const fastify = Fastify({logger: true, trustProxy: true})

  await fastify.register(fastifyCookie, {secret: process.env.COOKIE_SECRET})

  await fastify.register(cors, {
    origin: (origin, callback) => {
      if (!origin || FRONTEND_URL.includes(origin)) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'), false)
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  })

  await fastify.register(jwtPlugin)
  await fastify.register(tokenPlugin)
  await fastify.register(authPlugin)
  await fastify.register(playerPlugin)
  await fastify.register(gamePlugin)
  await fastify.register(socketPlugin)
  await fastify.register(routesPlugin)

  // Приводим доменные ошибки (AppError) к единому формату ответа.
  // Без этого статус 409 из RoomFullError может уйти в дефолтном формате.
  fastify.setErrorHandler((error, _request, reply) => {
    const err = error as FastifyError
    if (err instanceof AppError) {
      return reply.status(err.statusCode).send({
        statusCode: err.statusCode,
        code: err.code,
        message: err.message,
      })
    }
    // Дефолтное поведение Fastify для прочих ошибок
    return reply.status(err.statusCode ?? 500).send({
      statusCode: err.statusCode ?? 500,
      error: err.name,
      message: err.message,
    })
  })

  return fastify
}

export const startServer = async (): Promise<FastifyInstance> => {
  await initializeDatabase()
  const app = await createApp()

  await app.listen({
    port: config.server.port,
    host: config.server.host
  })

  console.log(`Сервер запущен по адресу http://localhost:${config.server.port}`)

  return app
}
