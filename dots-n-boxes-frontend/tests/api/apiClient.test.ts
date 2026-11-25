import {describe, it, expect, vi, beforeEach} from 'vitest'
import axios, {AxiosError, InternalAxiosRequestConfig} from 'axios'
import {apiClient} from '../../src/api/apiClient'
import {API_CONFIG} from '@config'
import {useAuthStore} from '@stores'
import {socket} from '@utils'

const authEndpoints = API_CONFIG.endpoints.auth
const playerEndpoints = API_CONFIG.endpoints.player

const createAxiosError = (status: number, config: InternalAxiosRequestConfig, data?: unknown) => {
  return new AxiosError(
    `Request failed with status code ${status}`,
    String(status),
    config,
    null,
    {
      status,
      statusText: status === 401 ? 'Unauthorized' : 'Error',
      headers: {},
      config,
      data: data ?? {},
    }
  )
}

describe('apiClient interceptors', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    localStorage.clear()
    useAuthStore.getState().logout()
    vi.stubGlobal('location', {href: ''})
  })

  it('добавляет заголовок Authorization, если в сторе есть accessToken', async () => {
    const accessToken = 'valid-token-123'
    useAuthStore.getState().login('Алексей', accessToken)

    const mockAdapter = vi.fn(async (config) => ({
      data: {ok: true},
      status: 200,
      statusText: 'OK',
      headers: {},
      config,
    }))
    apiClient.defaults.adapter = mockAdapter

    await apiClient.get('/rooms')

    expect(mockAdapter.mock.calls[0][0].headers.Authorization).toBe(`Bearer ${accessToken}`)
  })

  it('обновляет токен при ошибке 401, переподключает сокет и повторяет запрос', async () => {
    const freshAccessToken = 'fresh-token-999'
    const data = {secret: 'data'}
    useAuthStore.getState().login('Алексей', 'expired-token')

    const postSpy = vi.spyOn(axios, 'post').mockResolvedValueOnce({
      data: {accessToken: freshAccessToken},
    })
    const disconnectSpy = vi.spyOn(socket, 'disconnect').mockImplementation(() => socket)
    const connectSpy = vi.spyOn(socket, 'connect').mockImplementation(() => socket)

    let attempts = 0
    apiClient.defaults.adapter = vi.fn(async (config) => {
      attempts++
      if (attempts === 1) throw createAxiosError(401, config)
      return {data, status: 200, statusText: 'OK', headers: {}, config}
    })

    const response = await apiClient.get(playerEndpoints.me)

    expect(postSpy).toHaveBeenCalledWith(
      `${API_CONFIG.baseURL}${API_CONFIG.endpoints.auth.refresh}`,
      {},
      {withCredentials: true}
    )
    expect(useAuthStore.getState().accessToken).toBe(freshAccessToken)
    expect(disconnectSpy).toHaveBeenCalledTimes(1)
    expect(connectSpy).toHaveBeenCalledTimes(1)
    expect(response.data).toEqual(data)
  })

  it('ставит параллельные 401-запросы в очередь (failedQueue) и делает только один рефреш', async () => {
    useAuthStore.getState().login('Алексей', 'expired-token')

    const postSpy = vi.spyOn(axios, 'post').mockImplementationOnce(
      () =>
        new Promise((resolve) =>
          setTimeout(() => resolve({data: {accessToken: 'queued-fresh-token'}}), 30)
        )
    )
    vi.spyOn(socket, 'disconnect').mockImplementation(() => socket)
    vi.spyOn(socket, 'connect').mockImplementation(() => socket)

    apiClient.defaults.adapter = vi.fn(async (config) => {
      if (config.headers.Authorization === 'Bearer expired-token') {
        throw createAxiosError(401, config)
      }
      return {data: {url: config.url}, status: 200, statusText: 'OK', headers: {}, config}
    })

    const [res1, res2] = await Promise.all([
      apiClient.get('/rooms'),
      apiClient.get('/stats'),
    ])

    expect(postSpy).toHaveBeenCalledTimes(1)
    expect(res1.data).toEqual({url: '/rooms'})
    expect(res2.data).toEqual({url: '/stats'})
  })

  it('очищает токен и редиректит на /login, если рефреш завершился ошибкой', async () => {
    const errorMessage = 'Refresh token expired'
    useAuthStore.getState().login('Алексей', 'expired-token')

    vi.spyOn(axios, 'post').mockRejectedValueOnce(new Error(errorMessage))

    apiClient.defaults.adapter = vi.fn(async (config) => {
      throw createAxiosError(401, config)
    })

    await expect(apiClient.get(playerEndpoints.me)).rejects.toThrow(errorMessage)

    expect(useAuthStore.getState().accessToken).toBe('')
    expect(window.location.href).toBe(authEndpoints.login)
  })

  it('преобразует текст ошибки с бэкенда в объект Error для обычных ошибок', async () => {
    const errorMessage = 'Неверный логин или пароль'
    apiClient.defaults.adapter = vi.fn(async (config) => {
      throw createAxiosError(400, config, {message: errorMessage})
    })

    await expect(apiClient.post(authEndpoints.login)).rejects.toThrow(errorMessage)
  })
})
