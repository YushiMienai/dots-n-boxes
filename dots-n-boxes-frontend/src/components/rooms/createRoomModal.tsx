import {useState} from 'react'
import {useCreateRoom} from '@hooks'
import {EAccessLevel, IRoomRequest} from '@types'
import {ACCESS_OPTIONS, PLAYER_COUNTS} from '@constants'
import {getErrorMessage} from '@utils'

interface CreateRoomModalProps {
  isOpen: boolean
  onClose: () => void
}

const initialState: IRoomRequest = {
  name: '',
  maxPlayers: 2,
  accessLevel: EAccessLevel.PUBLIC,
  password: undefined
}

export const CreateRoomModal = ({isOpen, onClose}: CreateRoomModalProps) => {
  const [roomData, setRoomData] = useState<IRoomRequest>(initialState)
  const {mutate, error, isError} = useCreateRoom()

  const handleCreate = () => {
    const payload: IRoomRequest = roomData.accessLevel === EAccessLevel.PASSWORD ? roomData : {...roomData, password: undefined}
    mutate(payload)
    onClose()
    setRoomData(initialState)
  }

  const handleChange = (value: string) => {
    const accessLevel = value as EAccessLevel
    setRoomData(prev => ({
      ...prev,
      accessLevel,
      password: accessLevel === EAccessLevel.PASSWORD ? prev.password : undefined,
    }))
  }

  if (!isOpen) return null

  return (
    <div className='modal-overlay'>
      <div>
        <h2>Создать комнату</h2>

        <div className='modal-body'>
          <div>
            <label>Название комнаты</label>
            <input
              type='text'
              value={roomData.name}
              onChange={(e) => setRoomData(prev => ({...prev, name: e.target.value}))}
              placeholder='Введите название комнаты'
              className='input'
            />
          </div>

          <div>
            <label>Доступ</label>
            <select
              value={roomData.accessLevel}
              onChange={(e) => handleChange(e.target.value)}
              className='input'
            >
              {ACCESS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <p className='text-xs text-gray-500 mt-1'>
              {ACCESS_OPTIONS.find(o => o.value === roomData.accessLevel)?.hint}
            </p>
          </div>

          {roomData.accessLevel === EAccessLevel.PASSWORD && (
            <div>
              <label>Пароль</label>
              <input
                type='password'
                value={roomData.password}
                onChange={(e) => setRoomData(prev => ({...prev, password: e.target.value}))}
                placeholder='Введите пароль комнаты'
                className='input'
              />
            </div>
          )}

          <div>
            <label>Максимум игроков</label>
            <select
              value={roomData.maxPlayers}
              onChange={(e) => setRoomData(prev => ({...prev, maxPlayers: Number(e.target.value)}))}
              className='input'
            >
              {PLAYER_COUNTS.map((n) => (
                <option key={n} value={n}>{n} игрока</option>
              ))}
            </select>
          </div>
        </div>

        {isError && (
          <div className='errorBlock'>
            <p className='errorText'>{getErrorMessage(error)}</p>
          </div>
        )}

        <div className='flex gap-3 justify-end'>
          <button
            onClick={onClose}
            className='btn-secondary'
          >
              Отмена
          </button>
          <button
            onClick={handleCreate}
            disabled={!roomData.name.trim() || (roomData.accessLevel === EAccessLevel.PASSWORD && !roomData?.password?.trim())}
            className='px-4 py-2 btn-primary'
          >
              Создать
          </button>
        </div>
      </div>
    </div>
  )
}
