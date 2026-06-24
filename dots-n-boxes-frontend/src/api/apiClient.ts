import axios, {AxiosError, InternalAxiosRequestConfig} from 'axios'
import {API_CONFIG} from '@config'
import {useAuthStore} from '@stores'

// Расширяем интерфейс для хранения retry флага
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const apiConfig = {
  baseURL: API_CONFIG.baseURL,
  withCredentials: true,
  headers: {'Content-Type': 'application/json'},
  timeout: 10000
}

const refreshEndpoint = API_CONFIG.endpoints.auth.refresh

export const authClient = axios.create(apiConfig)

export const apiClient = axios.create(apiConfig)

// Флаги для рефреша
let isRefreshing = false
let failedQueue: Array<{
  resolve: (value: unknown) => void
  reject: (reason?: unknown) => void
}> = []

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

// Интерцептор для добавления access token к запросам
apiClient.interceptors.request.use(
  (config: CustomAxiosRequestConfig) => {
    const accessToken = useAuthStore.getState().accessToken
    console.log(accessToken)

    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }

    // Логирование запросов в dev режиме
    if (import.meta.env.DEV) {
      console.log(`🚀 [API] ${config.method?.toUpperCase()} ${config.url}`, config)
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Интерцептор для обработки ответов и рефреша токена
apiClient.interceptors.response.use(
  (response) => {
    // Логирование ответов в dev режиме
    if (import.meta.env.DEV) {
      console.log(`✅ [API] ${response.config.method?.toUpperCase()} ${response.config.url}`, response.data)
    }
    return response
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig

    // Если нет конфига или это запрос на рефреш - пробрасываем ошибку
    if (!originalRequest || originalRequest.url?.includes(refreshEndpoint)) {
      return Promise.reject(error)
    }

    // Если ошибка 401 и это не повторный запрос
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Если уже обновляем токен, добавляем в очередь
        return new Promise((resolve, reject) => {
          failedQueue.push({resolve, reject})
        })
          .then(() => {
            return apiClient(originalRequest)
          })
          .catch((err) => {
            return Promise.reject(err)
          })
      }

      originalRequest._retry = true
      isRefreshing = true

      const setAccessToken = useAuthStore.getState().setAccessToken

      try {
        // Пытаемся обновить токен
        const response = await axios.post(
          `${API_CONFIG.baseURL}${refreshEndpoint}`,
          {},
          {withCredentials: true}
        )

        const {accessToken} = response.data

        // Сохраняем новый токен
        setAccessToken(accessToken)

        // Обновляем заголовок в оригинальном запросе
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`
        }

        // Обрабатываем очередь
        processQueue(null, accessToken)

        // Повторяем оригинальный запрос
        return apiClient(originalRequest)
      } catch (refreshError) {
        // Ошибка рефреша - чистим всё и редирект на логин
        processQueue(refreshError as Error, null)
        setAccessToken('')

        // Редирект на страницу логина
        window.location.href = '/login'

        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    // Логирование ошибок в dev режиме
    if (import.meta.env.DEV) {
      console.error(`❌ [API] ${originalRequest.method?.toUpperCase()} ${originalRequest.url}`, error.response?.data || error.message)
    }

    // Преобразуем ошибку в читаемый формат
    const errorMessage = (error.response?.data as {message?: string})?.message || error.message || 'Произошла ошибка'
    return Promise.reject(new Error(errorMessage))
  }
)
