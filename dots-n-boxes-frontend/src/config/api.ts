const API_URL = import.meta.env.VITE_API_URL

if (!API_URL) {
  console.error('VITE_API_URL is not defined in environment variables')
}

export const API_CONFIG = {
  baseURL: API_URL || 'http://localhost:3022',
  timeout: 10000,
  endpoints: {
    // Auth
    auth: {
      login: '/login',
      register: '/register',
      logout: '/logout',
      refresh: '/refresh'
    },

    // Текущий игрок (мой профиль)
    player: {
      me: '/player',              // GET /player - мой профиль
      update: '/player',          // PUT /player - обновить
      room: {
        enter: (id: string) => `/player/room/${id}`,
        leave: '/player/room',
        current: '/player/room'
      },
      stats: '/player/stats'
    },

    // Другие игроки (публичные профили)
    players: {
      profile: (id: string) => `/players/${id}`,        // GET /players/123
      stats: (id: string) => `/players/${id}/stats`,    // GET /players/123/stats
      list: '/players'                                   // GET /players?page=1
    },

    // Комнаты
    rooms: {
      list: '/rooms',
      create: '/rooms',
      details: (id: string) => `/rooms/${id}`,
      delete: (id: string) => `/rooms/${id}`,
      players: (id: string) => `/rooms/${id}/players`   // игроки в комнате
    }
  }
}
