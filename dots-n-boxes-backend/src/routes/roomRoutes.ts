import {FastifyInstance} from 'fastify'
import {RoomService} from '@services'
import {verifyJWT} from '@hooks'
import {
  roomResponseSchema,
  roomSchemas,
  RoomResponse,
  RoomSearch,
  RoomRequest
} from '@schemas'
import {validate} from '@middleware'
import {RoomEntity} from '@entities'

export async function roomRoutes(fastify: FastifyInstance) {
  const roomService = new RoomService()
  fastify.addHook('preHandler', verifyJWT)

  fastify.get<{Querystring: RoomSearch, Reply: RoomResponse[]}>('/rooms',
    {preHandler: validate(roomSchemas.getList.querystring, 'query')},
    async (request): Promise<RoomResponse[]> => {
      const rooms: RoomEntity[] = await roomService.getList(request.query)
      return rooms.map(room => roomResponseSchema.parse(room))
    })

  fastify.get<{Params: {id: string}}>('/rooms/:id',
    {preHandler: validate(roomSchemas.getOne.params, 'params')},
    async (request): Promise<RoomResponse> => {
      const room: RoomEntity = await roomService.getRoom(request.params.id)
      return roomResponseSchema.parse(room)
    })

  fastify.post<{Body: RoomRequest, Reply: RoomResponse}>(
    '/rooms',
    {preHandler: validate(roomSchemas.create.body, 'body')},
    async (request): Promise<RoomResponse> => {
      const roomData = request.body
      const room = await roomService.createRoom(roomData)
      return roomResponseSchema.parse(room)
    }
  )
}
