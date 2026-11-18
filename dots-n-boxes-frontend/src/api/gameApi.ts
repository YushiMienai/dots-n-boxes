import {API_CONFIG} from '@config'
import {apiClient} from './apiClient.ts'

const gameEndpoints = API_CONFIG.endpoints.game

export const gameApi = {
  move: (x: number, y: number) => apiClient.post(gameEndpoints.move, {x, y})
}
