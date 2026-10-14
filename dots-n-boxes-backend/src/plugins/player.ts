import fp from 'fastify-plugin'
import {PlayerService} from '@services'

declare module 'fastify' {
  interface FastifyInstance {
    playerService: PlayerService   // ← объявление там, где создаётся
  }
}

export default fp(async (fastify) => {
  fastify.decorate('playerService', new PlayerService())
}, {name: 'player'})
