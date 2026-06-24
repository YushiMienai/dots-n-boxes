import {useNavigate} from 'react-router-dom'
import {useMutation, useQuery} from '@tanstack/react-query'
import {authApi} from '@api'
import {useAuthStore} from '@stores'
import {IAuthResponse} from '@types'

export const useLogin = () => {
  const navigate = useNavigate()
  const loginStore = useAuthStore(state => state.login)

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      loginStore(data.name, data.accessToken)
      navigate('/rooms')
    },
  })
}

export const useRegister = () => {
  const navigate = useNavigate()
  const loginStore = useAuthStore(state => state.login)

  return useMutation({
    mutationFn: authApi.register,
    onSuccess: (data: IAuthResponse) => {
      loginStore(data.name, data.accessToken)
      navigate('/rooms')
    },
  })
}

export const useLogout = () => {
  const navigate = useNavigate()
  const logout = useAuthStore(state => state.logout)

  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      logout()
      navigate('/login')
    }
  })
}

export const useRefreshToken = () => {
  const {setAccessToken, logout} = useAuthStore()

  return useMutation({
    mutationFn: authApi.refreshToken,
    onSuccess: newToken => setAccessToken(newToken),
    onError: logout
  })
}

/*
export const useProfile = () => {
  const token = useAuthStore(state => state.token)
  const setPlayer = useAuthStore(state => state.setPlayer)

  return useQuery({
    queryKey: ['profile'],
    queryFn: () => authApi.login(token!),
    enabled: !!token, // Запрос только если есть токен
    onSuccess: (data) => {
      setUser = useAuthStore(state => state.setUser)(data.user)
    },
    staleTime: 5 * 60 * 1000, // 5 минут
  })
}*/
