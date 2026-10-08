import {useState} from 'react'
import {EAccessLevel, IRoomResponse} from '@types'
import {LOCK, PLAYERS} from '@svg'

interface RoomCardProps {
  room: IRoomResponse
  onClickEnter: (room: IRoomResponse, password?: string) => void
}

export const RoomCard = ({room, onClickEnter}: RoomCardProps) => {
  const [password, setPassword] = useState<string>('')

  const isEnterDisabled = (room: IRoomResponse) =>
    room.accessLevel === EAccessLevel.PASSWORD && !password?.trim()

  return (
    <div className='room-card'>
      <div className='room-card-header'>
        <h3 className='room-card-title'>{room.name}</h3>
        {room.accessLevel === EAccessLevel.PASSWORD && (
          <span className='room-card-lock' title='Комната с паролем'>
            <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d={LOCK} />
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
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d={PLAYERS} />
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
          className='input room-card-password'
          placeholder='Пароль комнаты'
          value={password ?? ''}
          onChange={(e) => setPassword(e.target.value)}
        />
      )}

      <button
        onClick={() => onClickEnter(room, password)}
        disabled={isEnterDisabled(room)}
        className='btn-primary w-full py-2.5 px-4 text-sm mt-auto'
      >
        Присоединиться
      </button>
    </div>
  )
}