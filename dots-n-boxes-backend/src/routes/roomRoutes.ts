import {FastifyInstance, RouteShorthandOptions} from 'fastify'
import {RoomService} from '@services'
import {RoomListRequestDTO, RoomRequestDTO, RoomResponseDTO} from '@dto'
import {verifyJWT} from '@hooks'
import {createRoomSchema, getRoomByIdSchema, getRoomsListSchema} from './roomSchemas'

export async function roomRoutes(fastify: FastifyInstance) {
  const roomService = new RoomService()
  fastify.addHook('preHandler', verifyJWT)

  fastify.get<{Querystring: RoomListRequestDTO, Reply: RoomResponseDTO[]}>('/rooms',
    {schema: getRoomsListSchema} as RouteShorthandOptions,
    async (request): Promise<RoomResponseDTO[]> => {
      return roomService.getList(request.params as RoomListRequestDTO)
    })

  fastify.get<{Params: {id: string}}>('/rooms/:id',
    {schema: getRoomByIdSchema},
    async (request) => {
      return roomService.getRoom(request.params.id)
    })

  fastify.post('/rooms', {schema: createRoomSchema},
    async (request) => {
      const roomData = request.body as RoomRequestDTO
      return await roomService.createRoom(roomData)
    })
}