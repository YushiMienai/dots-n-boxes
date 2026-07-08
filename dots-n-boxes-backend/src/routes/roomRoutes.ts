import {FastifyInstance} from 'fastify'
import {RoomService} from '@services'
import {verifyJWT} from '@hooks'
import {
  createRoomSchema,
  RoomParamsSchema,
  RoomResponseSchema,
  RoomSearchSchema,
  RoomResponse,
  RoomSearch,
  CreateRoomBody
} from '@schemas'
import {validate} from '@middleware'
import {RoomEntity} from '@entities'

export async function roomRoutes(fastify: FastifyInstance) {
  const roomService = new RoomService()
  fastify.addHook('preHandler', verifyJWT)

  fastify.get<{Querystring: RoomSearch, Reply: RoomResponse[]}>('/rooms',
    {preHandler: validate(RoomSearchSchema, 'query')},
    async (request): Promise<RoomResponse[]> => {
      const rooms: RoomEntity[] = await roomService.getList(request.query)
      return rooms.map(room => RoomResponseSchema.parse(room))
    })

  fastify.get<{Params: {id: string}}>('/rooms/:id',
    {preHandler: validate(RoomParamsSchema, 'params')},
    async (request): Promise<RoomResponse> => {
      const room: RoomEntity = await roomService.getRoom(request.params.id)
      return RoomResponseSchema.parse(room)
    })

  fastify.post<{Body: CreateRoomBody, Reply: RoomResponse}>(
    '/rooms',
    {preHandler: validate(createRoomSchema, 'body')},
    async (request): Promise<RoomResponse> => {
      const roomData = request.body
      const room = await roomService.createRoom(roomData)
      return RoomResponseSchema.parse(room)
    }
  )
}
