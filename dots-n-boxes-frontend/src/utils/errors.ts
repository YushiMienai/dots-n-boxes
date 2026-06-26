import axios from 'axios'

export const getErrorMessage = (err: unknown): string => {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as { message?: string | string[] }

    if (data?.message) {
      if (Array.isArray(data.message)) {
        return data.message.join(', ')
      }
      return data.message
    }

    return err.message || 'Ошибка соединения'
  }

  if (err instanceof Error) {
    return err.message
  }

  return 'Неизвестная ошибка'
}
