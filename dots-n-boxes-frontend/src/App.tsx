import {useEffect} from 'react'
import {Outlet} from 'react-router-dom'
import {Toaster} from 'react-hot-toast'
import {Menu} from '@components'
import {socket} from '@utils'

export const App = () => {
  useEffect(() => {
    socket.connect()
    return () => {
      socket.disconnect()
    }
  }, [])

  return (
    <>
      <Toaster
        position='top-right'
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10b981',
              secondary: 'white',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: 'white',
            },
          },
        }}
      />
      <Menu />
      <main className='pt-16'>
        <Outlet />
      </main>
    </>
  )
}
