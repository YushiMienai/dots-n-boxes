import {useEffect, useState} from 'react'
import {io, Socket} from 'socket.io-client'
import {API_CONFIG} from '@config'
import {usePlayerStore, useRoomStore} from '@stores'

export const useRoomSocket = (roomId: string | null) => {
  const [socket, setSocket] = useState<Socket | null>(null)
  const addPlayer = useRoomStore(state => state.addPlayer)
  const removePlayer = useRoomStore(state => state.removePlayer)
  const {playerName} = usePlayerStore(state => state.name)

  useEffect(() => {
    if (!roomId) return

    const newSocket = io(API_CONFIG.baseURL, {
      transports: ['websocket']
    })

    setSocket(newSocket)

    newSocket.on('connect', () => {
      console.log('Connected to socket')
      newSocket.emit('join-room', roomId, playerName) // TODO: имя из стора
    })

    newSocket.on('player-joined', (player) => {
      console.log('Player joined:', player)
      addPlayer(player)
    })

    newSocket.on('player-left', (playerId) => {
      console.log('Player left:', playerId)
      removePlayer(playerId)
    })

    return () => {
      newSocket.emit('leave-room', roomId)
      newSocket.disconnect()
    }
  }, [roomId])

  return socket
}
