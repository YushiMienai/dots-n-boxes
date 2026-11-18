import {Server} from 'socket.io'
import {FastifyInstance} from 'fastify'
import {FRONTEND_URL} from '@constants'
import {IPlayer} from '@types'

/**
 * Socket.IO: подписка на комнату и рассылка game-state.
 *
 * Аутентификация — io.use (JWT из handshake.auth.token).
 * socket.data.playerId/playerName — из токена, не из клиента.
 *
 * Ответственность:
 * - join-room: socket.join + gameManager.handlePlayerJoin + io.emit('game-state')
 * - leave-room: gameManager.handlePlayerLeave + io.emit('game-state')
 * - disconnect: gameManager.handleDisconnect + io.emit('game-state')
 * - move: gameManager.handleMove + io.emit('move-made') (позже)
 *
 * Не проверяет пароль — это HTTP (playerRoutes). Не пишет в БД —
 * это PlayerService/RoomService.
 *
 * Событие game-state (полное состояние) — для входа/выхода/F5.
 * Событие move-made (дельта) — для ходов (10×10 = ~75 КБ
 * полного состояния, дельта ~500 байт).
 */
export function setupSocket(fastify: FastifyInstance) {
  const io = new Server(fastify.server, {
    cors: {
      origin: FRONTEND_URL,
      credentials: true
    }
  })
  const gameManager = fastify.gameManager

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token
      if (!token) return next(new Error('Authentication error'))

      // Верифицируем токен через ваш JwtService
      const payload = await fastify.jwtService.verifyAccessToken(token)

      // Сохраняем данные игрока прямо в сокет
      socket.data.playerId = payload.id
      socket.data.playerName = payload.name

      next()
    } catch (err) {
      next(new Error(`Authentication error: ${err}`))
    }
  })

  io.on('connection', (socket) => {
    console.log('Player connected:', socket.id)

    socket.on('join-room', async ({roomId}, callback) => {
      try {
        const playerId = socket.data.playerId
        const playerName = socket.data.playerName
        const player: IPlayer = {id: playerId, name: playerName, isOnline: true, gameRoomId: roomId}

        socket.join(`room:${roomId}`)
        socket.data.roomId = roomId

        const state = await gameManager.handlePlayerJoin(roomId, player, socket.id)

        // 3. Рассылаем ПОЛНОЕ состояние всем (включая себя)
        io.to(`room:${roomId}`).emit('game-state', state)

        callback?.({success: true})
      } catch (err) {
        callback?.({success: false, error: (err as Error).message})
      }
    })

    socket.on('leave-room', async (callback) => {
      try {
        const roomId = socket.data.roomId
        if (!roomId) return callback?.({success: true})

        // 1. Убираем из Socket.IO room
        socket.leave(`room:${roomId}`)

        // 2. Убираем из GameManager (передаём socketId, roomId не нужен — мы это обсуждали)
        const state = await gameManager.handleLeaveRoom(socket.id)
        socket.data.roomId = null

        // 3. Рассылаем новое состояние остальным
        if (state) {
          io.to(`room:${roomId}`).emit('game-state', state)
        }

        callback?.({success: true})
      } catch (err) {
        callback?.({success: false, error: (err as Error).message})
      }
    })

    socket.on('disconnect', async () => {
      const state = await gameManager.handleDisconnect(socket.id)
      if (state) {
        io.to(`room:${state.roomId}`).emit('game-state', state)
      }
    })

    socket.on('move', async ({roomId, lineId}, callback) => {
      try {
        const state = await gameManager.handleMove(roomId, lineId, socket.id)

        // Отправляем ПОЛНОЕ состояние всем в комнате
        io.to(`room:${roomId}`).emit('game-state', state)

        callback?.({success: true})
      } catch (err) {
        callback?.({success: false, error: (err as Error).message})
      }
    })
  })

  return io
}
