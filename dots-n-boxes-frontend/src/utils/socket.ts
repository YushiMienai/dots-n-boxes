import {io} from 'socket.io-client'
import {useAuthStore} from '@stores'
import {API_CONFIG} from '@config'
import {authApi} from '@api'

export const socket = io(API_CONFIG.baseURL, {
  autoConnect: false,   // подключимся сами, когда понадобится
  auth: (cb) => {
    // Вызывается при каждом (пере)подключении — всегда свежий токен
    cb({token: useAuthStore.getState().accessToken})
  },
})

let isRefreshing = false

socket.on('connect_error', async (err) => {
  if (err.message.includes('JWTExpired') && !isRefreshing) {
    isRefreshing = true
    try {
      const accessToken = await authApi.refreshToken()
      useAuthStore.getState().setAccessToken(accessToken)  // ← .accessToken
      socket.disconnect()
      socket.connect()
    } catch {
      useAuthStore.getState().logout()
      window.location.href = '/login'
    } finally {
      isRefreshing = false
    }
  }
})
