import {useState} from 'react'
import {useCreateRoom} from '@hooks'
import {IRoomRequest, AccessLevel} from '@types'

interface CreateRoomModalProps {
  isOpen: boolean
  onClose: () => void
}

const initialState: IRoomRequest = {
  name: '',
  maxPlayers: 2,
  accessLevel: 'public',
  password: '',
}

const ACCESS_OPTIONS: {value: AccessLevel; label: string; hint: string}[] = [
  {value: 'public',      label: 'Публичная',            hint: 'Заходит кто угодно'},
  {value: 'password',    label: 'По паролю',            hint: 'Нужен пароль для входа'},
  {value: 'friends_only', label: 'Только для друзей',   hint: 'Друзья владельца + по инвайту'},
  {value: 'invite_only', label: 'Только по приглашению', hint: 'Вход только по инвайт-ссылке'},
]

export const CreateRoomModal = ({isOpen, onClose}: CreateRoomModalProps) => {
  const [roomData, setRoomData] = useState<IRoomRequest>(initialState)
  const {mutate, error, isError, data} = useCreateRoom()

  const handleCreate = () => {
    // Пароль отправляем только для password-уровня
    const payload: IRoomRequest = {
      ...roomData,
      password: roomData.accessLevel === 'password' ? roomData.password : '',
    }
    mutate(payload)
    console.log('Creating room:', payload)
    onClose()
    setRoomData(initialState)
  }

  if (!isOpen) return null

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg p-6 max-w-md w-full mx-4'>
        <h2 className='text-xl font-bold mb-4'>Создать комнату</h2>

        <div className='space-y-4 mb-6'>
          <div>
            <label className='block text-sm font-medium mb-2'>Название комнаты</label>
            <input
              type='text'
              value={roomData.name}
              onChange={(e) => setRoomData(prev => ({...prev, name: e.target.value}))}
              placeholder='Введите название комнаты'
              className='w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500'
            />
          </div>

          <div>
            <label className='block text-sm font-medium mb-2'>Доступ</label>
            <select
              value={roomData.accessLevel}
              onChange={(e) => {
                const accessLevel = e.target.value as AccessLevel
                setRoomData(prev => ({
                  ...prev,
                  accessLevel,
                  // при уходе с password — очищаем пароль
                  password: accessLevel === 'password' ? prev.password : '',
                }))
              }}
              className='w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500'
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

          {roomData.accessLevel === 'password' && (
            <div>
              <label className='block text-sm font-medium mb-2'>Пароль</label>
              <input
                type='password'
                value={roomData.password}
                onChange={(e) => setRoomData(prev => ({...prev, password: e.target.value}))}
                placeholder='Введите пароль комнаты'
                className='w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500'
              />
            </div>
          )}

          <div>
            <label className='block text-sm font-medium mb-2'>Максимум игроков</label>
            <select
              value={roomData.maxPlayers}
              onChange={(e) => setRoomData(prev => ({...prev, maxPlayers: Number(e.target.value)}))}
              className='w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500'
            >
              <option value={2}>2 игрока</option>
              <option value={3}>3 игрока</option>
              <option value={4}>4 игрока</option>
            </select>
          </div>
        </div>

        <div className='flex gap-3 justify-end'>
          <button
            onClick={onClose}
            className='px-4 py-2 border border-gray-300 rounded hover:bg-gray-50'
          >
              Отмена
          </button>
          <button
            onClick={handleCreate}
            disabled={!roomData.name.trim() || (roomData.accessLevel === 'password' && !roomData.password.trim())}
            className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed'
          >
              Создать
          </button>
        </div>
      </div>
    </div>
  )
}
