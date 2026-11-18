import {useEffect, useState} from 'react'
import {useParams, useNavigate} from 'react-router-dom'
import {toast} from 'react-hot-toast'
import {socket} from '@utils'
import {IGameState} from '@types'

export const useRoomSocket = () => {
  const {id: roomId} = useParams<{id: string}>()
  const navigate = useNavigate()
  const [gameState, setGameState] = useState<IGameState | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!roomId) return

    // 1. Подписка на game-state
    const handleGameState = (state: IGameState) => {
      console.log(state)
      setGameState(state)
      setIsLoading(false)
    }

    const handleConnect = () => {
      // При каждом (пере)подключении — join-room
      socket.emit('join-room', {roomId}, (response: {success: boolean, error?: string}) => {
        if (!response.success) {
          toast.error(response.error || 'Не удалось войти в комнату')
          navigate('/rooms')
        }
      })
    }

    socket.on('game-state', handleGameState)
    socket.on('connect', handleConnect)

    if (socket.connected) handleConnect()
    else socket.connect()

    // 3. cleanup
    return () => {
      socket.off('game-state', handleGameState)
      socket.off('connect', handleConnect)
      socket.emit('leave-room')
    }
  }, [roomId, navigate])

  return {gameState, setGameState, isLoading, roomId}
}
