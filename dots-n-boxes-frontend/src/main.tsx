import React from 'react'
import ReactDOM from 'react-dom/client'
import {RouterProvider} from 'react-router-dom'
import toast from 'react-hot-toast'
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import {router} from '@router'
import '@styles'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        // Быстро ретраим сетевые ошибки
        if (error.message === 'Network Error') return failureCount < 2
        // Серверные ошибки - 1 попытка
        if (error.status >= 500) return failureCount < 1
        return false
      }
    },
    mutations: {
      onError: (error) => toast.error(error.message)
    }
  }
})


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>
)
