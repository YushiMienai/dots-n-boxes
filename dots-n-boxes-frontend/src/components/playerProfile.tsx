import React from 'react'
import {useAuthStore} from '@stores'

export const PlayerProfile: React.FC = () => {
  const {player, logout} = useAuthStore()

  if (!player) return null

  return (
    <div className="flex items-center justify-between bg-white rounded-lg shadow-sm p-4">
      <div className="flex items-center space-x-3">
        <div
          className="w-10 h-10 rounded-full border-2 border-gray-200"
          style={{backgroundColor: player.color}}
        />
        <div>
          <div className="font-medium text-gray-800">{player.name}</div>
          <div className="text-sm text-gray-500 flex items-center space-x-1">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            <span>Online</span>
          </div>
        </div>
      </div>
      <button
        onClick={logout}
        className="logout-button text-sm"
      >
        Выйти
      </button>
    </div>
  )
}