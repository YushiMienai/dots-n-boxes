import {FastifyInstance} from 'fastify'
import {GameManager} from '@managers'
import {IWSMessage} from '@types'

let gameManager: GameManager

export function setupWebsocketRoutes(app: FastifyInstance) {
  gameManager = new GameManager()
  app.decorate('gameManager', gameManager)

  app.get<{Params: {roomId: string}}>('/ws/:roomId', {websocket: true}, (connection, req) => {
    const {roomId} = req.params
    const url = new URL(req.url, `http://${req.headers.host}`)
    const playerName = url.searchParams.get('playerName') || 'Anonymous'
    const playerColor = url.searchParams.get('playerColor') || '#87CEEB'

    connection.socket.on('message', async (message) => {
      try {
        const data: IWSMessage = JSON.parse(message.toString())
        await gameManager.handleMessage(roomId, data, connection.socket)
      } catch (error) {
        connection.socket.send(JSON.stringify({
          type: 'ERROR',
          payload: {message: 'Invalid message format'}
        }))
      }
    })

    connection.socket.on('close', async () => {
      await gameManager.handleDisconnect(connection.socket)
    })

    gameManager.handlePlayerJoin(roomId, playerName, playerColor, connection.socket)
  })
}