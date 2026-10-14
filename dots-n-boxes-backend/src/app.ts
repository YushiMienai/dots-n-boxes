import Fastify, {FastifyInstance} from 'fastify'
import cors from '@fastify/cors'
import fastifyCookie from '@fastify/cookie'
import {initializeDatabase} from '@database'
import {authPlugin, jwtPlugin, playerPlugin, routesPlugin, socketPlugin, tokenPlugin} from '@plugins'
import {FRONTEND_URL} from '@constants'
import {config} from './config'

export const createApp = async () => {
  const fastify = Fastify({logger: true, trustProxy: true})

  await fastify.register(fastifyCookie, {secret: process.env.COOKIE_SECRET})

  await fastify.register(cors, {
    origin: FRONTEND_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  })

  await fastify.register(jwtPlugin)
  await fastify.register(tokenPlugin)
  await fastify.register(authPlugin)
  await fastify.register(playerPlugin)
  await fastify.register(socketPlugin)
  await fastify.register(routesPlugin)

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
