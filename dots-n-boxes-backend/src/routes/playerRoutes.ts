import {FastifyInstance} from 'fastify'
import {Server} from 'socket.io'
import {PlayerService} from '@services'
import {verifyJWT} from '@hooks'
import {enterRoomSchema, leaveRoomSchema} from '../schemas/playerSchemas'

declare module 'fastify' {
  interface FastifyInstance {
    io: Server
  }
}

export async function playerRoutes(fastify: FastifyInstance) {
  const playerService = new PlayerService()
  fastify.addHook('preHandler', verifyJWT)

  fastify.get('/player/room', async (request) => {
    const player = request.player
    if (player) {
      return await playerService.getCurrentRoom(player.id)
    }
  })

  // Вход в комнату
  fastify.put<{Params: {id: string}}>('/player/room/:id', {schema: enterRoomSchema},
    async (request) => {
      const player = request.player
      const roomId = request.params.id

      if (player) {
        await playerService.enterRoom(player.id, roomId)
        fastify.io.to(`room:${roomId}`).emit('player-joined', {id: player.id, name: player.name})
        return {success: true, message: 'Entered room successfully'}
      } else {
        throw new Error('Player not found')
      }
    }
  )

  // Выход из комнаты
  fastify.delete('/player/room', {schema: leaveRoomSchema},
    async (request) => {
      const player = request.player

      if (player) {
        const currentRoomId = playerService.getCurrentRoom(player.id)
        await playerService.leaveRoom(player.id)
        fastify.io.to(`room:${currentRoomId}`).emit('player-left', {id: player.id, name: player.name})
        return {success: true, message: 'Left room successfully'}
      } else {
        throw new Error('Player not found')
      }
    }
  )
}