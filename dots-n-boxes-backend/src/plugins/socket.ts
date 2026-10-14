import {FastifyInstance} from 'fastify'
import fp from 'fastify-plugin'
import {Server} from 'socket.io'
import {setupSocket} from '../socket'

declare module 'fastify' {
  interface FastifyInstance {
    io: Server
  }
}

export default fp(async (fastify: FastifyInstance) => {
  const io = setupSocket(fastify)
  fastify.decorate('io', io)
}, {name: 'socket'})
