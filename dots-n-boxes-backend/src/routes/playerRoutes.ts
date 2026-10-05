import {FastifyInstance} from 'fastify'
import {Server} from 'socket.io'
import {PlayerService, RoomService} from '@services'
import {verifyJWT} from '@hooks'
import {playerSchema} from '@schemas'
import {validate} from '@middleware'
import {EAccessLevel} from '@types'

declare module 'fastify' {
  interface FastifyInstance {
    io: Server
  }
}

export async function playerRoutes(fastify: FastifyInstance) {
  const playerService = new PlayerService()
  const roomService = new RoomService()
  fastify.addHook('preHandler', verifyJWT)

  fastify.get('/player/room', async (request) => {
    const player = request.player
    if (player) {
      return await playerService.getCurrentRoom(player.id)
    }
  })

  // Вход в комнату
  fastify.put<{Params: {id: string}, Body: {password?: string}}>('/player/room/:id',
    {preHandler: validate(playerSchema.enter.params, 'params')},
    async (request) => {
      const player = request.player
      const {id: roomId} = request.params
      const {password} = request.body

      if (player) {
        const room = await roomService.getRoomForEntry(roomId)
        if (room.accessLevel === EAccessLevel.PASSWORD && room.password === password
          || room.accessLevel !== EAccessLevel.PASSWORD) {
          await playerService.enterRoom(player.id, roomId)
          fastify.io.to(`room:${roomId}`).emit('player-joined', {id: player.id, name: player.name})
          return {success: true, message: 'Entered room successfully'}
        } else {
          throw new Error('Forbidden to enter room')
        }

      } else {
        throw new Error('Player not found')
      }
    }
  )

  // Выход из комнаты
  fastify.delete('/player/room',
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
