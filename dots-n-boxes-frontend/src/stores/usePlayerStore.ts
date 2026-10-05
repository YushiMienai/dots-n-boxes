import {create} from 'zustand'
import {persist} from 'zustand/middleware'

interface PlayerState {
  id: string
  name: string
  currentRoomId: string
}

interface PlayerActions {
  update: (id: string, name: string) => void
  enterRoom: (roomId: string, password?: string) => void
  leaveRoom: () => void
}

type PlayerStore = PlayerState & PlayerActions

export const usePlayerStore = create<PlayerStore>()(
  persist(
    (set) => ({
      id: '',
      name: '',
      currentRoomId: '',

      update: (id: string, name: string) => {
        set({id, name})
      },
      enterRoom: (currentRoomId: string) => {
        set({currentRoomId})
      },
      leaveRoom: () => {
        set({currentRoomId: ''})
      }
    }),
    {
      name: 'player-store'
    }
  )
)
