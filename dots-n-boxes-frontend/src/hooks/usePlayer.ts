import {useNavigate} from 'react-router-dom'
import {useMutation} from '@tanstack/react-query'
import {usePlayerStore} from '@stores'
import {playerApi} from '@api'

export const useEnterRoom = () => {
  const enterRoom = usePlayerStore(state => state.enterRoom)
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (roomId: string) => playerApi.enterRoom(roomId),
    onSuccess: (_, roomId: string) => {
      enterRoom(roomId)
      navigate(`/rooms/${roomId}`)
    }
  })
}

export const useLeaveRoom = () => {
  const leaveRoom = usePlayerStore(state => state.leaveRoom)
  const navigate = useNavigate()

  return useMutation({
    mutationFn: () => playerApi.leaveRoom(),
    onSuccess: () => {
      leaveRoom()
      navigate('/rooms')
    }
  })
}
