import {useState, useEffect} from 'react'
import {v4 as uuidv4} from 'uuid'
import {useNavigate, useParams} from 'react-router-dom'
import {useGameStore, usePlayerStore, useRoomStore} from '@stores'
import {GameCanvas} from '@components'
import {IPlayer} from '@types'

export const GameBoard = () => {
  const {id} = useParams<{id: string}>()
  const {players, name} = useRoomStore()
  const {currentRoomId} = usePlayerStore()

  const navigate = useNavigate()

  // Проверка доступа к комнате
  useEffect(() => {
    if (!currentRoomId || currentRoomId !== id) {
      navigate('/rooms')
    }
  }, [id, currentRoomId, navigate])

  const handleLineClick = (lineId: string) => {
    console.log('Line clicked:', lineId)
    // TODO: отправка на бэк
  }

  return (
    <div className='min-h-screen bg-linear-to-br from-blue-50 to-indigo-100'>
      <div className='bg-white shadow-sm border-b border-gray-200'>
        <div className='max-w-7xl mx-auto px-4 py-4'>
          <div className='flex items-center justify-between'>
            <h1 className='text-2xl font-bold text-gray-900'>
              Комната: {name}
            </h1>
            <div className='flex items-center gap-2 text-gray-600'>
              <span className='font-medium'>Игроков:</span>
              <span className='bg-blue-100 text-blue-800 px-3 py-1 rounded-full'>
                {players.length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Список игроков */}
      <div className='max-w-7xl mx-auto px-4 py-4'>
        <div className='bg-white rounded-lg shadow p-4'>
          <h2 className='text-lg font-semibold mb-3'>Игроки в комнате:</h2>
          <div className='space-y-2'>
            {players.map((player: IPlayer) => (
              <div key={uuidv4()} className='flex items-center gap-2'>
                <div className='w-2 h-2 bg-green-500 rounded-full'></div>
                <span className='text-gray-700'>{player.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* TODO: игровое поле */}
      <div className='max-w-7xl mx-auto px-4'>
        <div className='bg-white rounded-lg shadow p-8 text-center text-gray-500'>
          Скоро здесь будет игровое поле...
        </div>
      </div>
    </div>
  )
}
