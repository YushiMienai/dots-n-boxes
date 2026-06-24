import { Server } from 'socket.io'
import { FastifyInstance } from 'fastify'
import {FRONTEND_URL} from '@constants'

export function setupSocket(fastify: FastifyInstance) {
  const io = new Server(fastify.server, {
    cors: {
      origin: FRONTEND_URL,
      credentials: true
    }
  })

  io.on('connection', (socket) => {
    console.log('Player connected:', socket.id)

    socket.on('join-room', (roomId: string, playerName: string) => {
      socket.join(`room:${roomId}`)
      socket.to(`room:${roomId}`).emit('player-joined', {
        id: socket.id,
        name: playerName
      })
      console.log(`${playerName} joined room ${roomId}`)
    })

    socket.on('leave-room', (roomId: string) => {
      socket.leave(`room:${roomId}`)
      socket.to(`room:${roomId}`).emit('player-left', socket.id)
    })

    socket.on('disconnect', () => {
      console.log('Player disconnected:', socket.id)
    })
  })

  return io
}
