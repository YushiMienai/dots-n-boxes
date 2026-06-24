import {create} from 'zustand'
import {IPlayer} from '@types'

interface RoomState {
  id: string
  name: string
  maxPlayers: number
  players: IPlayer[]
  isLoading: boolean
}

interface RoomActions {
  addPlayer: (player: IPlayer) => void
  removePlayer: (id: string) => void
  changeName: (name: string) => void
  setLoading: (loading: boolean) => void
}

type RoomStore = RoomState & RoomActions

export const useRoomStore = create<RoomStore>()(
  (set, get) => ({
    id: null,
    name: '',
    maxPlayers: 2,
    players: [],
    addPlayer: (player) => {
      const {players, maxPlayers} = get()

      // Проверяем не достигнут ли лимит игроков
      if (players.length >= maxPlayers) {
        console.warn(`Cannot add player. Room is full (${maxPlayers} players max)`)
        return
      }

      // Проверяем нет ли уже игрока с таким id
      const playerExists = players.some(p => p.id === player.id)
      if (playerExists) {
        console.warn(`Player with id "${player.id}" already exists`)
        return
      }

      // Добавляем игрока
      set({
        players: [...players, player]
      })
    },

    removePlayer: (id: string) => {
      const {players} = get()
      set({
        players: players.filter(player => player.id !== id)
      })
    },

    changeName: (name: string) => {
      set({name})
    },

    setLoading: (loading: boolean) => {
      set({isLoading: loading})
    }
  }),
  {name: 'room-store'}
)