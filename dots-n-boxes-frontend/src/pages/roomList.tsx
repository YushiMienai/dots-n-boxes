import {useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {useEnterRoom, useRoomsList} from '@hooks'
import {Loader, RoomCard, RoomsEmpty, CreateRoomModal} from '@components'
import {usePlayerStore} from '@stores'
import {PLUS} from '@svg'
import {EAccessLevel, IRoomResponse} from '@types'

export const RoomList = () => {
  const {data: rooms, isLoading} = useRoomsList()
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const navigate = useNavigate()
  const enterRoom = useEnterRoom()
  const {currentRoomId} = usePlayerStore()

  useEffect(() => {
    if (currentRoomId) {
      navigate(`/rooms/${currentRoomId}`)
    }
  }, [currentRoomId, navigate])

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

  const onClickEnter = (room: IRoomResponse, password?: string) => {
    if (room.accessLevel === EAccessLevel.PASSWORD) {
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
        <div className='rooms-header'>
          <div className='rooms-header-content'>
            <h1 className='rooms-header-title'>Игровые комнаты</h1>
            <p className='rooms-header-subtitle'>Присоединяйтесь к игре или создайте свою</p>
          </div>

          <button
            onClick={openCreateModal}
            className='btn-primary py-2 px-4'
          >
            <svg className='w-5 h-5 inline-block mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d={PLUS} />
            </svg>
            Создать комнату
          </button>
        </div>

        {rooms?.length === 0 ? <RoomsEmpty /> : (
          <div className='rooms-grid'>
            {rooms?.map((room) => (
              <RoomCard
                key={room.id}
                room={room}
                onClickEnter={onClickEnter}
              />
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
