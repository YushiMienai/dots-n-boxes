import {IAuthResponse, ILoginRequest, IRegisterRequest} from '@types'
import {API_CONFIG} from '@config'
import {authClient} from './apiClient'

const authEndpoints = API_CONFIG.endpoints.auth

export const authApi = {
  login: async (credentials: ILoginRequest): Promise<IAuthResponse> => {
    const {data} = await authClient.post<IAuthResponse>(authEndpoints.login, credentials)
    return data as IAuthResponse
  },

  register: async (credentials: IRegisterRequest): Promise<IAuthResponse> => {
    const {data} = await authClient.post<IAuthResponse>(authEndpoints.register, credentials)
    return data as IAuthResponse
  },

  logout: () => authClient.delete(authEndpoints.logout),

  /*getProfile: async (): Promise<IPlayer> => {
    const {data} = await authClient.get<{player: IPlayer}>(API_CONFIG.endpoints.player.me)
    return data as IPlayer
  },*/

  refreshToken: async (): Promise<string> => {
    const {data} = await authClient.post<{accessToken: string}>(authEndpoints.refresh)
    const {accessToken} = await data
    return accessToken
  }
}
