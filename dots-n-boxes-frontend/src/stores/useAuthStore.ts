import {create} from 'zustand'
import {persist} from 'zustand/middleware'

interface IAuthState {
  name: string
  accessToken: string
  isAuthenticated: boolean
}

interface IAuthActions {
  login: (name: string, accessToken: string) => void
  logout: () => void
  setAccessToken: (newToken: string) => void
}

type AuthStore = IAuthState & IAuthActions

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      name: '',
      accessToken: '',
      isLoading: false,
      isAuthenticated: false,

      login: (name: string, accessToken: string) => {
        set({name, accessToken, isAuthenticated: true})
      },
      logout: () => {
        set({name: '', accessToken: '', isAuthenticated: false})
      },
      setAccessToken: (newToken: string) => {
        set({accessToken: newToken})
      }
    }),
    {
      name: 'auth-storage'
    }
  )
)
