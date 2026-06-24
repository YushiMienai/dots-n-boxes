import {createBrowserRouter} from 'react-router-dom'
import {ProtectedRoute} from '@components'
import {Login, GameBoard, Register, RoomList} from '@pages'
import {App} from '../App'

export const router = createBrowserRouter([
  {path: '/login', element: <Login />},
  {path: '/register', element: <Register />},
  {
    path: '/',
    element:
      <ProtectedRoute>
        <App />
      </ProtectedRoute>,
    children: [
      {index: true, element: <RoomList />},
      {path: '/rooms', element: <RoomList />},
      {path: '/rooms/:id', element: <GameBoard />},
      {path: '/logout'}
    ]
  }
])
