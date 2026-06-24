import {IRoomResponse, IRoomRequest} from '@types'
import {API_CONFIG} from '@config'
import {apiClient} from './apiClient'

const roomsEndpoints = API_CONFIG.endpoints.rooms

export const roomApi = {
  getList: async (): Promise<IRoomResponse[]> => {
    const {data} = await apiClient.get<IRoomResponse[]>(roomsEndpoints.list)
    return data as IRoomResponse[]
  },

  createRoom: async (roomData: IRoomRequest): Promise<IRoomResponse> => {
    const {data} = await apiClient.post<IRoomResponse>(roomsEndpoints.create, roomData)
    return data as IRoomResponse
  },
}
