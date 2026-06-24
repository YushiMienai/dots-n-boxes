import {useMutation, useQuery} from '@tanstack/react-query'
import {roomApi} from '@api'
import {useNavigate} from 'react-router-dom'
import {usePlayerStore} from '@stores'
import {IRoomResponse} from '@types'



export const useRoomsList = () => {
  return useQuery<IRoomResponse[]>({
    queryKey: ['rooms'],
    queryFn: () => roomApi.getList(),
    staleTime: 30000,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true
  })
}

export const useCreateRoom = () => {
  const navigate = useNavigate()
  const enterRoom = usePlayerStore(state => state.enterRoom)

  return useMutation({
    mutationFn: roomApi.createRoom,
    onSuccess: (data: IRoomResponse) => {
      enterRoom(data.id)
      navigate(`/rooms/${data.id}`)
    }
  })
}
