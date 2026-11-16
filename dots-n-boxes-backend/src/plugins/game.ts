import fp from 'fastify-plugin'
import {GameManager, RoomService} from '@services'

declare module 'fastify' {
  interface FastifyInstance {
    gameManager: GameManager
  }
}

export default fp(async (fastify) => {
  const roomService = new RoomService()
  fastify.decorate('gameManager', new GameManager(roomService))
}, {name: 'game'})
