import fp from 'fastify-plugin'
import {authRoutes, playerRoutes, roomRoutes} from '@routes'

export default fp(async (fastify) => {
  await fastify.register(authRoutes)
  await fastify.register(roomRoutes)
  await fastify.register(playerRoutes)

  fastify.get('/health', async () => {
    return {status: 'ok', timestamp: new Date().toISOString()}
  })
}, {
  name: 'routes',
  dependencies: ['auth', 'player', 'token', 'jwt']
})
