import {apiClient} from './apiClient'
import {API_CONFIG} from '@config'
import {IPlayer} from '@types'

const playerEndpoints = API_CONFIG.endpoints.player

export const playerApi = {
  enterRoom: (id: string, password?: string) => apiClient.put(playerEndpoints.room.enter(id), {password}),
  leaveRoom: () => apiClient.delete(playerEndpoints.room.leave),
  getMe: (): Promise<IPlayer> => apiClient.get(playerEndpoints.me),
  updateMe: (data: IPlayer) => apiClient.put(playerEndpoints.update, data),
  getCurrentRoom: async (): Promise<string | null> => {
    const {data} = await apiClient.get(playerEndpoints.room.current)
    return data.currentRoomId
  }
}
