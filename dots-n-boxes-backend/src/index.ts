import Fastify from 'fastify'
import fastifyWebsocket from '@fastify/websocket'
import fastifyCors from '@fastify/cors'
import {AppDataSource} from '@database'
import {GameManager} from '@managers'
import {IWSMessage} from '@types'
import {FRONTEND_URL} from '@constants'

await AppDataSource.initialize()
console.log('✅ Database connected')

const fastify = Fastify({logger: true})
const gameManager = new GameManager()

await fastify.register(fastifyCors, {
  origin: FRONTEND_URL,
  credentials: true
})

await fastify.register(fastifyWebsocket)

/*fastify.get('/rooms', async () => {
  const rooms = await gameManager.getRooms()
  return {rooms}
})

fastify.post<{Body: {name: string; maxPlayers?: number; isPrivate?: boolean}}>('/rooms', {
  schema: {
    body: {
      type: 'object',
      required: ['name'],
      properties: {
        name: {type: 'string', minLength: 1, maxLength: 50},
        maxPlayers: {type: 'number', minimum: 2, maximum: 4, default: 2},
        isPrivate: {type: 'boolean', default: false}
      }
    }
  }
}, async (request) => {
  const {name, maxPlayers = 2, isPrivate = false} = request.body
  const room = await gameManager.createRoom(name, maxPlayers, isPrivate)
  return {room: room.toJSON()}
})*/

//fastify.register(import('./plugins/'))

const start = async () => {
  try {
    await fastify.listen({port: 3001, host: '0.0.0.0'})
    console.log('🚀 Server running on http://localhost:3001')
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()