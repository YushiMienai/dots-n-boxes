import {useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {useRoomsList, useLogout, useEnterRoom} from '@hooks'
import {CreateRoomModal} from './createRoomModal'
import {Loader} from '@components'
import {usePlayerStore} from "@stores"

export const RoomList = () => {
  const {data: rooms, isLoading} = useRoomsList()
  const enterRoom = useEnterRoom()
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
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

  const onClickEnter = (roomId: string) => {
    enterRoom.mutate(roomId)
    navigate(`/rooms/${roomId}`)
  }

  return (
    <div className='min-h-screen bg-linear-to-br from-sky-50 to-indigo-100'>
      {/* Заголовок на всю ширину - как было */}
      <div className='bg-white shadow-sm border-b border-gray-200'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <div className='bg-sky-600 w-10 h-10 rounded-full flex items-center justify-center'>
                <svg className='w-5 h-5 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' />
                </svg>
              </div>
              <div>
                <h1 className='text-2xl font-bold text-gray-900'>Игровые комнаты</h1>
                <p className='text-sm text-gray-600'>Присоединяйтесь к игре или создайте свою</p>
              </div>
            </div>

            <div className='flex items-center gap-3'>
              <button
                onClick={openCreateModal}
                className='bg-sky-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 hover:bg-sky-700 focus:ring-2 focus:ring-sky-500 focus:ring-offset-2'
              >
                <svg className='w-5 h-5 inline-block mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 4v16m8-8H4' />
                </svg>
                Создать комнату
              </button>

              <button
                onClick={onLogout}
                className='p-2 text-gray-500 hover:text-gray-700 transition-colors'
                title='Выйти'
              >
                <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1' />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Контент */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {rooms?.length === 0 ? (
          <div className='bg-white rounded-2xl shadow-xl p-12 text-center'>
            <div className='bg-sky-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4'>
              <svg className='w-8 h-8 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 6v6m0 0v6m0-6h6m-6 0H6' />
              </svg>
            </div>
            <h3 className='text-2xl font-bold text-gray-900 mb-2'>Нет доступных комнат</h3>
            <p className='text-gray-600 mb-6'>Создайте первую комнату и пригласите друзей!</p>
            <button
              onClick={openCreateModal}
              className='bg-sky-600 text-white font-semibold py-3 px-8 rounded-lg transition duration-200 hover:bg-sky-700 focus:ring-2 focus:ring-sky-500 focus:ring-offset-2'
            >
              Создать комнату
            </button>
          </div>
        ) : (
          <div className='grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
            {rooms?.map((room) => (
              <div key={room.id} className='bg-white rounded-2xl shadow-xl p-6 hover:shadow-lg transition-shadow border border-gray-100'>
                <div className='flex items-start justify-between mb-4'>
                  <h3 className='font-semibold text-gray-900 text-lg'>{room.name}</h3>
                  <span className='text-xs font-medium text-sky-600 bg-sky-50 px-2 py-1 rounded-full border border-sky-100'>
                    {room.playersCount}/{room.maxPlayers}
                  </span>
                </div>

                <div className='space-y-3 mb-4'>
                  <div className='flex items-center text-sm text-gray-600'>
                    <svg className='w-4 h-4 mr-2 text-sky-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' />
                    </svg>
                    <span>
                      <span className='font-medium text-gray-900'>{room.playersCount}</span>
                      <span className='text-gray-400'> / {room.maxPlayers}</span> игроков
                    </span>
                  </div>

                  {/* Прогресс заполнения */}
                  <div className='w-full h-1.5 bg-gray-100 rounded-full overflow-hidden'>
                    <div
                      className='h-full bg-sky-600 rounded-full transition-all'
                      style={{width: `${(room.playersCount / room.maxPlayers) * 100}%`}}
                    />
                  </div>
                </div>

                <button
                  onClick={() => onClickEnter(room.id)}
                  className='block w-full text-center bg-sky-600 text-white font-semibold py-2.5 px-4 rounded-lg transition duration-200 hover:bg-sky-700 focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 text-sm'
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
