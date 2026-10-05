import {useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {useEnterRoom, useLogout, useRoomsList} from '@hooks'
import {CreateRoomModal} from './createRoomModal'
import {Loader} from '@components'
import {usePlayerStore} from '@stores'
import {IRoomResponse} from '@types'
import {EAccessLevel} from '../types/enums.ts'

export const RoomList = () => {
  const {data: rooms, isLoading} = useRoomsList()
  const enterRoom = useEnterRoom()
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [passwords, setPasswords] = useState<Record<string, string>>({})
  const navigate = useNavigate()
  const {currentRoomId} = usePlayerStore()

  useEffect(() => {
    if (currentRoomId) {
      navigate(`/rooms/${currentRoomId}`)
    }
  }, [])

  const logout = useLogout()
  const onLogout = () => logout.mutate()

  const openCreateModal = () => {
    setIsCreateModalOpen(true)
  }

  const closeCreateModal = () => {
    setIsCreateModalOpen(false)
  }

  if (isLoading) {
    return (
      <Loader title='Загрузка комнат...' />
    )
  }

  const onClickEnter = (room: IRoomResponse) => {
    if (room.accessLevel === EAccessLevel.PASSWORD) {
      const password = passwords[room.id]
      if (!password?.trim()) return
      enterRoom.mutate({roomId: room.id, password})
    } else {
      enterRoom.mutate({roomId: room.id})
    }
    navigate(`/rooms/${room.id}`)
  }

  return (
    <div className='rooms-page'>
      <div className='rooms-container'>
        <div className='rooms-toolbar'>
          <div>
            <h1 className='rooms-title'>Игровые комнаты</h1>
            <p className='rooms-subtitle'>Присоединяйтесь к игре или создайте свою</p>
          </div>

          <button
            onClick={openCreateModal}
            className='btn-primary py-2 px-4'
          >
            <svg className='w-5 h-5 inline-block mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 4v16m8-8H4' />
            </svg>
              Создать комнату
          </button>
        </div>

        {rooms?.length === 0 ? (
          <div className='rooms-empty'>
            <div className='rooms-empty-icon'>
              <svg className='rooms-empty-icon-svg' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 6v6m0 0v6m0-6h6m-6 0H6' />
              </svg>
            </div>
            <h3 className='rooms-empty-title'>Нет доступных комнат</h3>
            <p className='rooms-empty-text'>Создайте первую комнату и пригласите друзей!</p>
          </div>
        ) : (
          <div className='rooms-grid'>
            {rooms?.map((room) => (
              <div key={room.id} className='room-card'>
                <div className='room-card-header'>
                  <h3 className='room-card-title'>{room.name}</h3>
                  {room.accessLevel === 'password' && (
                    <span className='room-card-lock' title='Комната с паролем'>
                      <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' />
                      </svg>
                    </span>
                  )}
                  <span className='room-card-badge'>
                    {room.playersCount}/{room.maxPlayers}
                  </span>
                </div>

                <div className='room-card-body'>
                  <div className='room-card-players'>
                    <svg className='room-card-players-icon' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' />
                    </svg>
                    <span>
                      <span className='room-card-players-count'>{room.playersCount}</span>
                      <span className='room-card-players-max'> / {room.maxPlayers}</span> игроков
                    </span>
                  </div>

                  <div className='room-card-progress'>
                    <div
                      className='room-card-progress-bar'
                      style={{width: `${(room.playersCount / room.maxPlayers) * 100}%`}}
                    />
                  </div>
                </div>

                {room.accessLevel === 'password' && (
                  <input
                    type='password'
                    className='room-card-password'
                    placeholder='Пароль комнаты'
                    value={passwords[room.id] ?? ''}
                    onChange={(e) =>
                      setPasswords((prev) => ({...prev, [room.id]: e.target.value}))
                    }
                  />
                )}

                <button
                  onClick={() => onClickEnter(room)}
                  className='btn-primary w-full py-2.5 px-4 text-sm'
                >
                        Присоединиться
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <CreateRoomModal
        isOpen={isCreateModalOpen}
        onClose={closeCreateModal}
      />
    </div>
  )
}
