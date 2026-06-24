import {Navigate, useLocation} from 'react-router-dom'
import {ReactNode} from 'react'
import {useAuthStore} from '@stores'

interface ProtectedRouteProps {
  children: ReactNode
}

export const ProtectedRoute = ({children}: ProtectedRouteProps) => {
  const token = useAuthStore(state => state.accessToken)
  const isAuthenticated = !!token
  const isLoading = useAuthStore(state => state.isLoading)
  const location = useLocation()

  if (isLoading) {
    return (
      <div className='loading-full'>
        <div className='loading-spinner'></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        replace
        to='/login'
        state={{from: location}}
      />
    )
  }

  return <>{children}</>
}