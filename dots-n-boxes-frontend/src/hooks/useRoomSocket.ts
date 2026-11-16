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

    socket.off('game-state')
    socket.on('game-state', handleGameState)
    socket.off('connect')
    socket.on('connect', handleConnect)

    // 2. join-room (только roomId — остальное из JWT)
    socket.emit('join-room', {roomId}, (response: {success: boolean, error?: string}) => {
      if (!response.success) {
        toast.error(response.error || 'Не удалось войти в комнату')
        navigate('/rooms')
      }
    })

    // 3. cleanup
    return () => {
      socket.off('game-state', handleGameState)
      socket.off('connect', handleConnect)
      socket.emit('leave-room')
    }
  }, [roomId, navigate])

  return {gameState, isLoading, roomId}
}
